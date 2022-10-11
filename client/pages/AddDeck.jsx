import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import DeckEditor from '../Components/Decks/DeckEditor';
import AlertPanel from '../Components/Site/AlertPanel';
import { Col, Row } from 'react-bootstrap';
import Panel from '../Components/Site/Panel';
// import ViewDeck from '../Components/Decks/ViewDeck.jsx';
import DeckSummary from '../Components/Decks/DeckSummary';

export class InnerAddDeck extends React.Component {
    constructor(props) {
        super();

        this.state = {
            error: ''
        };

        this.onAddDeck = this.onAddDeck.bind(this);
        props.addDeck();
    }

    componentDidUpdate() {
        if (this.props.deckSaved) {
            this.props.navigate('/decks');

            return;
        }
    }

    onAddDeck(deck) {
        this.props.saveDeck(deck);
    }

    render() {
        let content;

        if (this.props.loading) {
            content = <div>Loading decks from the server...</div>;
        } else if (this.props.apiError) {
            content = <AlertPanel type='error' message={this.props.apiError} />;
        } else {
            content = (
                <div className='full-height'>
                    <Row>
                        <Col lg={6} className='full-height'>
                            <Panel title={'Deck Editor'}>
                                <DeckEditor mode='Add' onDeckSave={this.onAddDeck} />
                            </Panel>
                        </Col>
                        <Col lg={6}>
                            <Panel title={this.props.deck?.name}>
                                <DeckSummary deck={this.props.deck} />
                            </Panel>
                        </Col>
                    </Row>
                </div>
            );
        }

        return content;
    }
}

InnerAddDeck.displayName = 'InnerAddDeck';
InnerAddDeck.propTypes = {
    addDeck: PropTypes.func,
    agendas: PropTypes.object,
    apiError: PropTypes.string,
    cards: PropTypes.object,
    deck: PropTypes.object,
    deckSaved: PropTypes.bool,
    factions: PropTypes.object,
    formats: PropTypes.object,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    saveDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        agendas: state.cards.factions,
        apiError: state.api.message,
        cards: state.cards.cards,
        deck: state.cards.selectedDeck,
        deckSaved: state.cards.deckSaved,
        factions: state.cards.factions,
        formats: state.cards.formats,
        loading: state.api.loading
    };
}

const AddDeck = connect(mapStateToProps, actions)(InnerAddDeck);

export default AddDeck;
