import classes from './Modal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const Modal = (props) => {
    const modalCloseHandler = () => {
        props.onModalClosed();
    };

    const buttons = props.actions.map(actionData => <button className={`${classes.btn} ${classes['btn-primary']}`} key={actionData.text} onClick={actionData.action}>{actionData.text}</button> )

    return (
        <div className={classes.modal}>
            <div className={classes['top-bar']}><FontAwesomeIcon className={classes['close-cross']} icon={faClose} onClick={modalCloseHandler} /></div>
            <div className={classes['modal-body']}>
                {props.children}
            </div>
            <div className={classes.actions}>{buttons}</div>

        </div>
    );
};

export default Modal;