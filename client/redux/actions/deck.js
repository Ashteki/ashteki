import { Decks } from '../types';

/**
 * @typedef DeckFilter
 * @property {string} name
 * @property {string} value
 */

/**
 * @typedef PagingOptions
 * @property {number} [pageSize] The number of elements in each page
 * @property {number} [page] The page index
 * @property {string} [sort] The sort column
 * @property {string} [sortDir] The sort direction
 * @property {DeckFilter[]} [filter] The filters
 */

/**
 * @param {PagingOptions} options
 */
export function loadDecks(options = {}) {
    return {
        types: [Decks.RequestDecks, Decks.DecksReceived],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/decks', cache: false, data: options }
    };
}

export function loadDeck(deckId) {
    return {
        types: ['REQUEST_DECK', 'RECEIVE_DECK'],
        shouldCallAPI: (state) => {
            let ret =
                state.cards.decks.length === 0 ||
                !state.cards.decks.some((deck) => {
                    return deck._id === deckId;
                });

            return ret;
        },
        APIParams: { url: `/api/decks/${deckId}`, cache: false }
    };
}

export function selectDeck(deck) {
    return {
        type: 'SELECT_DECK',
        deck: deck
    };
}

export function addDeck() {
    return {
        type: 'ADD_DECK'
    };
}

export function updateDeck(deck) {
    return {
        type: 'UPDATE_DECK',
        deck: deck
    };
}

export function duplicateDeck(deck) {
    const newDeck = Object.assign({}, deck);
    newDeck._id = null;
    newDeck.name = deck.name + ' (Copy)';
    var str = getDeckJson(newDeck);

    return {
        types: ['DUPLICATE_DECK', 'DECK_DUPLICATED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/decks/',
            type: 'POST',
            data: str
        }
    };
}

export function deleteDeck(deck) {
    return {
        types: [Decks.DeleteDeck, Decks.DeckDeleted],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/decks/${deck._id}`,
            type: 'DELETE'
        }
    };
}

export function setFavourite(deck, value) {
    let data = JSON.stringify({
        favourite: value
    });

    return {
        types: [Decks.FaveDeck, Decks.DeckFaved],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/decks/${deck._id}`,
            type: 'PATCH',
            data: data
        }
    };
}

function getDeckJson(deck) {
    return JSON.stringify({
        deckName: deck.name,
        phoenixborn: formatCards(deck.phoenixborn),
        cards: formatCards(deck.cards),
        conjurations: formatCards(deck.conjurations),
        dicepool: deck.dicepool,
        notes: deck.notes
    });
}

export function saveDeck(deck) {
    var str = getDeckJson(deck);

    return {
        types: [Decks.SaveDeck, Decks.DeckSaved],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/decks/' + (deck._id || ''),
            type: deck._id ? 'PUT' : 'POST',
            data: str
        }
    };
}

export function importDeck(deck) {
    let str = JSON.stringify({
        uuid: deck.uuid
    });

    return {
        types: [Decks.ImportDeck, Decks.DeckImported],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/decks/',
            type: 'POST',
            data: str
        }
    };
}

export function resyncDeck(deck) {
    let str = JSON.stringify({
        deckId: deck._id,
        uuid: deck.ashesLiveUuid,
        resync: true
    });

    return {
        types: [Decks.ResyncDeck, Decks.DeckResynced],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/decks/',
            type: 'POST',
            data: str
        }
    };
}

function formatCards(cards) {
    return cards.map((card) => {
        return { id: card.id, count: card.count || 1, ff: card.ff };
    });
}

export function clearDeckStatus() {
    return {
        type: 'CLEAR_DECK_STATUS'
    };
}

export function loadStandaloneDecks() {
    return {
        types: ['LOAD_STANDALONE_DECKS', 'STANDALONE_DECKS_LOADED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/standalone-decks',
            type: 'GET'
        }
    };
}

export function loadAdventuringPartyDecks() {
    return {
        types: ['LOAD_ADVENTURINGPARTY_DECKS', 'ADVENTURINGPARTY_DECKS_LOADED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/adventuringparty-decks',
            type: 'GET'
        }
    };
}

export function loadBuildingBasicsDecks() {
    return {
        types: ['LOAD_BUILDINGBASICS_DECKS', 'BUILDINGBASICS_DECKS_LOADED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/buildingbasics-decks',
            type: 'GET'
        }
    };
}

export function loadFirstAdventureDecks() {
    return {
        types: ['LOAD_FIRSTADVENTURE_DECKS', 'FIRSTADVENTURE_DECKS_LOADED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/firstadventure-decks',
            type: 'GET'
        }
    };
}

export function loadPveDecks() {
    return {
        types: ['LOAD_PVE_DECKS', 'PVE_DECKS_LOADED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/pve-decks',
            type: 'GET'
        }
    };
}

export function loadChimeraDecks() {
    return {
        types: ['LOAD_CHIMERA_DECKS', 'CHIMERA_DECKS_LOADED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/chimera-decks',
            type: 'GET'
        }
    };
}
