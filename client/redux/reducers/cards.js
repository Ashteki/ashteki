import { Decks } from '../types';

function selectDeck(state, deck) {
    if (state.decks && state.decks.length !== 0) {
        state.selectedDeck = deck;
    } else {
        delete state.selectedDeck;
    }

    return state;
}

function processDecks(decks, state) {
    for (let deck of decks) {
        if (!state.cards) {
            deck.status = {};

            continue;
        }

        deck.phoenixborn = deck.phoenixborn.map((card) => ({
            count: card.count,
            card: Object.assign({}, state.cards[card.id]),
            id: card.id,
            conjurations: card.conjurations
        }));
        let hasPhoenixborn = deck.phoenixborn.length === 1;

        deck.cards = deck.cards.map((card) => {
            const c = Object.assign({}, state.cards[card.id]);
            return {
                count: card.count,
                card: c,
                id: card.id,
                conjurations: c.conjurations,
                phoenixborn: c.phoenixborn
            };
        });

        deck.conjurations = deck.conjurations.map((card) => ({
            count: card.count,
            card: Object.assign({}, state.cards[card.id]),
            id: card.id
        }));
        let hasConjurations = checkConjurations(deck);
        let tenDice = 10 === deck.dicepool.reduce((acc, d) => acc + d.count, 0);

        const countUniques = deck.cards
            .filter((c) => c.card.phoenixborn)
            .reduce((agg, b) => agg + b.count, 0);
        const validUniques =
            // none for other pbs
            deck.cards.filter(
                (c) => c.card.phoenixborn && c.card.phoenixborn !== deck.phoenixborn[0].card.name
            ).length === 0 &&
            // max 3 uniques
            countUniques <= 3;
        let uniques = !hasPhoenixborn || validUniques;

        let cardCount = deck.cards.reduce((acc, card) => acc + card.count, 0);
        const legalToPlay =
            hasPhoenixborn && cardCount === 30 && hasConjurations && tenDice && uniques;
        deck.status = {
            basicRules: hasPhoenixborn && cardCount === 30,
            legalToPlay: legalToPlay,
            hasConjurations: hasConjurations,
            uniques: uniques,
            tenDice: tenDice,
            noUnreleasedCards: true,
            officialRole: true
        };
    }
}

function checkConjurations(deck) {
    let cons = deck.cards
        .concat(deck.phoenixborn)
        .filter((c) => !!c.card.conjurations)
        .reduce((acc, c) => acc.concat(c.card.conjurations), [])
        .map((c) => c.stub);
    let result = cons.reduce((a, stub) => a && deck.conjurations.some((c) => c.id === stub), true);
    return result;
}

