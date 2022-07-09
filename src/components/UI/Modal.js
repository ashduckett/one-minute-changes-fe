import classes from './Modal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { appActions } from '../../store';

const Modal = (props) => {
    const dispatch = useDispatch();

    const modalCloseHandler = () => {
        props.onModalClosed();
        // dispatch({type: 'MODAL_TOGGLED'});
        // appActions.modalToggled();
        dispatch(appActions.modalToggled());
    };

    const buttons = props.actions.map(actionData => <button key={actionData.text} onClick={actionData.action}>{actionData.text}</button> )

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