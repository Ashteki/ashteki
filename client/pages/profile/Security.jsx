import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import AlertPanel from '../../Components/Site/AlertPanel';
import Panel from '../../Components/Site/Panel';
import * as actions from '../../redux/actions';

import { withTranslation, Trans } from 'react-i18next';

function Security({ t }) {
    const [detailsLoaded, setDetailsLoaded] = useState(false);
    const user = useSelector((state) => state.account.user);
    const apiError = useSelector((state) => state.api.message);
    const loading = useSelector((state) => state.api.loading);
    const sessionRemoved = useSelector((state) => state.user.sessionRemoved);
    const sessions = useSelector((state) => state.user.sessions);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user && !detailsLoaded) {
            dispatch(actions.loadActiveSessions(user));
            setDetailsLoaded(true);
        }
    }, [user, detailsLoaded, dispatch]);

    const handleRemoveClick = useCallback((session, event) => {
        event.preventDefault();

        if (!user) {
            return;
        }

        toastr.confirm(
            t(
                'Are you sure you want to remove this session?  It will be logged out and any games in progress may be abandonded.'
            ),
            {
                okText: t('Ok'),
                cancelText: t('Cancel'),
                onOk: () => {
                    dispatch(actions.removeSession(user.username, session.id));
                }
            }
        );
    }, [user, t, dispatch]);

    useEffect(() => {
        if (sessionRemoved) {
            const timer = setTimeout(() => {
                dispatch(actions.clearSessionStatus());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [sessionRemoved, dispatch]);

    let content;
    let successPanel;

    if (sessionRemoved) {
        successPanel = (
            <AlertPanel message={t('Session removed successfully')} type={'success'} />
        );
    }

    let sessionRows = sessions
        ? sessions.map((session) => {
            return (
                <tr key={session.id}>
                    <td>{session.ip}</td>
                    <td>{moment(session.lastUsed).format('YYYY-MM-DD HH:mm')}</td>
                    <td>
                        <a
                            href='#'
                            onClick={(event) => handleRemoveClick(session, event)}
                            className='text-danger'
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </a>
                    </td>
                </tr>
            );
        })
        : null;
    let table =
        sessions && sessions.length === 0 ? (
            <div>You have no active sessions. This shouldn&quot;t really happen.</div>
        ) : (
            <table className='table table-striped table-dark'>
                <thead>
                    <tr>
                        <th>
                            <Trans>IP Address</Trans>
                        </th>
                        <th>
                            <Trans>Last Used</Trans>
                        </th>
                        <th>
                            <Trans>Remove</Trans>
                        </th>
                    </tr>
                </thead>
                <tbody>{sessionRows}</tbody>
            </table>
        );

    if (loading) {
        content = (
            <div>
                <Trans>Loading session details from the server...</Trans>
            </div>
        );
    } else if (apiError) {
        content = <AlertPanel type='error' message={apiError} />;
    } else {
        content = (
            <div className='col-sm-8 col-sm-offset-2 profile full-height'>
                {successPanel}
                <Panel title={t('Active Sessions')}>
                    <p className='help-block'>
                        <Trans i18nKey='security.note'>
                            Below you will see the active &quot;sessions&quot; that you have on
                            the website. If you see any unexpected activity on your account,
                            remove the session and consider changing your password.
                        </Trans>
                    </p>
                    {table}
                </Panel>
            </div>
        );
    }

    return content;
}

Security.displayName = 'Security';

export default withTranslation()(Security);
