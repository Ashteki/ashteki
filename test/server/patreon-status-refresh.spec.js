const PatreonService = require('../../server/services/PatreonService');

describe('Patreon status refresh on 401', function () {
    it('refreshes the access token and retries when the API rejects the current token', async function () {
        const service = new PatreonService('client-id', 'client-secret', {
            update: async () => { }
        }, 'https://example.com/patreon');

        const originalUser = {
            username: 'test-user',
            patreon: {
                access_token: 'expired-token',
                refresh_token: 'refresh-token'
            },
            getDetails() {
                return { patreon: this.patreon };
            }
        };

        const refreshedUser = {
            ...originalUser,
            patreon: {
                access_token: 'fresh-token',
                refresh_token: 'refresh-token'
            }
        };

        spyOn(service, 'requestPatreonJson').and.callFake(async (url, token) => {
            if (token === 'expired-token') {
                const err = new Error('Patreon API request failed: 401');
                err.statusCode = 401;
                throw err;
            }

            return {
                data: { id: 'user-1', type: 'user' },
                included: [{ type: 'member', attributes: { patron_status: 'active_patron' } }]
            };
        });

        spyOn(service, 'refreshTokenForUser').and.callFake(async () => {
            originalUser.patreon.access_token = 'fresh-token';
            return { access_token: 'fresh-token', refresh_token: 'refresh-token' };
        });

        const result = await service.getPatreonStatusForUser(originalUser);

        expect(result).toBe('pledged');
        expect(originalUser.patreon.access_token).toBe('fresh-token');
    });
});
