import { useEffect, useState } from 'react';
import classes from './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logIn } from '../API';
import { appActions } from '../store';

// https://colorlib.com/wp/html5-and-css3-login-forms/

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // const user = useSelector((currentState) => {
    //     return currentState.user;
    // });

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    };

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    };

    // On load, load the data and redirect if the user is still logged in and the page has been refreshed
    useEffect(() => {
        // logIn().then(res => {
        //     // dispatch(appActions.login({ user: res.user, results: res.results }));
        //     // navigate('/', { replace: true });

        // });
    }, [navigate, dispatch]);


    const submitHandler = (event) => {
        event.preventDefault();

        const submitObj = {
            email: email,
            password: password
        };

        logIn(submitObj).then(res => {
            dispatch(appActions.login({ user: res.user, results: res.results }));
            navigate('/', { replace: true });
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