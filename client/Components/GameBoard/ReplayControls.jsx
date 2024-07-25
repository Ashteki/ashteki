import React from 'react';
import Panel from '../Site/Panel';
import './ReplayControls.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faForwardStep } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { replayStepForward } from '../../redux/actions';

const ReplayControls = () => {
    const dispatch = useDispatch();
    const doForwardStep = () => {
        dispatch(replayStepForward());
    };

    return <Panel title='REPLAY' cardClass='border-purple'>
        <div className='replay-controls'>
            <FontAwesomeIcon icon={faBackwardStep} className='replay-control' />

            <button onClick={() => doForwardStep()} className='replay-control  btn-primary'>
                <FontAwesomeIcon icon={faForwardStep} />
            </button>
        </div>
    </Panel>;
};

export default ReplayControls;
