import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBan } from '@fortawesome/free-solid-svg-icons';

import './ServerStatus.scss';
import { useSelector } from 'react-redux';

const ServerStatus = (props) => {
    const { connecting, connected, responseTime, serverType } = props;
    const { t } = useTranslation();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const isReplay = currentGame?.isReplay;


    let className = '';
    let toolTip = `${serverType} is`;
    let pingText;
    let icon = faCheckCircle;
    let splash = null;

    if (connected) {
        className += ' text-success';
        toolTip += ' connected';

        let pingClass;

        if (responseTime === undefined) {
            pingText = <span>{t('Waiting for ping')}</span>;
        } else {
            if (responseTime < 150) {
                pingClass = 'text-success';
            } else if (responseTime < 300) {
                pingClass = 'text-warning';
            } else {
                pingClass = 'text-danger';
            }

            pingText = (
                <React.Fragment>
                    <span>{serverType}: </span>
                    <span className={pingClass}>{responseTime}ms</span>
                </React.Fragment>
            );
        }
    } else if (connecting) {
        className += ' text-warning';
        icon = faTimesCircle;
        toolTip += ' connecting';
        pingText = (
            <React.Fragment>
                <span>{serverType}: </span>
                <span className='text-warning'>{t('Connecting')}</span>
            </React.Fragment>
        );
    } else {
        className += ' text-danger';
        icon = faBan;
        toolTip += ' disconnected';
        pingText = (
            <React.Fragment>
                <span>{serverType}: </span>
                <span className='text-danger'>{t('Disconnected')}</span>
            </React.Fragment>
        );
        splash = !isReplay && <div className='disconnect-splash panel'><span className='text-danger'>Disconnected!</span></div>
    }

    return (
        <li className='server-status'>
            {pingText}
            <span className={className}>
                <FontAwesomeIcon icon={icon} title={t(toolTip)} />
            </span>
            {splash}
        </li>
    );
};

ServerStatus.displayName = 'ServerStatus';
ServerStatus.propTypes = {
    connected: PropTypes.bool,
    connecting: PropTypes.bool,
    responseTime: PropTypes.number,
    serverType: PropTypes.string
};

export default ServerStatus;
