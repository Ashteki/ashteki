import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Panel from '../Components/Site/Panel';

import * as actions from '../redux/actions';
import { Col } from 'react-bootstrap';

function NodeAdmin() {
    const nodeStatus = useSelector((state) => state.admin.nodeStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.sendSocketMessage('getnodestatus'));
    }, [dispatch]);

    const handleToggleNodeClick = useCallback((node, event) => {
        event.preventDefault();
        dispatch(actions.sendSocketMessage('togglenode', node.name));
    }, [dispatch]);

    const handleRefreshClick = useCallback((event) => {
        event.preventDefault();
        dispatch(actions.sendSocketMessage('getnodestatus'));
    }, [dispatch]);

    const handleRestartNodeClick = useCallback((node, event) => {
        event.preventDefault();
        dispatch(actions.sendSocketMessage('restartnode', node.name));
    }, [dispatch]);

    const getNodesTable = useCallback(() => {
        const body = nodeStatus.map((node) => {
            return (
                <tr key={node.name}>
                    <td>{node.name}</td>
                    <td>{node.numGames}</td>
                    <td>{node.status}</td>
                    <td>{node.version}</td>
                    <td>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={(event) => handleToggleNodeClick(node, event)}
                        >
                            {node.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={(event) => handleRestartNodeClick(node, event)}
                        >
                            Restart
                        </button>
                    </td>
                </tr>
            );
        });

        return (
            <table className='table table-striped table-dark'>
                <thead>
                    <tr>
                        <th>Node Name</th>
                        <th>Num Games</th>
                        <th>Status</th>
                        <th>Version</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{body}</tbody>
            </table>
        );
    }, [nodeStatus, handleToggleNodeClick, handleRestartNodeClick]);

    let content;

    if (!nodeStatus) {
        content = <div>Waiting for game node status from the lobby...</div>;
    } else if (nodeStatus.length > 0) {
        content = getNodesTable();
    } else {
        content = <div>There are no game nodes connected. This is probably bad.</div>;
    }

    return (
        <Col sm={{ span: 10, offset: 1 }}>
            <Panel title='Game Node Administration'>
                {content}

                <button className='btn btn-default' onClick={handleRefreshClick}>
                    Refresh
                </button>
            </Panel>
        </Col>
    );
}

NodeAdmin.displayName = 'NodeAdmin';

export default NodeAdmin;
