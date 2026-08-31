import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { patreonUrl } from '../../constants';

/**
 * Modal prompting user to re-link their Patreon account if it has expired.
 * @param {Object} props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {function} props.onHide - Callback to hide the modal
 */
const PatreonRelinkerModal = ({ show, onHide }) => {
    const { t } = useTranslation();

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t('Patreon Link Expired')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    {t('Your Patreon link has expired. Re-link your account to restore access to premium content.')}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={onHide}>
                    {t('Maybe Later')}
                </Button>
                <Button variant='primary' href={patreonUrl}>
                    {t('Re-link Patreon')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PatreonRelinkerModal;
