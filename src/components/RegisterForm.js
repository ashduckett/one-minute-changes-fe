import { useReducer } from 'react';
import { useDispatch } from 'react-redux';

import classes from './LoginForm.module.css';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getCookie, baseUrl, deleteCookie } from '../API';
import { appActions } from '../store/app-slice';
import FormInputField from './UI/FormInputField';
import { onFocusOut, onInputChange, UPDATE_FORM, EMAIL_EXISTS, validateInput } from '../lib/FormUtils';

const initialState = {
    firstNameState: {
        value: '',
        touched: false,
        hasError: true,
        error: ''
    },
    lastNameState: {
        value: '',
        touched: false,
        hasError: true,
        error: ''
    },
    emailState: {
        value: '',
        touched: false,
        hasError: true,
        error: ''
    },
    passwordState: {
        value: '',
        touched: false,
        hasError: true,
        error: ''
    },
    confirmPasswordState: {
        value: '',
        touched: false,
        hasError: true,
        error: ''
    },
};

const reducer = (state, action) => {
    switch (action.type) {
        case UPDATE_FORM:
            const { name, value, hasError, error, touched, isFormValid } = action.data;
            return {
                ...state,
                [name]: { ...state[name], value, hasError, error, touched },
                isFormValid
            }
        case EMAIL_EXISTS:
            return {
                ...state,
                emailState: {
                    ...state.emailState,
                    hasError: true,
                    error: 'Email already registered',
                    touched: true
                }
            }
        default:
            break;
    }
    return state;
};

const RegisterForm = () => {
    const [formState, formStateDispatch] = useReducer(reducer, initialState);
    const dispatch = useDispatch();


    const onSubmitHandler = (event) => {
        event.preventDefault();

        let isFormValid = true;

        for (const name in formState) {
            const item = formState[name];
            const { value } = item;
            const { hasError, error } = validateInput(name, value, formState);

            if (hasError) {
                isFormValid = false;
            }

            if (name) {
                formStateDispatch({
                    type: UPDATE_FORM,
                    data: {
                        name,
                        value,
                        hasError,
                        error,
                        touched: true,
                        isFormValid
                    }
                });
            }
        }
        
        if (isFormValid) {

            // Collect the form information
            const formInput = {
                first_name: formState.firstNameState.value,
                last_name: formState.lastNameState.value,
                email: formState.emailState.value,
                password: formState.passwordState.value,
                password_confirmation: formState.confirmPasswordState.value
            };
            
            fetch(`${baseUrl}/sanctum/csrf-cookie`, {
                credentials: 'include'
            }).then(r => {
                const XSRF_TOKEN = getCookie('XSRF-TOKEN');
                // Submit it
                fetch(`${baseUrl}/api/register`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(formInput),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': XSRF_TOKEN
                    }
                }).then(response => {

                    return response.json();


                    
                }).then(response => {
                    console.log(response);
                    if (response.status_code !== 401) {
                        deleteCookie('XSRF-TOKEN');
                
                        // Clear out the token so the user has to log in.
                        dispatch(appActions.logout());
                    } else {
                        deleteCookie('XSRF-TOKEN');
                        formStateDispatch({ type: EMAIL_EXISTS })
                    }
                });
            });
        }
    };
    return (
        <form onSubmit={onSubmitHandler} className={classes['login-form']}>
            <FormInputField 
                id='firstName' 
                value={formState.firstNameState.value}
                icon={faUser}
                onChangeHandler={ e => {onInputChange('firstNameState', e.target.value, formStateDispatch, formState)}}
                onBlur={ e => { onFocusOut('firstNameState', e.target.value, formStateDispatch, formState) } }
                label='First Name'
                placeholder='Type your first name'
                type='text'
                errorMsg={(formState.firstNameState.touched && formState.firstNameState.hasError) ? formState.firstNameState.error : ''}
            />
            <FormInputField 
                id='lastName' 
                value={formState.lastNameState.value}
                icon={faUser}
                onChangeHandler={ e => {onInputChange('lastNameState', e.target.value, formStateDispatch, formState)}}
                onBlur={ e => { onFocusOut('lastNameState', e.target.value, formStateDispatch, formState) } }
                label='Last Name'
                placeholder='Type your last name'
                type='text'
                errorMsg={(formState.lastNameState.touched && formState.lastNameState.hasError) ? formState.lastNameState.error : ''}
            />
            <FormInputField 
                id='email' 
                value={formState.emailState.value}
                icon={faUser}
                onChangeHandler={ e => {onInputChange('emailState', e.target.value, formStateDispatch, formState)}}
                onBlur={ e => { onFocusOut('emailState', e.target.value, formStateDispatch, formState) } }
                label='Email'
                placeholder='Type your email'
                type='text'
                errorMsg={(formState.emailState.touched && formState.emailState.hasError) ? formState.emailState.error : ''}
            />
            <FormInputField 
                id='password' 
                value={formState.passwordState.value}
                icon={faLock}
                onChangeHandler={ e => {onInputChange('passwordState', e.target.value, formStateDispatch, formState)}}
                onBlur={ e => { onFocusOut('passwordState', e.target.value, formStateDispatch, formState) } }
                label='Password'
                placeholder='Type your password'
                type='password'
                errorMsg={(formState.passwordState.touched && formState.passwordState.hasError) ? formState.passwordState.error : ''}
            />
            <FormInputField 
                id='confirmPassword' 
                value={formState.confirmPasswordState.value}
                icon={faLock}
                onChangeHandler={ e => {onInputChange('confirmPasswordState', e.target.value, formStateDispatch, formState)}}
                onBlur={ e => { onFocusOut('confirmPasswordState', e.target.value, formStateDispatch, formState) } }
                label='Confirm Password'
                placeholder='Type your password again'
                type='password'
                errorMsg={(formState.confirmPasswordState.touched && formState.confirmPasswordState.hasError) ? formState.confirmPasswordState.error : ''}
            />
            
            <div className={classes['form-controls']}>
                <button>Register</button>
            </div>
            <div className={`${classes['form-controls']} ${classes['align-centre']}`}>
                <Link to='/login'>Or Log In Here</Link>
            </div>
            
        </form>
    );
};

export default RegisterForm;