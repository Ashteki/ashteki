import React from 'react';
import classNames from 'classnames';

import './PictureButton.scss';

const PictureButton = ({
    onClick,
    text,
    imageClass,
    header,
    disabled
}) => {
    const classes = classNames('image-button', imageClass);
    return (
        <button className={classes} onClick={onClick} disabled={disabled}>
            {header && <div className='img-button-header'>{header}</div>}
            <div className='img-button-label'>{text}</div>
        </button>
    );
};

export default PictureButton;
