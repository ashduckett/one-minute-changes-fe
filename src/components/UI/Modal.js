import classes from './Modal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';

const Modal = (props) => {
    const dispatch = useDispatch();

    const modalCloseHandler = () => {
        dispatch({type: 'MODAL_TOGGLED'});
    };

    const buttons = props.actions.map(actionData => <button onClick={actionData.action}>{actionData.text}</button> )

    return (
        <div className={classes.modal}>
            <div className={classes['top-bar']}><FontAwesomeIcon icon={faClose} onClick={modalCloseHandler} /></div>
            <div className={classes['modal-body']}>
                {props.children}
            </div>
            <div className={classes.actions}>{buttons}</div>

        </div>
    );
};

export default Modal;