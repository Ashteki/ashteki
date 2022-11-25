import React from 'react';
import { useDispatch } from 'react-redux';
import { closeGameSocket, sendGameMessage } from '../../redux/actions';
import Panel from '../Site/Panel';
import CardImage from './CardImage';

import './AlertSplash.scss';

const AlertSplash = ({ promptState }) => {
    const dispatch = useDispatch();

    const onOkClick = () => {

    };



    const headerMessage = promptState.menuTitle;
    const card = promptState.controls[0].source;
    // const winner = game.players[game.winner];
    return (
        <Panel title='Game Over' cardClass={`splash`}>
            <>
                <CardImage card={card} />
                <div className='central'>
                    <h2>{headerMessage}</h2>
                    <button onClick={onOkClick} className='btn prompt-button btn-default'>
                        Ok
                    </button>
                </div>
            </>

        </Panel>
    );
};

export default AlertSplash;
