import React from 'react';
import Panel from '../Site/Panel';
import './ReplayControls.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faForwardStep } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { replayStepBack, replayStepForward } from '../../redux/actions';

const ReplayControls = () => {
    const dispatch = useDispatch();
    const doForwardStep = () => {
        dispatch(replayStepForward());
    };
    const doBackStep = () => {
        dispatch(replayStepBack());
    };

    const tagToTitle = {
        prepare: 'Start of Round',
        ability: 'Player Action',
        'begin-turn': 'Start of Turn',
        'attackers-declared': 'Attackers Declared',
        'defenders-declared': 'Defenders Declared',
        'battle-resolved': 'Battle Resolved',
        end: 'Game End'
    }
    const { stepIndex, stepTag } = useSelector((state) => ({
        stepIndex: state.lobby.stepIndex,
        stepTag: tagToTitle[state.lobby.stepTag] || state.lobby.stepTag
    }));

    return (
        <Panel title='REPLAY' cardClass='border-purple'>
            <div className='replay-step-title'>{stepTag}</div>
            <div className='replay-controls'>
                <button onClick={() => doBackStep()} className='replay-control  btn-primary'>
                    <FontAwesomeIcon icon={faBackwardStep} />
                </button>
                <div className='replay-index'>{stepIndex}</div>
                <button onClick={() => doForwardStep()} className='replay-control  btn-primary'>
                    <FontAwesomeIcon icon={faForwardStep} />
                </button>
            </div>
        </Panel>
    );
};

export default ReplayControls;
