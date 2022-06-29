import { useState } from 'react';

import classes from './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


// https://colorlib.com/wp/html5-and-css3-login-forms/


// fontawesome.library.add(faCheckSquare, faCoffee);

const RegisterForm = () => {
    // Let's start with useState and look further into useReducer later
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');



    const onSubmitHandler = (event) => {
        event.preventDefault();
        console.log('submitted');

        // Collect the form information
        const formInput = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            password_confirmation: confirmPassword
        };

        // Submit it
        fetch('http://localhost/api/register', {
            method: 'POST',
            body: JSON.stringify(formInput),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response)
        });

        console.log(formInput);
    };

    const firstNameChangeHandler = (event) => {
        setFirstName(event.target.value);
    };

    const lastNameChangeHandler = (event) => {
        setLastName(event.target.value);
    };

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    };

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    };

    const passwordConfirmationChangeHandler = (event) => {
        setConfirmPassword(event.target.value);
    };


    return (
        <form onSubmit={onSubmitHandler} className={classes['login-form']}>
            <div className={classes['form-controls']}>
                <label htmlFor='firstname'>First Name</label>
                <div className={classes['login-form-input']}>
                    {/* <FontAwesomeIcon icon={faUser} /> */}
                    <input onChange={firstNameChangeHandler} value={firstName} type='text' id='firstname' placeholder='Type your first name' />
                </div>
            </div>
            <div className={classes['form-controls']}>
                <label htmlFor='lasttname'>Last Name</label>
                <div className={classes['login-form-input']}>
                    {/* <FontAwesomeIcon icon={faUser} /> */}
                    <input onChange={lastNameChangeHandler} value={lastName} type='text' id='lastname' placeholder='Type your last name' />
                </div>
            </div>
            <div className={classes['form-controls']}>
                <label htmlFor='email'>Email</label>
                <div className={classes['login-form-input']}>
                    <FontAwesomeIcon icon={faUser} />
                    <input onChange={emailChangeHandler} value={email} type='email' id='email' placeholder='Type your email' />
                </div>
            </div>
            <div className={classes['form-controls']}>
                <label htmlFor='password'>Password</label>
                <div className={classes['login-form-input']}>
                    <FontAwesomeIcon icon={faLock} />
                    <input onChange={passwordChangeHandler} value={password} type='password' id='password' placeholder='Type your password' />
                </div>
            </div>
            <div className={classes['form-controls']}>
                <label htmlFor='confirm-password'>Confirm Password</label>
                <div className={classes['login-form-input']}>
                    <FontAwesomeIcon icon={faLock} />
                    <input onChange={passwordConfirmationChangeHandler} value={confirmPassword}  type='password' id='confirm-password' placeholder='Confirm your password' />
                </div>
            </div>
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