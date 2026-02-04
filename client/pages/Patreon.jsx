import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as actions from '../redux/actions';
import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';

function Patreon({ code }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const accountLinked = useSelector((s) => s.account.accountLinked);
    const apiState = useSelector((s) => s.api.ACCOUNT_LINK_REQUEST || {});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!code) return;
        dispatch(actions.linkPatreon(code));
    }, [code, dispatch]);

    useEffect(() => {
        let t;
        if (accountLinked) {
            setSuccessMessage('Your account was linked successfully. Please wait while you are redirected.');

            t = setTimeout(() => {
                dispatch(actions.clearLinkStatus());
                navigate('/');
            }, 2000);
        }

        return () => clearTimeout(t);
    }, [accountLinked, dispatch, navigate]);

    useEffect(() => {
        let t;
        if (!code) {
            t = setTimeout(() => {
                dispatch(actions.clearLinkStatus());
                navigate('/');
            }, 2000);
        }

        return () => clearTimeout(t);
    }, [code, dispatch, navigate]);

    if (!code) {
        return (
            <>
                <AlertPanel
                    type='error'
                    message='Your account was not successfully linked.  Please wait while we redirect you.'
                />
            </>
        );
    }

    return (
        <div>
            <ApiStatus apiState={apiState} successMessage={successMessage} />
            {apiState.loading && <div>Please wait while we verify your details..</div>}
        </div>
    );
}

Patreon.displayName = 'Patreon';

export default Patreon;
