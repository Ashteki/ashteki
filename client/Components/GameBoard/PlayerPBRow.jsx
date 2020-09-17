import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import IdentityCard from './IdentityCard';
import Droppable from './Droppable';
import { buildArchon, buildDeckList } from '../../archonMaker';
import * as actions from '../../redux/actions';
import IdentityDefault from '../../assets/img/idbacks/identity.jpg';

import './PlayerRow.scss';

class PlayerRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { deckListUrl: IdentityDefault };
    }

    componentDidMount() {
        buildArchon(this.props.deckData).then((cardBackUrl) => {
            if (this.props.player === 1) {
                this.props.setPlayer1CardBack(cardBackUrl);
            } else {
                this.props.setPlayer2CardBack(cardBackUrl);
            }
        });
        if (!this.props.hideDecklist) {
            buildDeckList(
                { ...this.props.deckData, cards: this.props.deckCards },
                this.props.language,
                this.props.t,
                this.props.cards
            )
                .then((deckListUrl) => {
                    this.setState({ deckListUrl });
                })
                .catch(() => {
                    this.setState({ deckListUrl: IdentityDefault });
                });
        } else {
            this.setState({ deckListUrl: IdentityDefault });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.language) {
            if (
                this.props.language !== prevProps.language ||
                this.props.deckData.identity !== prevProps.deckData.identity ||
                this.props.hideDecklist !== prevProps.hideDecklist
            ) {
                buildArchon(this.props.deckData).then((cardBackUrl) => {
                    if (this.props.player === 1) {
                        this.props.setPlayer1CardBack(cardBackUrl);
                    } else {
                        this.props.setPlayer2CardBack(cardBackUrl);
                    }
                });
                if (!this.props.hideDecklist) {
                    buildDeckList(
                        { ...this.props.deckData, cards: this.props.deckCards },
                        this.props.language,
                        this.props.t,
                        this.props.cards
                    )
                        .then((deckListUrl) => {
                            this.setState({ deckListUrl });
                        })
                        .catch(() => {
                            this.setState({ deckListUrl: IdentityDefault });
                        });
                } else {
                    this.setState({ deckListUrl: IdentityDefault });
                }
            }
        }
    }

    renderDroppablePile(source, child) {
        return this.props.isMe ? (
            <Droppable
                onDragDrop={this.props.onDragDrop}
                source={source}
                manualMode={this.props.manualMode}
            >
                {child}
            </Droppable>
        ) : (
            child
        );
    }

    render() {
        let t = this.props.t;

        let cardPileProps = {
            manualMode: this.props.manualMode,
            onCardClick: this.props.onCardClick,
            onDragDrop: this.props.onDragDrop,
            onMouseOut: this.props.onMouseOut,
            onMouseOver: this.props.onMouseOver,
            popupLocation: this.props.side,
            size: this.props.cardSize
        };

        let hand = (
            <SquishableCardPanel
                cards={this.props.spells}
                className='panel hand'
                groupVisibleCards
                cardBackUrl={this.props.cardBackUrl}
                username={this.props.username}
                manualMode={this.props.manualMode}
                maxCards={6}
                onCardClick={this.props.onCardClick}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                source='play area'
                title={t('Spellboard')}
                cardSize={this.props.cardSize}
            />
        );

        let drawDeck = (
            <DrawDeck
                cardCount={this.props.numDeckCards}
                cards={this.props.drawDeck}
                isMe={this.props.isMe}
                manualMode={this.props.manualMode}
                numDeckCards={this.props.numDeckCards}
                onPopupChange={this.props.onDrawPopupChange}
                onShuffleClick={this.props.onShuffleClick}
                showDeck={this.props.showDeck}
                spectating={this.props.spectating}
                cardBackUrl={this.props.cardBackUrl}
                {...cardPileProps}
            />
        );

        let discard = (
            <CardPile
                className='discard'
                title={t('Discard')}
                source='discard'
                cards={this.props.discard}
                {...cardPileProps}
            />
        );

        let identity = (
            <IdentityCard
                className='identity'
                deckListUrl={this.state.deckListUrl}
                size={this.props.cardSize}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
            />
        );

        return (
            <div className='player-home-row-container pt-1'>
                {this.renderDroppablePile('discard', discard)}
                {this.renderDroppablePile('deck', drawDeck)}
                {identity}
                {this.renderDroppablePile('hand', hand)}
                {/* // change to spells */}
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    cardBackUrl: PropTypes.string,
    cardSize: PropTypes.string,
    cards: PropTypes.object,
    conclavePile: PropTypes.array,
    deckCards: PropTypes.array,
    deckData: PropTypes.object,
    discard: PropTypes.array,
    drawDeck: PropTypes.array,
    faction: PropTypes.object,
    hideDecklist: PropTypes.bool,
    i18n: PropTypes.object,
    isMe: PropTypes.bool,
    language: PropTypes.string,
    manualMode: PropTypes.bool,
    numDeckCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onDrawPopupChange: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onShuffleClick: PropTypes.func,
    player: PropTypes.number,
    power: PropTypes.number,
    sendGameMessage: PropTypes.func,
    setPlayer1CardBack: PropTypes.func,
    setPlayer2CardBack: PropTypes.func,
    showDeck: PropTypes.bool,
    side: PropTypes.oneOf(['top', 'bottom']),
    spectating: PropTypes.bool,
    t: PropTypes.func,
    title: PropTypes.object,
    username: PropTypes.string,
    spells: PropTypes.array
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;
    return boundActions;
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps, null)(PlayerRow));
