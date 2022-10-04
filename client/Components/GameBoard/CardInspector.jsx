import React from 'react';
import { useDispatch } from 'react-redux';
import { sendGameMessage } from '../../redux/actions';
import CardImage from './CardImage';
import './CardInspector.scss';
import Minus from '../../assets/img/Minus.png';
import Plus from '../../assets/img/Plus.png';
import Counter from './Counter';

const CardInspector = ({ card }) => {
    const dispatch = useDispatch();
    if (!card || !card.id) {
        return null;
    }
    const diceFont = `phg-main-action`;

    return (
        <div className='card-inspector'>
            <div className='simple-card vertical mb-2'>
                <CardImage card={card} />
            </div>
            <div className='inspector-control'>

                <a
                    href='#'
                    className='btn-stat'
                    onClick={() =>
                        dispatch(sendGameMessage('modifyCardToken', card.uuid, 'damage', -1))
                    }
                >
                    <img src={Minus} title='- side' alt='-' />
                </a>

                <span key={`inspector-damage`}> {card.damage} </span>
                <Counter name='damage' showValue={true} value={card.tokens.damage || '0'} />
                <a
                    href='#'
                    className='btn-stat'
                    onClick={() =>
                        dispatch(sendGameMessage('modifyCardToken', card.uuid, 'damage', 1))
                    }
                >
                    <img src={Plus} title='+ side' alt='+' />
                </a>
            </div>

            <button
                className='btn btn-primary'
                onClick={() => dispatch(sendGameMessage('closeInspector'))}
            >
                Close
            </button>
        </div>
    );
};

CardInspector.displayName = 'CardInspector';

export default CardInspector;
