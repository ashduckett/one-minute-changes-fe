import { logIn } from '../store/app-slice';
import { useEffect, useReducer } from 'react';
import classes from './LoginForm.module.css';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie, deleteCookie } from '../API';
import FormInputField from './UI/FormInputField';
import { INVALID_CREDENTIALS, UPDATE_FORM } from '../lib/FormUtils';
import { onInputChange, onFocusOut, validateInput } from '../lib/FormUtils';

const initialState = {
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
    invalidCredentials: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case UPDATE_FORM:
            const { name, value, hasError, error, touched, isFormValid } = action.data;
            return {
                ...state,
                [name]: { ...state[name], value, hasError, error, touched },
                isFormValid,
                invalidCredentials: false
            }
        case INVALID_CREDENTIALS:
            return {
                ...state,
                invalidCredentials: true
            }
        
        default:
            break;
        
    }
    return state;
};

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formState, formStateDispatch] = useReducer(reducer, initialState);

    const results = useSelector(state => {
        return state.results;
    });

    // On load, load the data and redirect if the user is still logged in and the page has been refreshed
    useEffect(() => {
        const csrfCookie = getCookie('XSRF-TOKEN');
        
        // If the user is logged in or we have results we can use anyway, then just show the dashboard.
        if (csrfCookie || results) {
            navigate('/', { replace: true });
        } 
    }, [navigate, dispatch, results]);



    const submitHandler = (event) => {
        event.preventDefault();

        
        let isFormValid = true;

        for (const name in formState) {
            const item = formState[name];
            const { value } = item;
            const { hasError, error } = validateInput(name, value);

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
            const submitObj = {
                email: formState.emailState.value,
                password: formState.passwordState.value
            };

            // Should probably be some kind of check before navigating. Is it bad to navigate from inside a thunk action creator?
            dispatch(logIn(submitObj)).then(response => {
                if (response.status_code === '401') {
                    
                    // Bad credentials
                    formStateDispatch({ type: INVALID_CREDENTIALS });

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
            <div className={`${classes['form-controls']} ${classes['align-right']}`}>
                <div className={classes.split}>
                    <span className={`${formState.invalidCredentials ? classes['error-red'] : classes.hidden}`}>Invalid Credentials</span>
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