import React from 'react';
import { useDispatch } from 'react-redux';
import { sendGameMessage } from '../../redux/actions';
import CardImage from './CardImage';
import './CardInspector.scss';
import Minus from '../../assets/img/Minus.png';
import Plus from '../../assets/img/Plus.png';
import Counter from './Counter';
import Panel from '../Site/Panel';

const CardInspector = ({ card }) => {
    const dispatch = useDispatch();

    if (!card || !card.id) {
        return null;
    }
    const diceFont = `phg-main-action`;

    const getInspectorControl = (tokenType) => {
        return (
            <div className='inspector-control'>
                <a
                    href='#'
                    className='btn-stat'
                    onClick={() =>
                        dispatch(sendGameMessage('modifyCardToken', card.uuid, tokenType, -1))
                    }
                >
                    <img src={Minus} title='- side' alt='-' />
                </a>

                <Counter name={tokenType} showValue={true} value={card.tokens[tokenType] || '0'} />
                <a
                    href='#'
                    className='btn-stat'
                    onClick={() =>
                        dispatch(sendGameMessage('modifyCardToken', card.uuid, tokenType, 1))
                    }
                >
                    <img src={Plus} title='+ side' alt='+' />
                </a>
            </div>
        );
    };

    return (
        <Panel title='Card Inspector' cardClass='card-inspector'>

            {/* <div > */}
            <div className='simple-card vertical mb-2'>
                <CardImage card={card} />
            </div>
            {getInspectorControl('damage')}
            {getInspectorControl('exhaustion')}
            {getInspectorControl('status')}

            <div className='center-content'>
                <button
                    className='btn btn-primary'
                    onClick={() => dispatch(sendGameMessage('closeInspector'))}
                >
                    Close
                </button>
            </div>
            {/* </div> */}
        </Panel>
    );
};

CardInspector.displayName = 'CardInspector';

export default CardInspector;
