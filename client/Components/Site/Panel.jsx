import React from 'react';

import './Panel.scss';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

/** 
 * @typedef {'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'} PanelType
 */

const PanelType = Object.freeze({
    Default: 'default',
    Primary: 'primary',
    Info: 'info',
    Warning: 'warning',
    Danger: 'danger'
});

/**
 * @typedef PanelProps
 * @property {import('react').ReactNode | import('react').ReactNodeArray} [children]
 * @property {string} [className]
 * @property {string} [title]
 * @property {string} [titleClass]
 * @property {string} [type]
 */

/**
 * @param {PanelProps} props
 */
const Panel = ({
    type = PanelType.Primary,
    title,
    titleClass,
    children,
    cardClass,
    onCloseClick
}) => {
    /** @type {PanelType} */
    let retType;

    switch (type) {
        case PanelType.Primary:
            retType = 'primary';
            break;
        case PanelType.Default:
            retType = 'secondary';
            break;
        case PanelType.Info:
            retType = 'info';
            break;
        case PanelType.Warning:
            retType = 'warning';
            break;
        case PanelType.Danger:
            retType = 'danger';
            break;
        default:
            retType = 'border';
            break;
    }

    const closeButton = onCloseClick ? (
        <a className='close-button' onClick={onCloseClick}>
            <FontAwesomeIcon icon={faTimes} />
        </a>
    ) : null;

    return (
        <Card border={retType} bg='dark' className={cardClass}>
            {title && <Card.Header className={`${titleClass} text-center`}>{title}

                <span className='float-right'>
                    {closeButton}
                </span>
            </Card.Header>}
            <Card.Body>{children}</Card.Body>
        </Card>
    );
};

export default Panel;
