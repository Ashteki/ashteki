import React from 'react';
import classNames from 'classnames';
import './Avatar.scss';
import { storageBaseUrl } from '../../constants';

/**
 * @typedef AvatarProps
 * @property {boolean} [float] Whether or not to float the image
 * @property {string} imgPath The username whose avatar to display
 */

/**
 *
 * @param {AvatarProps} props
 */
const Avatar = ({ float, imgPath }) => {
    const className = classNames('gravatar', {
        'pull-left': float
    });

    if (!imgPath) {
        return null;
    }

    const imgUrl = storageBaseUrl
        ? `${storageBaseUrl}/avatars/${imgPath}.png`
        : `/img/avatar/${imgPath}.png`;

    return <img className={className} src={imgUrl} alt='' />;
};

export default Avatar;
