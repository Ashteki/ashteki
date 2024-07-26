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
    const { stepIndex, stepTag } = useSelector((state) => ({
        stepIndex: state.lobby.stepIndex,
        stepTag: state.lobby.stepTag
    }))
    return <Panel title='REPLAY' cardClass='border-purple'>
        <div>{stepTag}</div>
        <div className='replay-controls'>
            <button onClick={() => doBackStep()} className='replay-control  btn-primary'>
                <FontAwesomeIcon icon={faBackwardStep} />
            </button>

            <button onClick={() => doForwardStep()} className='replay-control  btn-primary'>
                <FontAwesomeIcon icon={faForwardStep} />
            </button>
        </div>
    </Panel>;
};

export default ReplayControls;
