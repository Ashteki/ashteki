const _ = require('underscore');
const { CardType } = require('../constants');
const CardStateWriter = require('./CardStateWriter');
const DieStateWriter = require('./DieStateWriter');

class PlayerStateWriter {
    constructor(player, cardVisibility, isSolo, isReplay) {
        this.player = player;
        this.cardVisibility = cardVisibility;
        this.isSolo = isSolo;
        this.isReplay = isReplay;
    }

    getState(forPlayer, activePlayer, options = {}) {
        const isForMe = forPlayer === this.player;
        const showPrivateInfo = isForMe || this.isSolo || this.isReplay;
        const promptState =
            isForMe || (this.isSolo && this.player.isDummy)
                ? this.player.promptState.getState()
                : {};

        const playerState = {
            cardPiles: {
                archives: this.getSummaryForCardList(
                    this.player.archives,
                    forPlayer,
                    isForMe,
                    true
                ),
                cardsInPlay: this.getSummaryForCardList(
                    this.player.battlefield,
                    forPlayer,
                    isForMe
                ),
                discard: this.getSummaryForCardList(this.player.discard, forPlayer, isForMe),
                hand: this.getSummaryForCardList(this.player.hand, forPlayer, isForMe),
                purged: this.getSummaryForCardList(this.player.purged, forPlayer, isForMe),
                spells: this.getSummaryForCardList(this.player.spellboard, forPlayer, isForMe)
            },
            deckNotes: options.deckNotes ? this.player.deckNotes : '',
            disconnected: !!this.player.disconnectedAt,
            awol: !!this.player.isAwol,
            activePlayer: activePlayer === this.player,
            gamesPlayed: this.player.user.gamesPlayed ? this.player.user.gamesPlayed : 0,
            avatar: this.player.user.avatar,
            id: this.player.id,
            left: this.player.left,
            name: this.player.name,
            numDeckCards: this.player.deck.length, // used for opponent display when deck not sent
            optionSettings: this.player.optionSettings,
            stats: this.player.getStats(),
            timerSettings: {},
            user: {
                id: this.player.user.id,
                username: this.player.user.username,
                settings: this.player.user.settings,
                role: this.player.user.role,
                avatar: this.player.user.avatar,
                faveColor: this.player.user.faveColor,
                eloRating: this.player.user.eloRating
            },
            deckData: isForMe ? this.player.deckData : null,
            wins: this.player.wins,
            dice: this.getSummaryForDiceList(this.player.dice, forPlayer, isForMe),
            diceCounts: this.player.diceCounts,
            actions: this.player.actions,
            limitedPlayed: this.player.limitedPlayed,
            phoenixborn: this.getCardSummary(this.player.phoenixborn, forPlayer, isForMe),
            medCount: this.player.medCount,
            totalDiceSpend: this.player.totalDiceSpend,
            totalCardsPlayed: this.player.totalCardsPlayed,
            firstPlayer: this.player.firstPlayer
        };

        if (this.player.isDummy) {
            playerState.ultimate = this.getCardSummary(this.player.ultimate, forPlayer);
            playerState.behaviour = this.getCardSummary(this.player.behaviour, forPlayer);
        }

        if (showPrivateInfo) {
            let sortedDeck = this.player.deck.slice();
            sortedDeck.sort((a, b) => {
                const typeValueA = this.getTypeValue(a.type);
                const typeValueB = this.getTypeValue(b.type);
                if (typeValueA + a.id < typeValueB + b.id) {
                    return -1;
                } else if (typeValueA + a.id > typeValueB + b.id) {
                    return 1;
                }

                return 0;
            });
            playerState.cardPiles.deck = this.getSummaryForCardList(sortedDeck, forPlayer, isForMe);
            playerState.firstFive = this.player.firstFive;
            playerState.diceHistory = this.player.diceHistory;
            if (this.player.inspectionCard) {
                playerState.inspectionCard = this.getCardSummary(
                    this.player.inspectionCard,
                    forPlayer,
                    isForMe
                );
            }
        }

        if (this.player.isDummy) {
            playerState.fatigued = this.player.fatigued;
            playerState.chimeraPhase = this.player.chimeraPhase;
        }

        if (this.player.clock) {
            playerState.clock = this.player.clock.getState();
        }

        playerState.promptState = promptState;

        return _.extend(playerState, promptState);
    }

    getTypeValue(cardType) {
        switch (cardType) {
            case CardType.ReadySpell:
                return '100';
            case CardType.Ally:
                return '200';
            case CardType.Upgrade:
            case CardType.ConjuredAlteration:
                return '300';
            case CardType.ActionSpell:
                return '400';
            case CardType.ReactionSpell:
                return '500';
            default:
                return 600;
        }
        // Ready => Ally => Alteration => Action => Reaction
    }

    getSummaryForCardList(list, activePlayer, isForMe, sort = false) {
        let returnList = list;
        if (sort) {
            returnList = list.sort((a, b) => {
                if (a.id < b.id) {
                    return -1;
                } else if (a.id > b.id) {
                    return 1;
                }
                return 0;
            });
        }
        return returnList.map((card) => {
            return this.getCardSummary(card, activePlayer, isForMe);
        });
    }

    getCardSummary(card, activePlayer, isForMe) {
        const writer = new CardStateWriter(card);
        if (
            !this.cardVisibility.isVisible(card, activePlayer) &&
            !this.cardVisibility.isOpenInformation(card) &&
            !this.isReplay
        ) {
            return writer.getRestrictedSummary();
        }

        // else full summary
        const cardState = writer.getFullSummary();

        if (
            isForMe &&
            activePlayer.isCardInPlayableLocation(card) &&
            activePlayer.promptState && // defensive for next line errors
            activePlayer.promptState.promptTitle === 'Play phase'
        ) {
            cardState.canPlay = activePlayer.canPlayCard(card);
        }

        // upgrades and child cards
        cardState.upgrades = card.upgrades.map((upgrade) =>
            this.getCardSummary(upgrade, activePlayer, isForMe)
        );
        cardState.childCards = card.childCards.map((card) =>
            this.getCardSummary(card, activePlayer, isForMe)
        );
        cardState.dieUpgrades = card.dieUpgrades.map((die) => {
            const dieState = die.getShortSummary();
            let selectionState = activePlayer.getDieSelectionState(die);
            return Object.assign(dieState, selectionState);
        });

        let selectionState = activePlayer.getCardSelectionState(card);
        return Object.assign(cardState, selectionState);
    }

    getSummaryForDiceList(list, activePlayer, isForMe) {
        return list.map((die) => {
            const dieState = new DieStateWriter(die).getSummary();
            if (isForMe) {
                dieState.canPlay = activePlayer.canPlayDie(die);
            }

            let selectionState = activePlayer.getDieSelectionState(die);
            return Object.assign(dieState, selectionState);
        });
    }
}

module.exports = PlayerStateWriter;
