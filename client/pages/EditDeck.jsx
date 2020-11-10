import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import Panel from '../Components/Site/Panel';

import ViewDeck from '../Components/Decks/ViewDeck.jsx';
import DeckEditor from '../Components/Decks/DeckEditor.jsx';
import AlertPanel from '../Components/Site/AlertPanel.jsx';

import * as actions from '../redux/actions';

class InnerEditDeck extends React.Component {
    constructor() {
        super();

        this.onEditDeck = this.onEditDeck.bind(this);
    }

    componentDidMount() {
        if (this.props.deckId) {
            return this.props.loadDeck(this.props.deckId);
        } else if (this.props.deck) {
            this.props.setUrl('/decks/edit/' + this.props.deck._id);

            return this.props.loadDeck(this.props.deck._id);
        }
    }

    componentDidUpdate() {
        if (this.props.deckSaved) {
            this.props.navigate('/decks');

            return;
        }
    }

    onEditDeck(deck) {
        this.props.saveDeck(deck);
    }

    render() {
        let content;

        if (this.props.loading) {
            content = <div>Loading decks from the server...</div>;
        } else if (this.props.apiError) {
            content = <AlertPanel type='error' message={this.props.apiError} />;
        } else if (!this.props.deck) {
            content = <AlertPanel message='The specified deck was not found' type='error' />;
        } else {
            content = (
                <div className='full-height'>
                    <Row>
                        <Col lg={6} className='full-height'>
                            <Panel title={'Deck Editor'}>
                                <DeckEditor mode='Save' onDeckSave={this.onEditDeck} />
                            </Panel>
                        </Col>
                        <Col lg={6}>{<ViewDeck deck={this.props.deck} />}</Col>
                    </Row>
                </div>
            );
        }

        return content;
    }
}

InnerEditDeck.displayName = 'InnerEditDeck';
InnerEditDeck.propTypes = {
    agendas: PropTypes.object,
    apiError: PropTypes.string,
    banners: PropTypes.array,
    cards: PropTypes.object,
    deck: PropTypes.object,
    deckId: PropTypes.string,
    deckSaved: PropTypes.bool,
    loadDeck: PropTypes.func,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    saveDeck: PropTypes.func,
    setUrl: PropTypes.func
};

function mapStateToProps(state) {
    return {
        agendas: state.cards.agendas,
        apiError: state.api.message,
        banners: state.cards.banners,
        cards: state.cards.cards,
        deck: state.cards.selectedDeck,
        deckSaved: state.cards.deckSaved,
        loading: state.api.loading
    };
}

const EditDeck = connect(mapStateToProps, actions)(InnerEditDeck);

export default EditDeck;
