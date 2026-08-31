const patreon = require('patreon');
const patreonOAuth = patreon.oauth;
const request = require('request');

const logger = require('../log.js');

class PatreonService {
    constructor(clientId, secret, userService, callbackUrl) {
        this.userService = userService;
        this.callbackUrl = callbackUrl;

        this.patreonOAuthClient = patreonOAuth(clientId, secret);
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
                        reject(new Error(body && body.error ? body.error : `Patreon API request failed: ${response.statusCode}`));
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

        const identityUrl = 'https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields[user]=email,first_name,last_name,full_name,vanity,is_email_verified,thumb_url,url,image_url&fields[member]=campaign_id,patron_status,current_amount_cents,currently_entitled_tiers,is_follower,pledge_cadence,pledge_amount_cents,will_pay_amount_cents';

        try {
            logger.info('getting patreon status for %s', user.username);
            const response = await this.requestPatreonJson(identityUrl, user.patreon.access_token);
            logger.info('patreon response for %s: %s', user.username, JSON.stringify(response));

            return this.getPatreonStatusFromMemberships(response);
        } catch (err) {
            logger.error(
                'Error getting patreon status for %s: %s',
                user.username,
                await this.errorStreamToString(err)
            );

            return 'none';
        }
    }

    async refreshTokenForUser(user) {
        let response;
        try {
            response = await this.patreonOAuthClient.refreshToken(user.patreon.refresh_token);
        } catch (err) {
            logger.error(
                'Error refreshing patreon account %s',
                await this.errorStreamToString(err)
            );
            return undefined;
        }

        let userDetails = user.getDetails();
        // eslint-disable-next-line require-atomic-updates
        user.patreon = userDetails.patreon = response;

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
        let response;
        try {
            response = await this.patreonOAuthClient.getTokens(code, this.callbackUrl);
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
