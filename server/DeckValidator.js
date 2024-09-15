class DeckValidator {
    constructor(cards, precons) {
        this.cardsByCode = cards;
        this.precons = precons;
    }

    validateRedRainsHeroicLevel2(deck) {
        const result = {
            pbPrecon: '',
            channelMagic: 0,
            valid: null,
            precons: []
        }
        // count non-pb and non-uniques by precon (exclude channel magic)
        deck.cards.forEach(c => {
            if (c.id === 'channel-magic') {
                result.channelMagic = c.count;
            } else {
                const card = this.cardsByCode[c.id];
                if (!card.phoenixborn) {
                    const precon = this.findCardPrecon(card);
                    const resPrecon = result.precons.find(p => p.name === precon.name)
                    if (resPrecon) {
                        resPrecon.count++;
                    } else {
                        result.precons.push({ name: precon.name, count: 1, deck: precon });
                    }
                }
            }
        });

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

        // get the precon with the most cards and belonging to the pb
        result.pbPrecon = result.precons
            .filter(p => p.deck.phoenixborn[0].id === deck.phoenixborn[0].id || p.deck.precon_set)
            .reduce(
                (prev, current) => {
                    return prev?.count > current.count ? prev : current
                },
                null
            );

        // if pbs don't match then replace with pb deck from set (red Rains)
        if (result.pbPrecon
            && result.pbPrecon.deck.phoenixborn[0].id !== deck.phoenixborn[0].id
            && result.pbPrecon.deck.precon_set) {
            const matchingPrecon = this.findPbPreconFromSet(deck.phoenixborn[0].id, result.pbPrecon.deck.precon_set);
            result.pbPrecon.name = matchingPrecon.name;
            result.pbPrecon.deck = matchingPrecon;
        }

        result.valid = result.pbPrecon
            && result.precons.length <= 3
            && this.heroicCheck(result)
            && result.pbPrecon?.count > 3; // must be 4+ cards left in the base precon
        return result;
    }

    heroicCheck(result) {
        if (result.precons.length === 3) {
            // if you have 3 precons (base, heroic and L2) then the heroic must be a singleton
            return result.precons.some(p => p.count === 1)
        }

        return true;
    }

    findCardPrecon(card) {
        const precons = Object.values(this.precons);
        return precons.find(p => p.cards.some(c => c.id === card.stub))
    }

    findPbPreconFromSet(pbId, preconSet) {
        const precons = Object.values(this.precons);
        return precons.find(p => p.precon_set === preconSet
            && p.phoenixborn[0].id === pbId)

    }
}

module.exports = DeckValidator;