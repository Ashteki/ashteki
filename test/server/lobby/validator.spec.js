const CampaignDeckValidator = require('../../../server/CampaignDeckValidator');

describe('Validator tests', function () {
    beforeEach(function () {
        this.validator = new CampaignDeckValidator(
            this.deckBuilder.cardsByCode,
            this.deckBuilder.precons
        );
    });

    describe('Heroic Red Rains Level 1', function () {
        it('RRHL1 deck passes validation', function () {
            const deck = {
                name: 'The Iron Men',
                phoenixborn: [
                    {
                        id: 'coal-roarkwin',
                        count: 1
                    }
                ],
                dicepool: [
                    {
                        magic: 'natural',
                        count: 5
                    },
                    {
                        magic: 'ceremonial',
                        count: 5
                    }
                ],
                cards: [
                    {
                        id: 'strengthen',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'channel-magic', // channel magic swaps
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'fester', // heroic swap
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'anchornaut',
                        count: 3
                    },
                    {
                        id: 'chant-of-revenge',
                        count: 2,
                        ff: true
                    },
                    {
                        id: 'summon-iron-rhino',
                        count: 3
                    },
                    {
                        id: 'final-stand',
                        count: 1
                    },

                    {
                        id: 'iron-worker',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'hammer-knight',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'one-hundred-blades',
                        count: 3
                    },
                    {
                        id: 'close-combat',
                        count: 3
                    }
                ],
                conjurations: [
                    {
                        id: 'iron-rhino',
                        count: 1
                    }
                ]
            };

            let result = this.validator.validateDeck(deck, 1, true);
            console.log(result);
            expect(result).not.toBeNull();
            expect(result.channelMagic).toBe(3);
            expect(result.precons.length).toBe(2);
            expect(result.pbPrecon.name).toBe('The Iron Men');
            expect(result.valid).toBeTrue();
        });

        it('RRHL2 deck fails validation', function () {
            const deck = {
                name: 'The Iron Men',
                phoenixborn: [
                    {
                        id: 'coal-roarkwin',
                        count: 1
                    }
                ],
                dicepool: [
                    {
                        magic: 'natural',
                        count: 5
                    },
                    {
                        magic: 'ceremonial',
                        count: 5
                    }
                ],
                cards: [
                    {
                        id: 'expand-energy',
                        count: 2
                    },
                    {
                        id: 'strengthen',
                        count: 1,
                        ff: true
                    },
                    {
                        id: 'channel-magic',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'regress',
                        count: 3
                    },
                    {
                        id: 'chant-of-revenge',
                        count: 2,
                        ff: true
                    },
                    {
                        id: 'summon-iron-rhino',
                        count: 3
                    },
                    {
                        id: 'final-stand',
                        count: 1
                    },
                    {
                        id: 'fester',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'iron-worker',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'hammer-knight',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'one-hundred-blades',
                        count: 3
                    },
                    {
                        id: 'close-combat',
                        count: 1
                    },
                    {
                        id: 'silver-paladin',
                        count: 2
                    }
                ],
                conjurations: [
                    {
                        id: 'iron-rhino',
                        count: 1
                    }
                ]
            };

            let result = this.validator.validateDeck(deck, 1, true);
            console.log(result);
            expect(result).not.toBeNull();
            expect(result.channelMagic).toBe(3);
            expect(result.pbPrecon.name).toBe('The Iron Men');
            expect(result.valid).toBeFalse();
        });
    });

    describe('Standard Red Rains Level 1', function () {
        it('RRSL1 deck passes validation', function () {
            const deck = {
                name: 'The Iron Men',
                phoenixborn: [
                    {
                        id: 'coal-roarkwin',
                        count: 1
                    }
                ],
                dicepool: [
                    {
                        magic: 'natural',
                        count: 5
                    },
                    {
                        magic: 'ceremonial',
                        count: 5
                    }
                ],
                cards: [
                    {
                        id: 'strengthen',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'channel-magic', // channel magic swaps
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'expand-energy',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'anchornaut',
                        count: 3
                    },
                    {
                        id: 'chant-of-revenge',
                        count: 2,
                        ff: true
                    },
                    {
                        id: 'summon-iron-rhino',
                        count: 3
                    },
                    {
                        id: 'final-stand',
                        count: 1
                    },

                    {
                        id: 'iron-worker',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'hammer-knight',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'one-hundred-blades',
                        count: 3
                    },
                    {
                        id: 'close-combat',
                        count: 3
                    }
                ],
                conjurations: [
                    {
                        id: 'iron-rhino',
                        count: 1
                    }
                ]
            };

            let result = this.validator.validateDeck(deck, 1, false);
            console.log(result);
            expect(result).not.toBeNull();
            expect(result.channelMagic).toBe(3);
            expect(result.precons.length).toBe(1);
            expect(result.pbPrecon.name).toBe('The Iron Men');
            expect(result.valid).toBeTrue();
        });

        it('RRHL1 deck fails validation', function () {
            const deck = {
                name: 'The Iron Men',
                phoenixborn: [
                    {
                        id: 'coal-roarkwin',
                        count: 1
                    }
                ],
                dicepool: [
                    {
                        magic: 'natural',
                        count: 5
                    },
                    {
                        magic: 'ceremonial',
                        count: 5
                    }
                ],
                cards: [
                    {
                        id: 'strengthen',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'channel-magic', // channel magic swaps
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'fester', // heroic swap
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'anchornaut',
                        count: 3
                    },
                    {
                        id: 'chant-of-revenge',
                        count: 2,
                        ff: true
                    },
                    {
                        id: 'summon-iron-rhino',
                        count: 3
                    },
                    {
                        id: 'final-stand',
                        count: 1
                    },

                    {
                        id: 'iron-worker',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'hammer-knight',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'one-hundred-blades',
                        count: 3
                    },
                    {
                        id: 'close-combat',
                        count: 3
                    }
                ],
                conjurations: [
                    {
                        id: 'iron-rhino',
                        count: 1
                    }
                ]
            };

            let result = this.validator.validateDeck(deck, 1, false);
            console.log(result);
            expect(result).not.toBeNull();
            expect(result.channelMagic).toBe(3);
            expect(result.precons.length).toBe(2);
            expect(result.pbPrecon.name).toBe('The Iron Men');
            expect(result.valid).toBeFalse();
        });
    });

    describe('Heroic Red Rains Level 2', function () {
        it('validate RRHL2 deck (valid)', function () {
            const deck = {
                name: 'The Iron Men',
                phoenixborn: [
                    {
                        id: 'coal-roarkwin',
                        count: 1
                    }
                ],
                dicepool: [
                    {
                        magic: 'natural',
                        count: 5
                    },
                    {
                        magic: 'ceremonial',
                        count: 5
                    }
                ],
                cards: [
                    {
                        id: 'expand-energy',
                        count: 2
                    },
                    {
                        id: 'strengthen',
                        count: 1,
                        ff: true
                    },
                    {
                        id: 'channel-magic',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'regress',
                        count: 3
                    },
                    {
                        id: 'chant-of-revenge',
                        count: 2,
                        ff: true
                    },
                    {
                        id: 'summon-iron-rhino',
                        count: 3
                    },
                    {
                        id: 'final-stand',
                        count: 1
                    },
                    {
                        id: 'fester',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'iron-worker',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'hammer-knight',
                        count: 3,
                        ff: true
                    },
                    {
                        id: 'one-hundred-blades',
                        count: 3
                    },
                    {
                        id: 'close-combat',
                        count: 1
                    },
                    {
                        id: 'silver-paladin',
                        count: 2
                    }
                ],
                conjurations: [
                    {
                        id: 'iron-rhino',
                        count: 1
                    }
                ]
            };

            let result = this.validator.validateDeck(deck, 2, true);
            console.log(result);
            expect(result).not.toBeNull();
            expect(result.channelMagic).toBe(3);
            expect(result.pbPrecon.name).toBe('The Iron Men');
            expect(result.valid).toBeTrue();
        });

        it('validate RedRains Precon deck (valid)', function () {
            const deck = {
                name: 'The Siege of Lordswall: Dimona',
                phoenixborn: [
                    {
                        id: 'dimona-odinstar',
                        count: 1
                    }
                ],
                ultimate: null,
                behaviour: null,
                dicepool: [
                    {
                        magic: 'divine',
                        count: 10
                    }
                ],
                cards: [
                    {
                        id: 'take-to-the-skies',
                        count: 3
                    },
                    {
                        id: 'glory-aspirant',
                        count: 3
                    },
                    {
                        id: 'silver-paladin',
                        count: 3
                    },
                    {
                        id: 'radiant-light',
                        count: 3
                    },
                    {
                        id: 'summon-shining-stag-mount',
                        count: 3
                    },
                    {
                        id: 'ptera-herder',
                        count: 3
                    },
                    {
                        id: 'hand-of-spear',
                        count: 3
                    },
                    {
                        id: 'pride',
                        count: 3
                    },
                    {
                        id: 'fork-lightning',
                        count: 3
                    },
                    {
                        id: 'intercession',
                        count: 3
                    }
                ],
                conjurations: [
                    {
                        id: 'shining-stag-mount',
                        count: 3
                    },
                    {
                        id: 'ptera-hatchling',
                        count: 3
                    },
                    {
                        id: 'hand-of-shield',
                        count: 1
                    },
                    {
                        id: 'empyrean-mount',
                        count: 3
                    },
                    {
                        id: 'divinity-mount',
                        count: 1
                    }
                ]
            };

            let result = this.validator.validateDeck(deck, 2, true);
            console.log(result);
            expect(result).not.toBeNull();
            expect(result.pbPrecon.name).toBe('The Siege of Lordswall: Dimona');
            expect(result.valid).toBeTrue();
        });

        it('invalid RedRains Precon deck', function () {
            const deck = {
                name: 'The Siege of Lordswall: Dimona',
                phoenixborn: [
                    {
                        id: 'dimona-odinstar',
                        count: 1
                    }
                ],
                ultimate: null,
                behaviour: null,
                dicepool: [
                    {
                        magic: 'divine',
                        count: 10
                    }
                ],
                cards: [
                    {
                        id: 'blood-shaman', // random card
                        count: 3
                    },
                    {
                        id: 'purge', // saria precon swap
                        count: 3
                    },
                    {
                        id: 'ice-trap', // invalid non-saria precon swap
                        count: 3
                    },
                    {
                        id: 'purge', // saria precon swap
                        count: 3
                    },
                    {
                        id: 'glory-aspirant',
                        count: 3
                    },

                    {
                        id: 'summon-shining-stag-mount',
                        count: 3
                    },

                    {
                        id: 'hand-of-spear',
                        count: 3
                    },
                    {
                        id: 'pride',
                        count: 3
                    },
                    {
                        id: 'fork-lightning',
                        count: 3
                    },
                    {
                        id: 'intercession',
                        count: 3
                    }
                ],
                conjurations: [
                    {
                        id: 'shining-stag-mount',
                        count: 3
                    },
                    {
                        id: 'ptera-hatchling',
                        count: 3
                    },
                    {
                        id: 'hand-of-shield',
                        count: 1
                    },
                    {
                        id: 'empyrean-mount',
                        count: 3
                    },
                    {
                        id: 'divinity-mount',
                        count: 1
                    }
                ]
            };

            let result = this.validator.validateDeck(deck, 2, true);
            console.log(result);
            expect(result).not.toBeNull();
            expect(result.pbPrecon.name).toBe('The Siege of Lordswall: Dimona');
            expect(result.valid).toBeFalse();
        });
    });
});
