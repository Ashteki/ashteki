import React from 'react';
import classNames from 'classnames';

import './PictureButton.scss';

const PictureButton = ({ onClick, text, imageClass, header, headerClass, disabled }) => {
    const classes = classNames('image-button', imageClass);
    const headerClasses = classNames('img-button-header', headerClass);

    return (
        <button className={classes} onClick={onClick} disabled={disabled}>
            {header && <div className={headerClasses}>{header}</div>}
            <div className='img-button-label'>{text}</div>
        </button>
    );
};

export default PictureButton;
