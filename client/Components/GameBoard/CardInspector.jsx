import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clearInspector } from '../../redux/actions';
import CardImage from './CardImage';
import './CardInspector.scss';
import Minus from '../../assets/img/Minus.png';
import Plus from '../../assets/img/Plus.png';
import Counter from './Counter';

const CardInspector = () => {
    const dispatch = useDispatch();
    const card = useSelector((state) => state.ingame.inspectionCard);
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
                // onClick={this.sendUpdate.bind(this, 'side', 'down')}
                >
                    <img src={Minus} title='- side' alt='-' />
                </a>

                <span key={`inspector-damage`} >
                    {card.damage}
                </span>
                <Counter name='damage' showValue={true} value={card.tokens.damage || '0'} />
                <a
                    href='#'
                    className='btn-stat'
                // onClick={this.sendUpdate.bind(this, 'side', 'up')}
                >
                    <img src={Plus} title='+ side' alt='+' />
                </a>
            </div>


            <button className='btn btn-primary' onClick={() => dispatch(clearInspector())}>
                Close
            </button>
        </div>
    );
};

CardInspector.displayName = 'CardInspector';

export default CardInspector;
