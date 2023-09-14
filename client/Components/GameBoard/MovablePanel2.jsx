import React, { useEffect, useRef, useState } from 'react';
// import { useDrag } from 'react-dnd';
// import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// import { ItemTypes } from '../../constants';
import { Rnd } from 'react-rnd';

// import './MovablePanel.scss';

const MovablePanel2 = ({ children, name, onCloseClick, side, title }) => {
    // const popupRef = useRef(null);
    const key = `${name}-${side}`;
    const savedCoords = localStorage.getItem(key);
    const coords = (savedCoords && JSON.parse(savedCoords)) || { x: 200, y: 200 };

    const handleDragStop = (e, d) => {
        localStorage.setItem(`${key}`, JSON.stringify({ x: d.x, y: d.y }));
    };

    let content = (
        <Rnd
            className='panel panel-primary info-panel manual-commands bg-dark'
            default={{
                x: coords.x || 200,
                y: coords.y || 200,
                width: 620
            }}
            style={{
                display: 'flex',
                flexDirection: 'column'
            }}
            maxHeight={600}
            onDragStop={handleDragStop}
        >
            <div className='panel-heading' onClick={(event) => event.stopPropagation()}>
                <span className='text-center'>{title}</span>
                <span className='float-right'>
                    <a className='close-button' onClick={onCloseClick}>
                        <FontAwesomeIcon icon={faTimes} />
                    </a>
                </span>
            </div>
            <div className='panel-body'>{children}</div>
        </Rnd>
    );

    return content;
};

MovablePanel2.displayName = 'MovablePanel2';

export default MovablePanel2;
