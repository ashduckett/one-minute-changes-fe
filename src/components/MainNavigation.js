import classes from './MainNavigation.module.css';
import { deleteCookie } from '../API';
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
        
        dispatch(appActions.logout());

        // Send the user back to login
        navigate('/login', {replace: true});
    };


    const i = user && <div></div>;
    console.log(user)
    return (
        user && (
            <nav className={classes.nav}>
                <button onClick={onLogout}>Log out</button>
            </nav>
        )
        
    );
};

export default MainNavigation;