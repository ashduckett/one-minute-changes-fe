import { useEffect, useState } from 'react';
import classes from './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCookie, baseUrl } from '../API';
import { appActions } from '../store';

// https://colorlib.com/wp/html5-and-css3-login-forms/

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const user = useSelector((currentState) => {
        return currentState.user;
    });

    // const cookie = useSelector((currentState) => {
    //     return currentState.csrfCookie;
    // });

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    };

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    };

    // On load, load the data and redirect if the user is still logged in and the page has been refreshed
    useEffect(() => {
        // If you've got here with the URL bar then the cookie state will be lost so it may need to be regenerated.
        
        // If the browser has a cookie
        const csrfCookie = getCookie('XSRF_TOKEN');
        
        // If we've hit here, and 
        if (csrfCookie) {

        }

        // if (cookie) {
        //     console.log(cookie)
        // }
        // const csrfCookie = getCookie('XSRF-TOKEN');
        // console.log(csrfCookie);
        // if (user) {
        //     navigate('/', {replace: true});
        // }

    }, [navigate]);


    const submitHandler = (event) => {
        event.preventDefault();

        const submitObj = {
            email: email,
            password: password
        };

        fetch(`${baseUrl}/sanctum/csrf-cookie`, {credentials: 'include'} ).then(() => {
            const XSRF_TOKEN = getCookie('XSRF-TOKEN');

            fetch(`${baseUrl}/api/login`, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(submitObj),
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': XSRF_TOKEN
                }
            }).then(response => {
                return response.json();
            }).then(userData => {
                fetch(`${baseUrl}/api/user/changes`, {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': XSRF_TOKEN           // This is a protected route, but the credentials cookie is there, you just need
                        // to use credentials include
                    }
                }).then((r) => r.json()).then(r => {
                    console.log(XSRF_TOKEN)
                    dispatch(appActions.login({ user: userData, results: r, csrfCookie: XSRF_TOKEN }));
                    navigate('/', { replace: true });
                });
            });
        });
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