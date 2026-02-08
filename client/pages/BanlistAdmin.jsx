import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import Form from '../Components/Form/Form';
import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { Col } from 'react-bootstrap';
import { addBanlist, clearbanlistStatus, deleteBanlist, loadBanlist } from '../redux/actions';

function BanlistAdmin() {
    const dispatch = useDispatch();

    const apiAddState = useSelector((s) => s.api.ADD_BANLIST);
    const apiDeleteState = useSelector((s) => s.api.DELETE_BANLIST);
    const apiState = useSelector((s) => s.api.REQUEST_BANLIST);
    const banlistAdded = useSelector((s) => s.admin.banlistAdded);
    const banlistDeleted = useSelector((s) => s.admin.banlistDeleted);
    const banlist = useSelector((s) => s.admin.banlist);

    const [successMessage, setSuccessMessage] = useState(undefined);
    const [currentRequest, setCurrentRequest] = useState('REQUEST_BANLIST');

    useEffect(() => {
        dispatch(loadBanlist());
    }, [dispatch]);

    useEffect(() => {
        let t;
        if (banlistAdded) {
            setSuccessMessage('Banlist item added successfully.');
            t = setTimeout(() => {
                dispatch(clearbanlistStatus());
                setSuccessMessage(undefined);
            }, 5000);
        }

        if (banlistDeleted) {
            setSuccessMessage('Banlist item deleted successfully.');
            t = setTimeout(() => {
                dispatch(clearbanlistStatus());
                setSuccessMessage(undefined);
            }, 5000);
        }

        return () => clearTimeout(t);
    }, [banlistAdded, banlistDeleted, dispatch]);

    const onAddBanlistClick = useCallback(
        (state) => {
            setCurrentRequest('ADD_BANLIST');
            dispatch(addBanlist(state.ip));
        },
        [dispatch]
    );

    const onDeleteClick = useCallback(
        (id) => {
            setCurrentRequest('DELETE_BANLIST');
            dispatch(deleteBanlist(id));
        },
        [dispatch]
    );

    if (apiState && apiState.loading) {
        return 'Loading banlist, please wait...';
    }

    let statusBar;

    switch (currentRequest) {
        case 'REQUEST_BANLIST':
            statusBar = <ApiStatus apiState={apiState} successMessage={successMessage} />;
            break;
        case 'ADD_BANLIST':
            statusBar = <ApiStatus apiState={apiAddState} successMessage={successMessage} />;
            break;
        case 'DELETE_BANLIST':
            statusBar = <ApiStatus apiState={apiDeleteState} successMessage={successMessage} />;
            break;
    }

    let renderedBanlist = banlist.map((entry) => {
        return (
            <tr key={entry.id}>
                <td>{entry.ip}</td>
                <td>{moment(entry.added).format('YYYY-MM-DD')}</td>
                <td>{entry.user}</td>
                <td>
                    <button
                        type='button'
                        className='btn btn-danger'
                        onClick={() => onDeleteClick(entry.id)}
                    >
                        Delete{' '}
                        {apiDeleteState && apiDeleteState.loading && (
                            <span className='spinner button-spinner' />
                        )}
                    </button>
                </td>
            </tr>
        );
    });

    return (
        <Col>
            {statusBar}
            <Panel title='Banlist administration'>
                <table className='table table-striped table-dark'>
                    <thead>
                        <tr>
                            <th className='col-sm-2'>Ip</th>
                            <th className='col-sm-2'>Added</th>
                            <th className='col-sm-3'>Added By</th>
                            <th className='col-sm-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>{renderedBanlist}</tbody>
                </table>
            </Panel>
            <Panel title='Add new ip'>
                <Form
                    name='banlistAdmin'
                    apiLoading={apiAddState && apiAddState.loading}
                    buttonClass='col-sm-offset-2 col-sm-4'
                    buttonText='Add'
                    onSubmit={onAddBanlistClick}
                />
            </Panel>
        </Col>
    );
}

BanlistAdmin.displayName = 'BanlistAdmin';

export default BanlistAdmin;
