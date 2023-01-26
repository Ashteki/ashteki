import React from 'react';
import { Col, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CardGallery from '../Components/Profile/CardGallery';
import Panel from '../Components/Site/Panel';
import './UserAlts.scss';

function UserAlts() {
    const user = useSelector((state) => state.account.user);

    if (!user) {
        return <Alert variant='danger'>{'You need to be logged in to view your details'}</Alert>;
    }

    var allAlts = Object.values(user.altArts || [])
        .reduce(function (prev, next) {
            return prev.concat(next);
        }, []);

    const altCards = allAlts.map((a) => ({ imageStub: a }));
    return (
        <Panel type='lobby'>
            <h2>Alt arts</h2>
            <p>You have {altCards.length} alt art cards</p>

            <Col lg={{ span: 12, offset: 0 }} className='user-alts'>
                <CardGallery cards={altCards} />
            </Col>
        </Panel>

    );
};

export default UserAlts;
