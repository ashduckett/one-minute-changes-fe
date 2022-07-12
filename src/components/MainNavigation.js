import classes from './MainNavigation.module.css';
import { deleteCookie, getCookie } from '../API';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { appActions } from '../store';

const MainNavigation = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => {
        return state.user;
    });
    
    const onLogout = (e) => {
    
        // Clear out the cookie
        deleteCookie('XSRF-TOKEN');
        console.log('cookie deleted');
        console.log('cookie is ' + getCookie('XSRF-TOKEN'));


        dispatch(appActions.logout());

        // Send the user back to login
        navigate('/login', {replace: true});
    };

    return (
        user && (
            <nav className={classes.nav}>
                <button onClick={onLogout}>Log out</button>
            </nav>
        )
        
    );
};

export default MainNavigation;