import React, { useState } from 'react';

import './CardGallery.scss';
import CardImage from '../GameBoard/CardImage';
import { Modal } from 'react-bootstrap';

function CardGallery({ onAltClick, cards = [] }) {
    const cardList = cards;
    const [selectedCard, setSelectedCard] = useState(null);
    const [show, setShow] = useState(false);

    const onItemClick = (card) => {
        if (onAltClick) {
            onAltClick(card.id, card.alt);
            return;
        }

        setSelectedCard(card);
        setShow(true);
    };
    const onCloseClick = () => {
        setShow(false);
    };
    return (<>
        <div className='card-gallery'>
            {cardList.map((c) => (
                <div key={'alt' + (c.alt || c.imageStub)} onClick={() => onItemClick(c)}>
                    {/* <ZoomableCard card={c} noIndex={true} /> */}
                    <CardImage card={c} noIndex={true} />
                </div>
            ))}
        </div>
        <Modal show={show} onHide={onCloseClick} centered>
            <Modal.Body className='card-zoom-modal' onClick={onCloseClick}>
                {selectedCard && <CardImage card={selectedCard} noIndex={true} />}
            </Modal.Body>
        </Modal>
    </>
    );
}

export default CardGallery;
