import React from 'react';
import Panel from '../Site/Panel';
import './ReplayControls.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faBackwardFast, faBackwardStep, faForward, faForwardFast, faForwardStep, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    replayRoundBack,
    replayRoundForward,
    replayStepBack,
    replayStepForward,
    replayTurnBack,
    replayTurnForward
} from '../../redux/actions';

const ReplayControls = () => {
    const dispatch = useDispatch();
    const doForwardStep = () => {
        dispatch(replayStepForward());
    };
    const doForwardTurnStep = () => {
        dispatch(replayTurnForward());
    };
    const doForwardRoundStep = () => {
        dispatch(replayRoundForward());
    };
    const doBackStep = () => {
        dispatch(replayStepBack());
    };
    const doBackTurnStep = () => {
        dispatch(replayTurnBack());
    };
    const doBackRoundStep = () => {
        dispatch(replayRoundBack());
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
    const { stepIndex, stepTag, round, turn } = useSelector((state) => ({
        stepIndex: state.lobby.stepIndex,
        stepTag: state.lobby.stepTag,
        round: state.lobby.currentGame.round,
        turn: state.lobby.currentGame.activePlayerTurn

    }));

    const title = tagToTitle[stepTag] || stepTag;

    return (
        <Panel title='REPLAY' cardClass='border-purple'>
            <div className='replay-step-title'>Round {round} {turn && ', Turn' + turn}</div>
            <div className='replay-step-title'>{title}</div>
            <div className='replay-controls'>
                <button onClick={() => doBackStep()} className='replay-control  btn-primary'>
                    <FontAwesomeIcon icon={faBackwardStep} />
                </button>
                <div className='replay-index'>{stepIndex}</div>
                <button onClick={() => doForwardStep()} className='replay-control  btn-primary'>
                    <FontAwesomeIcon icon={faForwardStep} />
                </button>
            </div>
            <div className='replay-controls'>
                <button onClick={() => doBackRoundStep()} className='replay-control  btn-primary'>
                    <FontAwesomeIcon icon={faBackwardFast} />
                </button>
                <button onClick={() => doBackTurnStep()} className='replay-control  btn-primary'>
                    <FontAwesomeIcon icon={faBackward} />
                </button>
                <button onClick={() => doForwardTurnStep()} className='replay-control  btn-primary'>
                    <FontAwesomeIcon icon={faForward} />
                </button>
                <button
                    onClick={() => doForwardRoundStep()}
                    className='replay-control  btn-primary'
                >
                    <FontAwesomeIcon icon={faForwardFast} />
                </button>
            </div>
        </Panel>
    );
};

export default ReplayControls;
