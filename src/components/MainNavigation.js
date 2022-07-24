import classes from './MainNavigation.module.css';
import { deleteCookie } from '../API';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { appActions } from '../store/app-slice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket  } from '@fortawesome/free-solid-svg-icons';

const MainNavigation = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => {
        return state.user;
    });
    
    const onLogout = (e) => {
    
        // Clear out the cookie - This is not happening fast enough to be able to check for one
        // on every load of the login page for automatic logging in. Local storage instead?
        deleteCookie('XSRF-TOKEN');
        dispatch(appActions.logout());

        // Send the user back to login
        navigate('/login', {replace: true});
    };
    console.log(user)

    return (
        user && (
            <nav className={classes.nav}>
                <div className={classes['welcome']}>
                    Welcome {user.first_name}
                </div>
                <button className={classes['logout-button']} onClick={onLogout}><FontAwesomeIcon icon={faRightFromBracket} /></button>
            </nav>
        )
        
    );
};

export default MainNavigation;