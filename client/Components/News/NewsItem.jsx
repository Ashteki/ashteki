import React from 'react';
import moment from 'moment';

import { getMessageWithLinks } from '../../util';

import './NewsItem.scss';

/**
 * @typedef NewsItemProps
 * @property {Date} date The date the news item was posted
 * @property {NewsIcon} icon The icon to display
 * @property {string} text The text of the news
 */

/**
 *
 * @param {NewsItemProps} props
 */
const NewsItem = ({ date, icon, text }) => {
    let parts = getMessageWithLinks(text);

    return (
        <div className='news-item'>
            <div className={`news-icon ${icon}`} />
            <div>&nbsp;{moment(date).format('YYYY-MM-DD') + ' - '}&nbsp;
                {parts}&nbsp;</div>
        </div>
    );
};

NewsItem.displayName = 'NewsItem';

export default NewsItem;
