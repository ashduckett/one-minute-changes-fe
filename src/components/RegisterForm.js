import { useState, useReducer } from 'react';
import { useDispatch } from 'react-redux';

import classes from './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getCookie, baseUrl, deleteCookie } from '../API';
import { appActions } from '../store/app-slice';
import FormInputField from './UI/FormInputField';

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const initialState = {
    firstNameState: {
        value: '',
        isValid: false,
        errorMsg: 'Please enter a first name.',
        wasTouched: false,
        displayError: false,
    },
    lastNameState: {
        value: '',
        isValid: false,
        errorMsg: 'Please enter a last name.',
        wasTouched: false,
        displayError: false
    },
    emailState: {
        value: '',
        isValid: false,
        errorMsg: 'Please enter an email.',
        wasTouched: false,
        displayError: false
    },
    passwordState: {
        value: '',
        isValid: false,
        errorMsg: 'Please enter a password.',
        wasTouched: false,
        displayError: false
    },
    confirmPasswordState: {
        value: '',
        isValid: false,
        errorMsg: 'Please confirm your password.',
        wasTouched: false,
        displayError: false
    },
};

const reducer = (state, action) => {
    switch(action.type) {
        case 'FIRST_NAME_CHANGE':
            let firstNameErrorMessage = 'Please enter a first name.';
            let firstNameExists = action.payload.value.length !== 0;
            firstNameErrorMessage = firstNameExists ? '' : firstNameErrorMessage;

            return {
                ...state,
                firstNameState: {
                    ...state.firstNameState,
                    value: action.payload.value,
                    isValid: firstNameExists,
                    errorMsg: firstNameErrorMessage,
                    displayError: state.firstNameState.wasTouched && !firstNameExists
                }
            };

        case 'FIRST_NAME_BLUR':
            return {
                ...state,
                firstNameState: {
                    ...state.firstNameState,
                    wasTouched: true,
                    displayError: !state.firstNameState.isValid,
                }
            }

        case 'LAST_NAME_CHANGE':
            let lastNameErrorMessage = 'Please enter a last name.';
            let lastNameExists = action.payload.value.length !== 0;
            lastNameErrorMessage = lastNameExists ? '' : lastNameErrorMessage;

            return {
                ...state,
                lastNameState: {
                    ...state.lastNameState,
                    value: action.payload.value,
                    isValid: lastNameExists,
                    errorMsg: lastNameErrorMessage,
                    displayError: state.lastNameState.wasTouched && !lastNameExists
                }
            };

        case 'LAST_NAME_BLUR':
            return {
                ...state,
                lastNameState: {
                    ...state.lastNameState,
                    wasTouched: true,
                    displayError: !state.lastNameState.isValid,
                }
            }

        case 'EMAIL_CHANGE':
            let emailErrorMessage = 'Please enter an email address.';
            let emailExists = action.payload.value.length !== 0;
            let validEmail = validateEmail(action.payload.value);

            if (!emailExists) {
                emailErrorMessage = 'Please enter an email address.';
            } else if (!validEmail) {
                emailErrorMessage = 'Please enter a valid email address.';
            } else {
                emailErrorMessage = '';
            }
            
            let emailValid = action.payload.value.length > 0 && validateEmail(action.payload.value);

            return {
                ...state,
                emailState: {
                    ...state.emailState,
                    value: action.payload.value,
                    isValid: emailValid,
                    errorMsg: emailErrorMessage,
                    displayError: state.emailState.wasTouched && !emailValid
                }
            };

        case 'EMAIL_BLUR':
            return {
                ...state,
                emailState: {
                    ...state.emailState,
                    wasTouched: true,
                    displayError: !state.emailState.isValid,

                }
            }

            case 'PASSWORD_CHANGE':
                let passwordErrorMessage = 'Please enter a password.';
                let passwordExists = action.payload.value.length !== 0;
    
                passwordErrorMessage = passwordExists ? '' : passwordErrorMessage;
                return {
                    ...state,
                    passwordState: {
                        ...state.passwordState,
                        value: action.payload.value,
                        isValid: passwordExists,
                        errorMsg: passwordErrorMessage,
                        displayError: state.passwordState.wasTouched && !passwordExists
                    }
                };

            case 'PASSWORD_BLUR':
                return {
                    ...state,
                    passwordState: {
                        ...state.passwordState,
                        wasTouched: true,
                        displayError: !state.passwordState.isValid,
                    }
                }

            case 'CONFIRM_PASSWORD_CHANGE':
                let confirmPasswordErrorMessage = 'Please confirm your password.';
                let confirmPasswordExists = action.payload.value.length !== 0;
                let passwordValid = state.passwordState.isValid;
                let passwordMatches = state.passwordState.value === action.payload.value;
                confirmPasswordErrorMessage = confirmPasswordExists ? '' : confirmPasswordErrorMessage;


                if (!passwordValid) {
                    confirmPasswordErrorMessage = 'Please enter a password and then confirm';
                } else {
                    if (!passwordMatches) {
                        confirmPasswordErrorMessage = 'Must match password';
                    }
                }

                console.log(confirmPasswordErrorMessage)

                return {
                    ...state,
                    confirmPasswordState: {
                        ...state.confirmPasswordState,
                        value: action.payload.value,
                        isValid: confirmPasswordExists && passwordValid && passwordMatches,
                        errorMsg: confirmPasswordErrorMessage,
                        displayError: state.confirmPasswordState.wasTouched && (!confirmPasswordExists || !passwordValid || !passwordMatches)
                    }
                };
            
            case 'CONFIRM_PASSWORD_BLUR':
                return {
                    ...state,
                    confirmPasswordState: {
                        ...state.confirmPasswordState,
                        wasTouched: true,
                        displayError: !state.confirmPasswordState.isValid,
                    }
                }
            case 'EMAIL_EXISTS':
                return {
                    ...state,
                    emailState: {
                        ...state.emailState,
                        wasTouched: true,
                        displayError: true,
                        errorMsg: 'Email already registered'
                    }
                }
       
        default:
            return state;
    }
};

