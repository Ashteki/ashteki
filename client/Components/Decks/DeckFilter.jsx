import { faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Link from '../Navigation/Link';
import { Col, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const DeckFilter = ({ onNameChange, onPbChange, handleFaveChange, showButtons }) => {
    const allCards = useSelector((state) => state.cards.cards);
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
                <Form.Row>
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
                        <FontAwesomeIcon icon={faHeart} title='Remove from favourites' />
                        <Form.Check // prettier-ignore
                            type='switch'
                            id='custom-switch'
                            onChange={handleFaveChange}
                        />
                    </Form.Group>
                    {showButtons && (
                        <Form.Group as={Col} xs='3'>
                            <Link className='btn btn-primary def' href='/decks/import'>
                                <span className='phg-basic-magic'></span> Import
                            </Link>
                            <Link className='btn btn-secondary def' href='/decks/add'>
                                <FontAwesomeIcon icon={faPlus} /> New
                            </Link>
                        </Form.Group>
                    )}
                </Form.Row>
            </Form>
        </div>
    );
};

DeckFilter.displayName = 'DeckFilter';
export default DeckFilter;
