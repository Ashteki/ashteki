import React, { useEffect, useState } from 'react';
import mergeImages from 'merge-images';
import { useTranslation } from 'react-i18next';

import './CardImage.scss';

/**
 * @typedef CardImageProps
 * @property {object} card // The card data to render an image for
 * @property {string} [cardBack] // The card back image to show if not showing the card image
 */

/**
 *
 * @param {CardImageProps} props
 */
const CardImage = ({ card, cardBack }) => {
    const { i18n } = useTranslation();
    let [mergedImage, setMergedImage] = useState('');
    let { maverick, anomaly, amber, image } = card;

    if (card.cardPrintedAmber) {
        amber = card.cardPrintedAmber;
    }

    useEffect(() => {
        let imgPath = card.facedown
            ? cardBack
            : `/img/cards/${i18n.language === 'en' ? '' : i18n.language + '/'}${image}.png`;

        let imagesToMerge = [];
        if (maverick) {
            let bonusIcons = amber > 0;
            let maverickHouseImg =
                '/img/maverick/maverick-' + maverick + (bonusIcons ? '-amber' : '') + '.png';
            imagesToMerge.push({ src: maverickHouseImg, x: 0, y: 0 });
            imagesToMerge.push({ src: '/img/maverick/maverick-corner.png', x: 210, y: 0 });
        }

        if (anomaly) {
            let maverickHouseImg =
                '/img/maverick/maverick-' + anomaly + (amber > 0 ? '-amber' : '') + '.png';
            imagesToMerge.push({ src: maverickHouseImg, x: 0, y: 0 });
        }

        if (imagesToMerge.length > 0) {
            mergeImages([imgPath, ...imagesToMerge])
                .then((src) => setMergedImage(src))
                .catch(() => {});
        } else {
            setMergedImage(imgPath);
        }
    }, [
        amber,
        anomaly,
        i18n.language,
        maverick,
        setMergedImage,
        image,
        cardBack,
        card.facedown,
        card
    ]);

    return (
        <>
            <img className='img-fluid' src={mergedImage} />
        </>
    );
};

export default CardImage;