export default function (state = { decks: [], cards: {} }, action) {
    let newState;
    switch (action.type) {
        case 'RECEIVE_CARDS':
            var decks = state.decks;

            newState = Object.assign({}, state, {
                cards: action.response.cards
            });

            if (decks.length > 0) {
                processDecks(decks, newState);

                newState.decks = decks;
            }

            return newState;
        case 'RECEIVE_ALTS':
            newState = Object.assign({}, state, {
                alts: action.response.alts
            });

            return newState;
        case 'ZOOM_CARD':
            return Object.assign({}, state, {
                zoomCard: action.card
            });
        case 'CLEAR_ZOOM':
            return Object.assign({}, state, {
                zoomCard: undefined
            });
        case Decks.DecksReceived:
            processDecks(action.response.decks, state);
            newState = Object.assign({}, state, {
                singleDeck: false,
                numDecks: action.response.numDecks,
                decks: action.response.decks
            });

            newState = selectDeck(newState, newState.decks[0]);

            return newState;
        case 'STANDALONE_DECKS_LOADED':
            if (action.response.decks) {
                processDecks(action.response.decks, state);
            }

            newState = Object.assign({}, state, {
                standaloneDecks: action.response.decks
            });

            return newState;
        case 'ADVENTURINGPARTY_DECKS_LOADED':
            if (action.response.decks) {
                processDecks(action.response.decks, state);
            }

            newState = Object.assign({}, state, {
                adventuringPartyDecks: action.response.decks
            });

            return newState;
        case 'BUILDINGBASICS_DECKS_LOADED':
            if (action.response.decks) {
                processDecks(action.response.decks, state);
            }

            newState = Object.assign({}, state, {
                buildingBasicsDecks: action.response.decks
            });

            return newState;
        case 'FIRSTADVENTURE_DECKS_LOADED':
            if (action.response.decks) {
                processDecks(action.response.decks, state);
            }

            newState = Object.assign({}, state, {
                firstAdventureDecks: action.response.decks
            });

            return newState;
        case 'PVE_DECKS_LOADED':
            if (action.response.decks) {
                processDecks(action.response.decks, state);
            }

            newState = Object.assign({}, state, {
                pveDecks: action.response.decks
            });

            return newState;
        case 'CHIMERA_DECKS_LOADED':
            if (action.response.decks) {
                processDecks(action.response.decks, state);
            }

            newState = Object.assign({}, state, {
                chimeraDecks: action.response.decks
            });

            return newState;
        case 'REQUEST_DECK':
            return Object.assign({}, state, {
                deckSaved: false,
                deckDeleted: false
            });
        case Decks.RequestDecks:
            newState = Object.assign({}, state, {
                deckSaved: false,
                deckDeleted: false
            });

            return newState;
        case 'RECEIVE_DECK':
            newState = Object.assign({}, state, {
                singleDeck: true,
                deckSaved: false
            });

            if (!newState.decks.some((deck) => deck._id === action.response.deck._id)) {
                newState.decks.push(processDecks([action.response.deck], state));
            }

            var selected = newState.decks.find((deck) => {
                return deck._id === action.response.deck._id;
            });

            newState = selectDeck(newState, selected);

            return newState;
        case 'SELECT_DECK':
            newState = Object.assign({}, state, {
                selectedDeck: action.deck,
                deckSaved: false
            });

            if (newState.selectedDeck) {
                processDecks([newState.selectedDeck], state);
            }

            return newState;
        case 'ADD_DECK':
            var aradel = state.cards['aradel-summergaard'];
            var newDeck = {
                name: 'New Deck',
                cards: [],
                conjurations: [],
                phoenixborn: [aradel],
                dicepool: []
            };

            newState = Object.assign({}, state, {
                selectedDeck: newDeck,
                deckSaved: false
            });

            processDecks([newState.selectedDeck], state);

            return newState;
        case 'UPDATE_DECK':
            newState = Object.assign({}, state, {
                selectedDeck: action.deck,
                deckSaved: false
            });

            if (newState.selectedDeck) {
                processDecks([newState.selectedDeck], state);
            }

            return newState;
        case 'DECK_DUPLICATED':
            decks = state.decks;
            decks.unshift(action.response.deck);
            newState = Object.assign({}, state, {
                selectedDeck: action.response.deck,
                deckSaved: true,
                decks: decks
            });

            processDecks(newState.decks, state);

            return newState;
        case 'SAVE_DECK':
            newState = Object.assign({}, state, {
                deckSaved: false
            });

            return newState;
        case 'DECK_SAVED':
            newState = Object.assign({}, state, {
                deckSaved: true,
                decks: []
            });

            return newState;

        case Decks.ImportDeck:
            newState = Object.assign({}, state, {
                deckSaved: false
            });

            return newState;
        case Decks.DeckImported:
            decks = state.decks;
            decks.unshift(action.response.deck);
            newState = Object.assign({}, state, {
                deckSaved: true,
                selectedDeck: action.response.deck,
                decks: decks
            });

            processDecks(newState.decks, state);

            return newState;

        case Decks.DeckResynced:
            newState = Object.assign({}, state, {
                deckReload: !state.deckReload
            });

            return newState;

        case 'DECK_DELETED':
            newState = Object.assign({}, state, {
                deckDeleted: true
            });

            newState.decks = newState.decks.filter((deck) => {
                return deck._id !== action.response.deckId;
            });

            newState.selectedDeck = newState.decks[0];

            return newState;
        case 'CLEAR_DECK_STATUS':
            return Object.assign({}, state, {
                deckDeleted: false,
                deckSaved: false
            });
        case 'DECK_FAVED':
            newState = Object.assign({}, state, {});

            var faved = newState.decks.find((deck) => {
                return deck._id === action.response.deckId;
            });

            faved.favourite = action.response.isFave;

            return newState;

        default:
            return state;
    }
}
