import { useState } from 'react';
import classes from './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// https://colorlib.com/wp/html5-and-css3-login-forms/


// fontawesome.library.add(faCheckSquare, faCoffee);

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const user = useSelector((currentState) => {
        return currentState.user;
    });

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    };

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    };


    const submitHandler = (event) => {
        event.preventDefault();

        const submitObj = {
            email: email,
            password: password
        };




        fetch('http://localhost/sanctum/csrf-cookie', {
            credentials: 'include'

        }).then(r => {
            const XSRF_TOKEN = getCookie('XSRF-TOKEN');

            fetch('http://localhost/api/login', {
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
                
                if (user) {
                    // redirect
                    navigate('/', { replace: true });
                }
                
                fetch('http://localhost/api/user/changes', {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': XSRF_TOKEN
                    }
                }).then((r) => {
                    return r.json();
                }).then(r => {
                    console.log(r);
                    dispatch({ type: 'USER_LOG_IN', payload: {user: userData, results: r }}   );
                });
    
    
    
            });
        });

        // });
        //     credentials: 'include'
        // }).then(response => {
        //     

      

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