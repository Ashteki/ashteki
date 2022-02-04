class ExtrasFactory {
    getCardExtras(card, cardStack) {
        if (card.stub.includes('mount')) {
            const extra = {
                spaceNeeded: 2, also: (stack, forge) => {
                    const ally = forge.findCards(1, (card) => card.type === 'Ally')
                    stack.push(...ally);
                }
            }
            switch (card.stub) {
                case 'summon-ghostly-mount':
                    extra.spaceNeeded += 2;
                    extra.quantity = 3;
            }
            return (extra);
        }

        switch (card.stub) {
            case 'summon-emperor-lion': return ({
                spaceNeeded: 3, also: (stack, forge) => {
                    const laws = forge.findCards(2, (card) => card.name.includes('Law'))
                    stack.push(...laws);
                }
            })
            case 'summon-fallen': return ({
                spaceNeeded: 4, quantity: 3, also: (stack, forge) => {
                    const ally = forge.findCards(1, (card) => card.type === 'Ally')
                    stack.push(...ally);
                }
            })
            case 'summon-indiglow-creeper':
            case 'summon-shadow-hound':
                return ({
                    spaceNeeded: 3, quantity: 3
                })
            case 'summon-orchid-dove':
            case 'summon-time-hopper':
                return ({
                    spaceNeeded: 2, quantity: 2
                })
            case 'bound-soul':
            case 'chant-of-revenge':
            case 'hunting-weapons':
            case 'rally-the-troops':
            case 'shepherd-of-lost-souls':
                return ({
                    spaceNeeded: 2, also: (stack, forge) => {
                        const ally = forge.findCards(1, (card) => card.type === 'Ally')
                        stack.push(...ally);
                    }
                });
            case 'revival-pact':
                return ({
                    spaceNeeded: 3, also: (stack, forge) => {
                        const ally = forge.findCards(2, (card) => card.type === 'Ally')
                        stack.push(...ally);
                    }
                })
            case 'summon-ice-golem':
                return ({
                    spaceNeeded: 4, quantity: 3, also: (stack, forge) => {
                        const alt = forge.findCards(1, (card) => card.type === 'Alteration Spell')
                        stack.push(...alt);
                    }
                });
            case 'polarity-mage':
                return ({
                    spaceNeeded: 2, also: (stack, forge) => {
                        const alt = forge.findCards(1, (card) => card.type === 'Alteration Spell')
                        stack.push(...alt);
                    }
                });
            case 'resummon':
                if (!cardStack.some(c => c.name.startsWith('Summon')))
                    return {
                        spaceNeeded: 2, also: (stack, forge) => {
                            const summonSpell = forge.findCards(1, (card) => card.name.startsWith('Summon'))
                            stack.push(...summonSpell);
                        }
                    }
                else
                    return undefined;
            case 'resonance':
                if (!cardStack.some(c => c.type === 'Ready Spell'))
                    return {
                        spaceNeeded: 2, also: (stack, forge) => {
                            const spell = forge.findCards(1, (card) => card.type === 'Ready Spell')
                            stack.push(...spell);
                        }
                    }
                else
                    return undefined;
            default:
                return undefined;
        }
    }
}

module.exports = ExtrasFactory;