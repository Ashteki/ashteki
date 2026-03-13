import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AlertPanel from '../Components/Site/AlertPanel.jsx';
import Panel from '../Components/Site/Panel.jsx';
import Form from '../Components/Form/Form.jsx';

import * as actions from '../redux/actions';

import { useTranslation } from 'react-i18next';

function Register() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const accountRegistered = useSelector((s) => s.account.registered);
    const apiLoading = useSelector((s) =>
        s.api.REGISTER_ACCOUNT ? s.api.REGISTER_ACCOUNT.loading : undefined
    );
    const apiMessage = useSelector((s) =>
        s.api.REGISTER_ACCOUNT ? s.api.REGISTER_ACCOUNT.message : undefined
    );
    const apiSuccess = useSelector((s) =>
        s.api.REGISTER_ACCOUNT ? s.api.REGISTER_ACCOUNT.success : undefined
    );

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        let tId;
        if (accountRegistered) {
            setSuccessMessage(t('Your account was successfully registered.  You can now proceed to login.'));
            tId = setTimeout(() => navigate('/login'), 2000);
        }

        return () => clearTimeout(tId);
    }, [accountRegistered, navigate, t]);

    const onRegister = useCallback(
        (state) => {
            dispatch(actions.registerAccount({ username: state.username, password: state.password, email: state.email }));
        },
        [dispatch]
    );

    const errorBar = apiSuccess === false ? <AlertPanel type='error' message={t(apiMessage)} /> : null;
    const successBar = successMessage ? <AlertPanel type='success' message={t(successMessage)} /> : null;

    return (
        <div className='col-md-8 col-md-offset-2'>
            {errorBar}
            {successBar}
            <Panel title={t('Register an account')}>
                <Form name='register' apiLoading={apiLoading} buttonText='Register' onSubmit={onRegister} />
            </Panel>
        </div>
    );
}

Register.displayName = 'Register';

export default Register;
