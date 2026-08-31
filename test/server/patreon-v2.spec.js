const PatreonService = require('../../server/services/PatreonService');

describe('Patreon API v2 membership parsing', function () {
    it('treats an active patron membership as pledged', function () {
        const service = new PatreonService('client-id', 'client-secret', null, 'https://example.com/patreon');

        const status = service.getPatreonStatusFromMemberships({
            data: { id: 'user-1', type: 'user' },
            included: [
                {
                    type: 'member',
                    attributes: {
                        patron_status: 'active_patron'
                    }
                }
            ]
        });

        expect(status).toBe('pledged');
    });

    it('marks users without active memberships as linked', function () {
        const service = new PatreonService('client-id', 'client-secret', null, 'https://example.com/patreon');

        const status = service.getPatreonStatusFromMemberships({
            data: { id: 'user-1', type: 'user' },
            included: [
                {
                    type: 'member',
                    attributes: {
                        patron_status: 'former_patron'
                    }
                }
            ]
        });

        expect(status).toBe('linked');
    });
});
