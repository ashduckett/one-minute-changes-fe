import { logIn } from '../store/app-slice';
import { useEffect, useState } from 'react';
import classes from './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie } from '../API';

// https://colorlib.com/wp/html5-and-css3-login-forms/

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    };

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    };

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

        const submitObj = {
            email: email,
            password: password
        };

        // Should probably be some kind of check before navigating. Is it bad to navigate from inside a thunk action creator?
        dispatch(logIn(submitObj));
        navigate('/', { replace: true });
    };

    return (
        <form onSubmit={submitHandler} className={classes['login-form']}>
            <div className={classes['form-controls']}>
                <label htmlFor='email'>Email</label>
                <div className={classes['login-form-input']}>
                    <FontAwesomeIcon icon={faUser} />
                    <input onChange={emailChangeHandler} value={email} type='text' id='email' placeholder='Type your email' />
                </div>
            </div>
            <div className={classes['form-controls']}>
                <label htmlFor='password'>Password</label>
                <div className={classes['login-form-input']}>
                    <FontAwesomeIcon icon={faLock} />
                    <input onChange={passwordChangeHandler} value={password} type='password' id='password' placeholder='Type your password' />
                </div>
            </div>
            <div className={`${classes['form-controls']} ${classes['align-right']}`}>
                <a href='#'>Forgotten Password?</a>
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