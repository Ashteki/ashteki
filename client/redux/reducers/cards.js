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

        let uniques =
            !hasPhoenixborn ||
            deck.cards.filter(
                (c) => c.card.phoenixborn && c.card.phoenixborn !== deck.phoenixborn[0].card.name
            ).length === 0;

        let cardCount = deck.cards.reduce((acc, card) => acc + card.count, 0);
        deck.status = {
            basicRules: hasPhoenixborn && cardCount === 30,
            hasConjurations: hasConjurations,
            uniques: uniques,
            tenDice: tenDice,
            flagged: !!deck.flagged,
            verified: !!deck.verified,
            usageLevel: deck.usageLevel,
            noUnreleasedCards: true,
            officialRole: true,
            extendedStatus: []
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
        case 'ZOOM_CARD':
            return Object.assign({}, state, {
                zoomCard: action.card
            });
        case 'CLEAR_ZOOM':
            return Object.assign({}, state, {
                zoomCard: undefined
            });
        case 'PLAYER_CARDBACK':
            if (action.player === 1) {
                return Object.assign({}, state, {
                    player1CardBack: action.url
                });
            }

            return Object.assign({}, state, {
                player2CardBack: action.url
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
        default:
            return state;
    }
}
