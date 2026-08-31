const request = require('request');

const logger = require('../log.js');

class PatreonService {
    constructor(clientId, secret, userService, callbackUrl) {
        this.userService = userService;
        this.callbackUrl = callbackUrl;
        this.clientId = clientId;
        this.clientSecret = secret;
        this.patreonTokenUrl = 'https://www.patreon.com/api/oauth2/token';
    }

    exchangeOAuthToken(payload) {
        if (!this.clientId || !this.clientSecret) {
            return Promise.reject(new Error('Patreon OAuth client credentials are not configured'));
        }

        return new Promise((resolve, reject) => {
            request.post(
                {
                    url: this.patreonTokenUrl,
                    form: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                },
                (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (response && response.statusCode >= 400) {
                        const responseBody = typeof body === 'string' ? body : JSON.stringify(body || {});
                        logger.error(
                            'Patreon OAuth token exchange failed: status=%s body=%s',
                            response.statusCode,
                            responseBody
                        );
                        reject(
                            new Error(
                                (body && (body.error_description || body.error)) ||
                                `Patreon OAuth request failed: ${response.statusCode}`
                            )
                        );
                        return;
                    }

                    const parsed = typeof body === 'string' ? JSON.parse(body) : body;
                    if (!parsed || !parsed.access_token) {
                        reject(new Error('Patreon OAuth response was missing an access token'));
                        return;
                    }

                    resolve(parsed);
                }
            );
        });
    }

    getPatreonStatusFromMemberships(payload) {
        const data = Array.isArray(payload?.data) ? payload.data : payload?.data ? [payload.data] : [];
        const included = Array.isArray(payload?.included) ? payload.included : [];
        const memberships = [...data, ...included].filter((entry) => {
            return entry && (entry.type === 'member' || entry.type === 'membership');
        });

        for (const membership of memberships) {
            const attributes = membership.attributes || {};
            const patronStatus = attributes.patron_status;
            const currentlyEntitledTiers = Array.isArray(attributes.currently_entitled_tiers)
                ? attributes.currently_entitled_tiers
                : [];
            const pledgeAmount = Number(attributes.will_pay_amount_cents ?? attributes.pledge_amount_cents ?? 0);

            if (
                patronStatus === 'active_patron' ||
                patronStatus === 'active_patron' ||
                currentlyEntitledTiers.length > 0 ||
                pledgeAmount > 0
            ) {
                logger.info('patreon pledged for active membership');
                return 'pledged';
            }
        }

        if (memberships.length > 0 || payload?.data) {
            logger.info('patreon linked for non-pledged user');
            return 'linked';
        }

        logger.info('patreon user is not linked');
        return 'none';
    }

