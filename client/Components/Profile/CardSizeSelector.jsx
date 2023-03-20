import React from 'react';
import { cardSizes } from '../../util';

import CardSizeOption from './CardSizeOption';

const CardSizeSelector = ({ selectedCardSize, onCardSizeSelected }) => {
    return cardSizes.map((cardSize) => (
        <CardSizeOption
            key={cardSize.name}
            label={cardSize.label}
            name={cardSize.name}
            onSelect={onCardSizeSelected}
            selected={selectedCardSize === cardSize.name}
        />
    ));
};

export default CardSizeSelector;
