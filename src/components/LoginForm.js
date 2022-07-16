import { logIn } from '../store/app-slice';
import { useEffect, useReducer, useState } from 'react';
import classes from './LoginForm.module.css';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie, deleteCookie } from '../API';
import FormInputField from './UI/FormInputField';

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const initialState = {
    emailState: {
        value: '',
        isValid: false,
        errorMsg: 'Please enter an email address.',
        wasTouched: false,
        displayError: false,
    },
    passwordState: {
        value: '',
        isValid: false,
        errorMsg: 'Please enter a password.',
        wasTouched: false,
        displayError: false
    }
};

const reducer = (state, action) => {
    switch(action.type) {
        case 'EMAIL_BLUR':
            return {
                ...state,
                emailState: {
                    ...state.emailState,
                    wasTouched: true,
                    displayError: !state.emailState.isValid,

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
                emailErrorMessage = ''
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

        case 'PASSWORD_BLUR':
            return {
                ...state,
                passwordState: {
                    ...state.passwordState,
                    wasTouched: true,
                    displayError: !state.passwordState.isValid,
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
        default:
            return state;
    }
};

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formState, formStateDispatch] = useReducer(reducer, initialState);
    const [showInvalidCredentials, setShowInvalidCredentials] = useState(false);

    const emailBlurHandler = (event) => {
        formStateDispatch({ type: 'EMAIL_BLUR' });
    };

    const passwordBlurHandler = (event) => {
        formStateDispatch({ type: 'PASSWORD_BLUR' });
    };

    const emailChangeHandler = (event) => {
        formStateDispatch({ type: 'EMAIL_CHANGE', payload: { value: event.target.value } });
        setShowInvalidCredentials(false);
    };

    const passwordChangeHandler = (event) => {
        formStateDispatch({ type: 'PASSWORD_CHANGE', payload: { value: event.target.value } });
        setShowInvalidCredentials(false);
    };

    const results = useSelector(state => {
        return state.results;
    });



    // On load, load the data and redirect if the user is still logged in and the page has been refreshed
    useEffect(() => {
        const csrfCookie = getCookie('XSRF-TOKEN');

        
        // If the user is logged in or we have results we can use anyway, then just show the dashboard.
        console.log(results)
        if (csrfCookie || results) {
            navigate('/', { replace: true });
        } 
    }, [navigate, dispatch, results]);



    const submitHandler = (event) => {
        event.preventDefault();

        // Still need to deal with invalid credentials and invalid email address.
        // Former is backend validation, latter can be done from here - as well as there obviously but blocking it from here makes sense.
        if (formState.emailState.isValid && formState.passwordState.isValid) {
            const submitObj = {
                email: formState.emailState.value,
                password: formState.passwordState.value
            };

            // Should probably be some kind of check before navigating. Is it bad to navigate from inside a thunk action creator?
            dispatch(logIn(submitObj)).then(response => {
                console.log(response)
                if (response.status_code === '401') {
                    // Bad credentials
                    console.log('bad credentials');
                    setShowInvalidCredentials(true);
                    // For some reason even a bad log in gives you a cookie so remove it if that's the case.
                    deleteCookie('XSRF-TOKEN');
                } else {
                    navigate('/', { replace: true });
                }
            });
        }
    };

    return (
        <form onSubmit={submitHandler} className={classes['login-form']}>
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
                icon={faLock} 
                onChangeHandler={passwordChangeHandler} 
                label='Password' 
                placeholder='Type your password' 
                type='password'
                errorMsg={formState.passwordState.errorMsg}
                onBlur={passwordBlurHandler}
                displayError={formState.passwordState.displayError}
            />

            <div className={`${classes['form-controls']} ${classes['align-right']}`}>
                <div className={classes.split}>
                    <span className={`${showInvalidCredentials ? classes['error-red'] : classes.hidden}`}>Invalid Credentials</span>
                    <a href='#'>Forgotten Password?</a>
                </div>

            </div>
            <div className={classes['form-controls']}>
                <button>Log In</button>
            </div>
            <div className={`${classes['form-controls']} ${classes['align-centre']}`}>
                <Link to='/register'>Or Sign Up Here</Link>
            </div>
        </form>
    );
};

export default LoginForm;