const RegisterForm = () => {
    const [formState, formStateDispatch] = useReducer(reducer, initialState);
    const dispatch = useDispatch();


    const onSubmitHandler = (event) => {
        event.preventDefault();

        // You could dispatch each of the change functions here but that's messy.
        // Have a think. There may be a function or two you could break the validation stuff into.
        // You will need to go through each of the fields.
        // VALIDATE_FORM TEMPORARY CODE
        formStateDispatch({ type: 'FIRST_NAME_BLUR' });
        formStateDispatch( { type: 'FIRST_NAME_CHANGE', payload: { value: formState.firstNameState.value }});

        formStateDispatch({ type: 'LAST_NAME_BLUR' });
        formStateDispatch( { type: 'LAST_NAME_CHANGE', payload: { value: formState.lastNameState.value }});

        formStateDispatch({ type: 'EMAIL_BLUR' });
        formStateDispatch( { type: 'EMAIL_CHANGE', payload: { value: formState.emailState.value }});

        formStateDispatch({ type: 'PASSWORD_BLUR' });
        formStateDispatch( { type: 'PASSWORD_CHANGE', payload: { value: formState.passwordState.value }});

        formStateDispatch({ type: 'CONFIRM_PASSWORD_BLUR' });
        formStateDispatch({ type: 'CONFIRM_PASSWORD_CHANGE', payload: { value: formState.confirmPasswordState.value }});

        if (formState.firstNameState.isValid && formState.lastNameState.isValid && formState.emailState.isValid && formState.passwordState.isValid && formState.confirmPasswordState.isValid) {
            console.log('submitted');

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
                        console.log('User exists. Figure out where to put error.');
                        formStateDispatch({ type: 'EMAIL_EXISTS' });
                    }
                });
                console.log(formInput);

            
            });
        }
    };

    const firstNameChangeHandler = (event) => {
        // setFirstName(event.target.value);
        formStateDispatch( { type: 'FIRST_NAME_CHANGE', payload: { value: event.target.value }});
    };

    const firstNameBlurHandler = (event) => {
        formStateDispatch({ type: 'FIRST_NAME_BLUR' });
    };

    const lastNameChangeHandler = (event) => {
        // setLastName(event.target.value);
        formStateDispatch( { type: 'LAST_NAME_CHANGE', payload: { value: event.target.value }});
    };

    const lastNameBlurHandler = (event) => {
        formStateDispatch({ type: 'LAST_NAME_BLUR' });
    };

    const emailChangeHandler = (event) => {
        formStateDispatch( { type: 'EMAIL_CHANGE', payload: { value: event.target.value }});
    };

    const emailBlurHandler = (event) => {
        formStateDispatch({ type: 'EMAIL_BLUR' });
    };

    const passwordChangeHandler = (event) => {
        // setPassword(event.target.value);
        formStateDispatch( { type: 'PASSWORD_CHANGE', payload: { value: event.target.value }});
    };

    const passwordBlurHandler = (event) => {
        formStateDispatch({ type: 'PASSWORD_BLUR' });
    };

    const passwordConfirmationChangeHandler = (event) => {
        // setConfirmPassword(event.target.value);
        formStateDispatch( { type: 'CONFIRM_PASSWORD_CHANGE', payload: { value: event.target.value }});
    };

    const passwordConfirmationBlurHandler = (event) => {
        formStateDispatch({ type: 'CONFIRM_PASSWORD_BLUR' });
    };


    return (
        <form onSubmit={onSubmitHandler} className={classes['login-form']}>
            <FormInputField 
                id='firstName' 
                value={formState.firstNameState.value}
                icon={faUser}
                onChangeHandler={firstNameChangeHandler}
                label='First Name'
                placeholder='Type your first name'
                type='text'
                errorMsg={formState.firstNameState.errorMsg}
                onBlur={firstNameBlurHandler}
                displayError={formState.firstNameState.displayError}
            />
            <FormInputField 
                id='lastName' 
                value={formState.lastNameState.value}
                icon={faUser}
                onChangeHandler={lastNameChangeHandler}
                label='Last Name'
                placeholder='Type your last name'
                type='text'
                errorMsg={formState.lastNameState.errorMsg}
                onBlur={lastNameBlurHandler}
                displayError={formState.lastNameState.displayError}
            />
            <FormInputField 
                id='email' 
                value={formState.emailState.value}
                icon={faUser}
                onChangeHandler={emailChangeHandler}
                label='Email'
                placeholder='Type your email'
                type='text'
                errorMsg={formState.emailState.errorMsg}
                onBlur={emailBlurHandler}
                displayError={formState.emailState.displayError}
            />
            <FormInputField 
                id='password' 
                value={formState.passwordState.value}
                icon={faUser}
                onChangeHandler={passwordChangeHandler}
                label='Password'
                placeholder='Type your password'
                type='password'
                errorMsg={formState.passwordState.errorMsg}
                onBlur={passwordBlurHandler}
                displayError={formState.passwordState.displayError}
            />
            <FormInputField 
                id='confirmPassword' 
                value={formState.confirmPasswordState.value}
                icon={faUser}
                onChangeHandler={passwordConfirmationChangeHandler}
                label='Confirm Password'
                placeholder='Type your password again'
                type='password'
                errorMsg={formState.confirmPasswordState.errorMsg}
                onBlur={passwordConfirmationBlurHandler}
                displayError={formState.confirmPasswordState.displayError}
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