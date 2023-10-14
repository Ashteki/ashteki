import React from 'react';
import './PictureButton.scss';

const PictureButton = ({ backgroundImage, position, scale, onClick, text, header }) => {
    const style = {
        'background-image': `url('${backgroundImage}')`,
        'background-position': `${position}`
    };

    if (scale) {
        style['background-size'] = `${scale}`;
    }

    return (
        <button className='image-button' onClick={onClick} style={style}>
            {header && <div className='img-button-header'>{header}</div>}
            <div className='img-button-label'>{text}</div>
        </button>
    );
};

export default PictureButton;
