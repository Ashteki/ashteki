import React, { useState } from 'react';
import PictureButton from '../Lobby/PictureButton';
import { Button, Col, FormFile } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { startGameReplay } from '../../redux/actions';

const LoadReplay = ({ onCancel }) => {
    const dispatch = useDispatch();
    const [replayData, setReplayData] = useState();
    const onFileChange = (event) => {
        // Update the state
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            // The file's text will be printed here
            const replayFileText = event.target.result;
            const jsonReplay = JSON.parse(replayFileText);
            if (jsonReplay.success) {
                setReplayData(jsonReplay.replay);
            }
        };

        reader.readAsText(file);
    };

    // On file upload (click the upload button)
    const onFileUpload = () => {
        if (replayData) {
            dispatch(startGameReplay(replayData));
        }
    };

    return (
        <div className='newgame-header'>
            <PictureButton
                text='Replay'
                // header='Premium'
                disabled={true}
                imageClass='replay'
            />

            <Col>
                <FormFile label="Upload a replay file" size="lg"
                    className=''
                    onChange={onFileChange}
                />

                <div className='newgame-buttons'>
                    <Button variant='primary' className='def' onClick={() => onCancel && onCancel()}>
                        Cancel
                    </Button>
                    <button
                        className='btn btn-secondary def' onClick={onFileUpload}>
                        Start
                    </button>
                </div>
            </Col >

        </div >
    );
}

export default LoadReplay;
