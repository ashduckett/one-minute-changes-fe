import classes from './FormInputField.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormInputField = props => {
    return (
        <div className={classes['form-controls']}>
            <label htmlFor={props.id}>{props.label}</label>
            <div className={classes['login-form-input']}>
                <FontAwesomeIcon icon={props.icon} />
                <input 
                    onChange={props.onChangeHandler} 
                    value={props.email} 
                    type={props.type} 
                    id={props.id} 
                    placeholder={props.placeholder} 
                    onBlur={props.onBlur} 
                />
            </div>
            {props.displayError && <p>{props.errorMsg}</p>}
            
        </div>
    );
};

export default FormInputField;