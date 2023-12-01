import React from 'react';
import { Col, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CardGallery from '../../Components/Profile/CardGallery';
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
        <>
            <div className='lobby-header'>You have {altCards.length} alt art cards</div>

            <Col lg={{ span: 12, offset: 0 }} className='user-alts'>
                <CardGallery cards={altCards} />
            </Col>
        </>
    );
};

export default UserAlts;