    requestPatreonJson(url, accessToken) {
        return new Promise((resolve, reject) => {
            request.get(
                {
                    url,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/json'
                    },
                    json: true
                },
                (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (response && response.statusCode >= 400) {
                        const responseBody = typeof body === 'string' ? body : JSON.stringify(body || {});
                        logger.error(
                            'Patreon status request failed: status=%s url=%s body=%s',
                            response.statusCode,
                            url,
                            responseBody
                        );
                        const err = new Error(body && body.error ? body.error : `Patreon API request failed: ${response.statusCode}`);
                        err.statusCode = response.statusCode;
                        reject(err);
                        return;
                    }

                    resolve(body || {});
                }
            );
        });
    }

    async getPatreonStatusForUser(user) {
        if (!user || !user.patreon || !user.patreon.access_token) {
            return 'none';
        }

        const identityUrl = 'https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields[member]=patron_status';

        const fetchStatus = async () => {
            logger.info('getting patreon status for %s', user.username);
            const response = await this.requestPatreonJson(identityUrl, user.patreon.access_token);
            logger.info('patreon response for %s: %s', user.username, JSON.stringify(response));

            return this.getPatreonStatusFromMemberships(response);
        };

        try {
            return await fetchStatus();
        } catch (err) {
            const statusCode = err && (err.statusCode || (err.response && err.response.statusCode));
            if (statusCode === 401 && user.patreon.refresh_token && this.refreshTokenForUser) {
                try {
                    const refreshed = await this.refreshTokenForUser(user);
                    if (refreshed && refreshed.access_token) {
                        user.patreon = { ...user.patreon, ...refreshed };
                        return await fetchStatus();
                    }
                } catch (refreshErr) {
                    logger.error(
                        'Error refreshing expired patreon token for %s: %s',
                        user.username,
                        await this.errorStreamToString(refreshErr)
                    );
                }
            }

            logger.error(
                'Error getting patreon status for %s: %s',
                user.username,
                await this.errorStreamToString(err)
            );

            return 'none';
        }
    }

    async refreshTokenForUser(user) {
        if (!user || !user.patreon || !user.patreon.refresh_token) {
            return undefined;
        }

        if (!this.clientId || !this.clientSecret) {
            logger.error('Patreon OAuth client credentials are not configured for refresh');
            return undefined;
        }

        let response;
        try {
            response = await this.exchangeOAuthToken({
                grant_type: 'refresh_token',
                refresh_token: user.patreon.refresh_token,
                client_id: this.clientId,
                client_secret: this.clientSecret
            });
        } catch (err) {
            logger.error(
                'Error refreshing patreon account %s',
                await this.errorStreamToString(err)
            );
            // Mark user for re-link on refresh failure
            if (this.userService) {
                try {
                    const userDetails = user.getDetails();
                    userDetails.patreon = userDetails.patreon || {};
                    userDetails.patreon.needs_relink = true;
                    await this.userService.update(userDetails);
                } catch (updateErr) {
                    logger.error('Error marking patreon for re-link: %s', updateErr.message);
                }
            }
            return undefined;
        }

        let userDetails = user.getDetails();
        // eslint-disable-next-line require-atomic-updates
        user.patreon = userDetails.patreon = response;
        // Clear re-link flag on successful refresh
        userDetails.patreon.needs_relink = false;

        try {
            await this.userService.update(userDetails);
        } catch (err) {
            logger.error(err);
            return undefined;
        }

        return response;
    }

    errorStreamToString(err) {
        if (!err) {
            return Promise.resolve('');
        }

        if (typeof err === 'string') {
            return Promise.resolve(err);
        }

        if (err.response && err.response.body) {
            if (typeof err.response.body === 'string') {
                return Promise.resolve(err.response.body);
            }

            if (err.response.body.error) {
                return Promise.resolve(err.response.body.error);
            }

            return Promise.resolve(JSON.stringify(err.response.body));
        }

        if (err.body) {
            if (typeof err.body === 'string') {
                return Promise.resolve(err.body);
            }

            if (err.body.error) {
                return Promise.resolve(err.body.error);
            }

            return Promise.resolve(JSON.stringify(err.body));
        }

        return Promise.resolve(String(err));
    }

    async linkAccount(username, code) {
        if (!code || !this.clientId || !this.clientSecret) {
            logger.error('Patreon OAuth link request is missing required configuration');
            return false;
        }

        let response;
        try {
            response = await this.exchangeOAuthToken({
                grant_type: 'authorization_code',
                code,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: this.callbackUrl
            });
        } catch (err) {
            logger.error('Error linking patreon account %s', await this.errorStreamToString(err));
            return false;
        }

        response.date = new Date();

        let user = await this.userService.getUserByUsername(username);
        if (!user) {
            logger.error('Error linking patreon account, user not found');
            return false;
        }

        user.patreon = response;

        try {
            let password = user.password;

            user.password = undefined;
            await this.userService.update(user);

            user.password = password;
        } catch (err) {
            logger.error(err);
            return false;
        }

        return user;
    }

    async unlinkAccount(username) {
        let user = await this.userService.getUserByUsername(username);
        if (!user) {
            logger.error('Error unlinking patreon account, user not found');
            return false;
        }

        user.patreon = undefined;

        try {
            await this.userService.update(user);
        } catch (err) {
            logger.error(err);
            return false;
        }

        return true;
    }
}

module.exports = PatreonService;
