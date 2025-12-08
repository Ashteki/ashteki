class CampaignDeckValidator {
    constructor(cards, precons) {
        this.cardsByCode = cards;
        this.precons = precons;
    }

    getResponseBase() {
        return {
            pbPrecon: '',
            channelMagic: 0,
            valid: null,
            precons: []
        };
    }

    validateHL2PvP(deck) {
        return this.validateDeck(deck, 2, true);
    }

    validateDeck(deck, level, heroic) {
        /*
        precon = 9 cards, 1/2 unique, 1 pb
        channel magic   -> 8-9c 1/2u 1pb
        heroic switch   -> 7-9c 1/2u 1pb
                        -> 0-1c
        Level 2
        may replace 3x3 => 4-9c 1/2u 1pb
                        -> 0-1c
                        -> 1-4c
    
        Rules
        unique must belong to pb
        pb must match precon with 4+
        precon count is max 3. base, heroic switch, L2 sub 
        */

        const maxPrecons = level + 1;
        // min precon count is 9 base - channel magic - heroic switch - (Level-1)*3 sub
        let minPbPreconCardCount = 9 - 1 - 3 * (level - 1);
        if (heroic) {
            minPbPreconCardCount -= 1;
        }
        const result = this.getResponseBase();
        // count non-pb and non-uniques by precon (exclude channel magic)
        this.doDeckPreconAnalysis(deck, result);
        this.matchPbPrecon(result, deck);

        result.valid = result.pbPrecon &&
            result.precons.length <= maxPrecons &&
            (!heroic || this.heroicCheck(level, result)) &&
            result.pbPrecon?.count >= minPbPreconCardCount; // must be 7+ cards left in the base precon
        return result;
    }

    matchPbPrecon(result, deck) {
        result.pbPrecon = result.precons
            .filter((p) => p.deck.phoenixborn[0].id === deck.phoenixborn[0].id || p.deck.precon_set)
            .reduce((prev, current) => {
                return prev?.count > current.count ? prev : current;
            }, null);

        // if pbs don't match then replace with pb deck from set (red Rains)
        if (result.pbPrecon &&
            result.pbPrecon.deck.phoenixborn[0].id !== deck.phoenixborn[0].id &&
            result.pbPrecon.deck.precon_set) {
            const matchingPrecon = this.findPbPreconFromSet(
                deck.phoenixborn[0].id,
                result.pbPrecon.deck.precon_set
            );
            result.pbPrecon.name = matchingPrecon.name;
            result.pbPrecon.deck = matchingPrecon;
        }
    }

    doDeckPreconAnalysis(deck, result) {
        deck.cards.forEach(c => {
            if (c.id === 'channel-magic') {
                result.channelMagic = c.count;
            } else {
                const card = this.cardsByCode[c.id];
                if (!card.phoenixborn) {
                    const precon = this.findCardPrecon(card);
                    const resPrecon = result.precons.find(p => p.name === precon.name);
                    if (resPrecon) {
                        resPrecon.count++;
                    } else {
                        result.precons.push({ name: precon.name, count: 1, deck: precon });
                    }
                }
            }
        });
    }

    heroicCheck(level, result) {
        const maxPrecons = level + 1;
        if (result.precons.length === maxPrecons) {
            // if you have 3 precons (base, heroic and L2) then the heroic must be a singleton
            return result.precons.some((p) => p.count === 1);
        }

        return true;
    }

    findCardPrecon(card) {
        const precons = Object.values(this.precons);
        return precons.find((p) => p.cards.some((c) => c.id === card.stub));
    }

    findPbPreconFromSet(pbId, preconSet) {
        const precons = Object.values(this.precons);
        return precons.find((p) => p.precon_set === preconSet && p.phoenixborn[0].id === pbId);
    }
}

module.exports = CampaignDeckValidator;
