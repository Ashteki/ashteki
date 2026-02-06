import React, { useEffect, useState, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';

import * as actions from '../redux/actions';

function ResetPassword({ id, token }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const accountPasswordReset = useSelector((s) => s.account.passwordReset);
    const apiLoading = useSelector((s) =>
        s.api.RESETPASSWORD_ACCOUNT ? s.api.RESETPASSWORD_ACCOUNT.loading : undefined
    );
    const apiMessage = useSelector((s) =>
        s.api.RESETPASSWORD_ACCOUNT ? s.api.RESETPASSWORD_ACCOUNT.message : undefined
    );
    const apiSuccess = useSelector((s) =>
        s.api.RESETPASSWORD_ACCOUNT ? s.api.RESETPASSWORD_ACCOUNT.success : undefined
    );

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        let t;
        if (accountPasswordReset) {
            setSuccessMessage(
                'Your password has been changed.  You will shortly be redirected to the login page.'
            );

            t = setTimeout(() => {
                navigate('/login');
            }, 3000);
        }

        return () => clearTimeout(t);
    }, [accountPasswordReset, navigate]);

    const onSubmit = useCallback(
        (state) => {
            dispatch(actions.resetPassword({ id, token, newPassword: state.password }));
        },
        [dispatch, id, token]
    );

    if (!id || !token) {
        return (
            <AlertPanel
                type='error'
                message='This page is not intended to be viewed directly.  Please click on the link in your email to reset your password'
            />
        );
    }

    const errorBar = apiSuccess === false ? <AlertPanel type='error' message={apiMessage} /> : null;
    const successBar = successMessage ? <AlertPanel type='success' message={successMessage} /> : null;

    return (
        <div>
            <div className='col-sm-6 col-sm-offset-3'>
                {errorBar}
                {successBar}
                <Panel title='Reset password'>
                    <Form name='resetpassword' apiLoading={apiLoading} buttonText='Submit' onSubmit={onSubmit} />
                </Panel>
            </div>
        </div>
    );
}

ResetPassword.displayName = 'ResetPassword';

export default ResetPassword;
