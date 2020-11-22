import React, { useState } from 'react';
import './Phoenixborn.scss';
import { imageUrl } from '../../util';

const Phoenixborn = ({ pbStub }) => {
    let pbImage = imageUrl(pbStub);
    const [imageZoom, setImageZoom] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    return (
        <div>
            <img
                className='img-fluid'
                src={pbImage}
                onMouseMove={(event) => {
                    let y = event.clientY;
                    let yPlusHeight = y + 364;

                    if (yPlusHeight >= window.innerHeight) {
                        y -= yPlusHeight - window.innerHeight;
                    }

                    setMousePos({ x: event.clientX, y: y });
                }}
                onMouseOver={() => {
                    setImageZoom(true);
                }}
                onMouseOut={() => setImageZoom(false)}
            />
            {imageZoom && (
                <div
                    className='archon-zoom'
                    style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                >
                    <img className='img-fluid' src={pbImage} />
                </div>
            )}
        </div>
    );
};

export default Phoenixborn;
