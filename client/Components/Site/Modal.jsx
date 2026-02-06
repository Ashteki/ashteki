import React from 'react';
import classNames from 'classnames';

function Modal({ id, className, noClickToClose, title, bodyClassName, children }) {
    return (
        <div
            id={id}
            className='modal fade'
            data-backdrop={noClickToClose ? 'static' : null}
            tabIndex='-1'
            role='dialog'
        >
            <div className='modal-dialog' role='document'>
                <div
                    className={classNames('modal-content', className)}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='modal-header'>
                        <button
                            type='button'
                            className='close'
                            data-dismiss='modal'
                            aria-label='Close'
                        >
                            <span aria-hidden='true'>×</span>
                        </button>
                        <h4 className='modal-title'>{title}</h4>
                    </div>
                    <div className={classNames('modal-body', bodyClassName)}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

Modal.displayName = 'Modal';

export default Modal;
