import { Decks } from '../types';

function selectDeck(state, deck) {
    // if (state.decks && state.decks.length !== 0) {
    state.selectedDeck = deck;
    // } else {
    //     delete state.selectedDeck;
    // }

    return state;
}

function processDecks(decks, state) {
    for (let deck of decks) {
        if (!state.cards || Object.values(state.cards).length === 0) {
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

        deck.behaviour = deck.behaviour?.map((card) => ({
            count: card.count,
            card: Object.assign({}, state.cards[card.id]),
            id: card.id,
            conjurations: card.conjurations
        }));

        deck.ultimate = deck.ultimate?.map((card) => ({
            count: card.count,
            card: Object.assign({}, state.cards[card.id]),
            id: card.id,
            conjurations: card.conjurations
        }));

        deck.cards = deck.cards.map((card) => {
            const c = Object.assign({}, state.cards[card.id]);
            return {
                count: card.count,
                card: c,
                id: card.id,
                conjurations: c.conjurations,
                phoenixborn: c.phoenixborn,
                ff: card.ff,
                imageStub: card.imageStub
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
            // max 3 uniques unless in onecollection format when all are allowed
            (countUniques <= 3 || deck.format === 'onecollection');
        let uniques = !hasPhoenixborn || validUniques;

        let cardCount = deck.cards.reduce((acc, card) => acc + card.count, 0);
        const legalToPlay =
            hasPhoenixborn && cardCount === 30 && hasConjurations && tenDice && uniques;
        const maxThree = !deck.cards.some((c) => c.count > 3);

        deck.status = {
            basicRules: hasPhoenixborn && cardCount === 30,
            maxThree: maxThree,
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

export default function (state = { decks: [], myChimeraDecks: [], cards: {} }, action) {
    let newState;
    switch (action.type) {
        case 'RECEIVE_CARDS':
            newState = Object.assign({}, state, {
                cards: action.response.cards
            });

            var decks = state.decks;
            if (decks.length > 0) {
                processDecks(decks, newState);
                newState.decks = decks;
            }

            var myChimeraDecks = state.myChimeraDecks;
            if (myChimeraDecks.length > 0) {
                processDecks(myChimeraDecks, newState);
                newState.myChimeraDecks = myChimeraDecks;
            }

            var precons = state.standaloneDecks;
            if (precons?.length > 0) {
                processDecks(precons, newState);
                newState.standaloneDecks = precons;
            }

            var adventuringPartyDecks = state.adventuringPartyDecks;
            if (adventuringPartyDecks?.length > 0) {
                processDecks(adventuringPartyDecks, newState);
                newState.adventuringPartyDecks = adventuringPartyDecks;
            }

            var firstAdventureDecks = state.firstAdventureDecks;
            if (firstAdventureDecks?.length > 0) {
                processDecks(firstAdventureDecks, newState);
                newState.firstAdventureDecks = firstAdventureDecks;
            }
            var pveDecks = state.pveDecks;
            if (pveDecks?.length > 0) {
                processDecks(pveDecks, newState);
                newState.pveDecks = pveDecks;
            }
            var chimeraDecks = state.chimeraDecks;
            if (chimeraDecks?.length > 0) {
                processDecks(chimeraDecks, newState);
                newState.chimeraDecks = chimeraDecks;
            }
            var dualDuelDecks = state.dualDuelDecks;
            if (dualDuelDecks?.length > 0) {
                processDecks(dualDuelDecks, newState);
                newState.dualDuelDecks = dualDuelDecks;
            }
            var oneCollectionDecks = state.oneCollectionDecks;
            if (oneCollectionDecks?.length > 0) {
                processDecks(oneCollectionDecks, newState);
                newState.oneCollectionDecks = oneCollectionDecks;
            }
            var ascendancyDecks = state.ascendancyDecks;
            if (ascendancyDecks?.length > 0) {
                processDecks(ascendancyDecks, newState);
                newState.ascendancyDecks = ascendancyDecks;
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
            console.log('decks received');
            processDecks(action.response.decks, state);
            console.log('decks processed');

            newState = Object.assign({}, state, {
                singleDeck: false,
                numDecks: action.response.numDecks,
                decks: action.response.decks
            });

            newState = selectDeck(newState, newState.decks[0]);

            return newState;

        case 'CHIMERA_DECKS_RECEIVED':
            processDecks(action.response.decks, state);
            newState = Object.assign({}, state, {
                singleDeck: false,
                numDecks: action.response.numDecks,
                myChimeraDecks: action.response.decks
            });

            newState = selectDeck(newState, newState.myChimeraDecks[0]);

            return newState;
        case 'STANDALONE_DECKS_LOADED':
            if (action.response.decks) {
                console.log('standalone decks received');

                processDecks(action.response.decks, state);
                console.log('standalone decks processed');

            }

            newState = Object.assign({}, state, {
                standaloneDecks: action.response.decks
            });

            return newState;
        case 'PRECON_DECKS_LOADED':
            if (action.response.decks) {
                console.log('precon decks received');

                processDecks(action.response.decks, state);
                console.log('precon decks processed');
            }
            var groupedDecks = action.response.decks.groupBy(d => d.groupName);

            newState = Object.assign({}, state, {
                standaloneDecks: groupedDecks.reborn || [],
                adventuringPartyDecks: groupedDecks.aparty || [],
                firstAdventureDecks: groupedDecks.firstadventure || [],
                pveDecks: groupedDecks.pve || [],
                chimeraDecks: groupedDecks.chimera || [],
                dualDuelDecks: groupedDecks.dualduel || [],
                oneCollectionDecks: groupedDecks.onecollection || [],
                ascendancyDecks: groupedDecks.ascendancy || []
            });

            return newState;
        case 'ADVENTURINGPARTY_DECKS_LOADED':
            if (action.response.decks) {
                console.log('aparty decks received');

                processDecks(action.response.decks, state);
                console.log('aparty decks processed');
            }

            newState = Object.assign({}, state, {
                adventuringPartyDecks: action.response.decks
            });

            return newState;
        case 'FIRSTADVENTURE_DECKS_LOADED':
            if (action.response.decks) {
                console.log('firstadventure decks received');

                processDecks(action.response.decks, state);
                console.log('firstadventure decks processed');

            }

            newState = Object.assign({}, state, {
                firstAdventureDecks: action.response.decks
            });

            return newState;
        case 'PVE_DECKS_LOADED':
            if (action.response.decks) {
                console.log('pve decks received');

                processDecks(action.response.decks, state);
                console.log('pve decks processed');

            }

            newState = Object.assign({}, state, {
                pveDecks: action.response.decks
            });

            return newState;
        case 'CHIMERA_DECKS_LOADED':
            if (action.response.decks) {
                console.log('chimera decks received');

                processDecks(action.response.decks, state);
                console.log('chimera decks processed');

            }

            newState = Object.assign({}, state, {
                chimeraDecks: action.response.decks
            });

            return newState;
        case 'DUALDUEL_DECKS_LOADED':
            if (action.response.decks) {
                console.log('dualduel decks received');

                processDecks(action.response.decks, state);
                console.log('dualduel decks processed');

            }

            newState = Object.assign({}, state, {
                dualDuelDecks: action.response.decks
            });

            return newState;
        case 'ONECOLLECTION_DECKS_LOADED':
            if (action.response.decks) {
                console.log('OCB decks received');

                processDecks(action.response.decks, state);
                console.log('OCB decks processed');

            }

            newState = Object.assign({}, state, {
                oneCollectionDecks: action.response.decks
            });

            return newState;
        case 'ASCENDANCY_DECKS_LOADED':
            if (action.response.decks) {
                processDecks(action.response.decks, state);
            }

            newState = Object.assign({}, state, {
                ascendancyDecks: action.response.decks
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
        case 'REQUEST_CHIMERA_DECKS':
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
        case 'ADD_CHIMERA_DECK':
            var corpse = state.cards['corpse-of-viros'];
            var newChimeraDeck = {
                name: 'New Deck',
                cards: [],
                conjurations: [],
                phoenixborn: [corpse],
                dicepool: [{ magic: 'rage', count: 5 }],
                mode: 'chimera'
            };

            newState = Object.assign({}, state, {
                selectedDeck: newChimeraDeck,
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
        case 'SET_CARD_FIRST_FIVE':
            newState = Object.assign({}, state, {
                selectedDeck: action.deck,
                deckSaved: false
            });

            var card = newState.selectedDeck.cards.find(c => c.id === action.card.id);
            card.ff = !card.ff;

            if (newState.selectedDeck) {
                processDecks([newState.selectedDeck], state);
            }

            return newState;
        case 'DECK_DUPLICATED':
            var isChimera = action.response.deck.mode === 'chimera';
            if (isChimera) {
                var myChimeraDecks = state.myChimeraDecks;
                myChimeraDecks.unshift(action.response.deck);
                newState = Object.assign({}, state, {
                    selectedDeck: action.response.deck,
                    deckSaved: true,
                    myChimeraDecks: myChimeraDecks
                });
                processDecks(newState.myChimeraDecks, state);
            } else {
                var myDecks = [action.response.deck, ...state.decks];
                newState = Object.assign({}, state, {
                    selectedDeck: action.response.deck,
                    deckSaved: true,
                    decks: myDecks
                });
                processDecks(newState.decks, state);
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
                decks: [],
                myChimeraDecks: []
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

            var chimeraDeleted = !!state.myChimeraDecks.find(d => d._id === action.response.deckId);
            newState.decks = newState.decks.filter((deck) => {
                return deck._id !== action.response.deckId;
            });
            newState.myChimeraDecks = newState.myChimeraDecks.filter((deck) => {
                return deck._id !== action.response.deckId;
            });

            if (chimeraDeleted) {
                newState.selectedDeck = newState.myChimeraDecks[0];
            } else {
                newState.selectedDeck = newState.decks[0];
            }

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
