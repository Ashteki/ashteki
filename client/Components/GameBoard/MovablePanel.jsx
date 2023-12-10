import React, { useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

import { ItemTypes } from '../../constants';
import PopupDefaults from './PopupDefaults';

import './MovablePanel.scss';
import { Resizable } from 're-resizable';

const MovablePanel = ({ children, name, onCloseClick, onPlusClick, onMinusClick, side, title }) => {
    const key = `${name}-${side}`;
    const savedStyle = localStorage.getItem(key);
    const style = (savedStyle && JSON.parse(savedStyle)) || PopupDefaults[key];

    if (style) {
        if (style.left >= window.innerWidth) {
            style.left = window.innerWidth - 50;
        }

        if (style.top >= window.innerHeight) {
            style.top = window.innerHeight - 50;
        }
    }

    const [position, setPosition] = useState(Object.assign({ top: 10 }, style));
    const popupRef = useRef(null);

    // this function limits the x/y so that the popup is not lost off the edges
    const getStyle = (offset) => {
        const style = {
            left: Math.max(offset.x, 10),
            top: Math.max(offset.y, 10),
            position: 'fixed'
        };

        const popup = $(popupRef.current);

        // lost off the window to the right
        if (style.left + popup.width() > window.innerWidth) {
            style.left = window.innerWidth - popup.width();
        }

        // lost off the window to the bottom
        if (style.top + 50 > window.innerHeight) {
            style.top = window.innerHeight - 50;
        }

        return style;
    };

    const [{ isDragging, dragOffset }, drag] = useDrag({
        item: { name: key, type: ItemTypes.PANEL },
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging(),
                dragOffset: monitor.getSourceClientOffset()
            };
        },
        end: (_, monitor) => {
            const offset = monitor.getSourceClientOffset();
            const style = getStyle(offset);

            localStorage.setItem(`${key}`, JSON.stringify(style));
        }
    });

    useEffect(() => {
        if (isDragging) {
            let style = getStyle(dragOffset);

            setPosition(style);
        }
    }, [dragOffset, isDragging]);

    let content = (
        <div ref={popupRef} className='panel panel-primary movable-panel' style={position}>
            <Resizable
                enable={{
                    top: false,
                    right: false,
                    bottom: false,
                    left: false,
                    topRight: false,
                    bottomRight: true,
                    bottomLeft: false,
                    topLeft: false
                }}
                maxWidth={800}
                minWidth={200}
                minHeight={150}
            >
                <div ref={drag} className='panel-heading' onClick={(event) => event.stopPropagation()}>
                    {onMinusClick &&
                        <span className='zoom-buttons'>
                            <a className='zoom-minus' onClick={onMinusClick}>
                                <FontAwesomeIcon icon={faMinusCircle} />
                            </a>
                            /
                            <a className='zoom-plus' onClick={onPlusClick}>
                                <FontAwesomeIcon icon={faPlusCircle} />
                            </a>

                        </span>
                    }
                    <span className='text-center'>{title}</span>
                    <span className='float-right'>
                        <a className='close-button' onClick={onCloseClick}>
                            <FontAwesomeIcon icon={faTimes} />
                        </a>
                    </span>
                </div>
                {children}
            </Resizable>
        </div>
    );

    return content;
};

MovablePanel.displayName = 'MovablePanel';

export default MovablePanel;
