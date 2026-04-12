import { faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addDeck } from '../../redux/actions';

const DeckFilter = ({ onNameChange, onPbChange, handleFaveChange, showButtons }) => {
    const allCards = useSelector((state) => state.cards.cards);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let phoenixbornCards = [];
    for (let c in allCards) {
        if (allCards[c].type == 'Phoenixborn') {
            phoenixbornCards.push(allCards[c]);
        }
    }
    phoenixbornCards.sort((a, b) => (a.name < b.name ? -1 : 1));

    return (
        <div>
            <Form onSubmit={(event) => event.preventDefault()}>
                <Row className='form-row'>
                    <Form.Group as={Col} controlId='formGridName'>
                        <Form.Control
                            name='name'
                            type='text'
                            onChange={(event) => {
                                event.persist();
                                onNameChange(event);
                            }}
                            placeholder='Filter by name'
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId='phoenixborn'>
                        <Form.Control
                            as='select'
                            onChange={(event) => {
                                event.persist();
                                onPbChange(event);
                            }}
                            // value={this.pbid}
                            placeholder={'Filter by PB'}
                        >
                            <option key='-1' value=''>
                                All Phoenixborn
                            </option>
                            {phoenixbornCards.map((c, index) => {
                                return (
                                    <option key={index} value={c.stub}>
                                        {c.name}
                                    </option>
                                );
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId='favourite' xs='1' className='fave-hdr'>
                        <FontAwesomeIcon icon={faHeart} title='Favourites' />
                        <Form.Check // prettier-ignore
                            type='switch'
                            id='custom-switch'
                            onChange={handleFaveChange}
                        />
                    </Form.Group>
                    {showButtons && (
                        <Form.Group as={Col} xs='3'>
                            <Link className='btn btn-primary def' to='/decks/import'>
                                <span className='phg-basic-magic'></span> Import
                            </Link>
                            <Button
                                className='btn btn-secondary def'
                                onClick={() => {
                                    dispatch(addDeck());
                                    navigate('/decks/add');
                                }}
                            >

                                <FontAwesomeIcon icon={faPlus} /> New
                            </Button>
                        </Form.Group>
                    )}
                </Row>
            </Form>
        </div>
    );
};

DeckFilter.displayName = 'DeckFilter';
export default DeckFilter;
