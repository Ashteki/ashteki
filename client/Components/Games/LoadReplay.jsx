import React, { useState } from 'react';
import PictureButton from '../Lobby/PictureButton';
import { Col, FormFile } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { startGameReplay } from '../../redux/actions';
import Form from '../Form/Form';

const LoadReplay = () => {
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

                <button style={{ marginTop: '20px' }}
                    className='btn btn-primary def' onClick={onFileUpload}>
                    Start
                </button>
            </Col>

        </div >
    );
}

export default LoadReplay;
