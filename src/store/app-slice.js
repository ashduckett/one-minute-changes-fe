// import { appActions } from './index';
import { createSlice } from '@reduxjs/toolkit';
import { baseUrl, getCookie, requestCookie } from '../API';

const initialState = { 
    user: null, 
    results: null, 
    modalOpen: false,
    csrfCookie: ''
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        login(state, action) {
            console.log(action)
            state.user = action.payload.user;
            state.results = action.payload.results;
            state.csrfCookie = action.payload.csrfCookie;
        },
        logout(state) {
            state.user = null;
            state.results = null;
            
        },
        modalToggled(state) {
            state.modalOpen = !state.modalOpen;
        },
        resultIssued(state, action) {
            state.results = state.results.map(resultRow => {
                return resultRow.map(resultCol => {
                    if (resultCol.chord_change_id === action.payload.chordChangeId && resultCol.user_id === action.payload.userId) {
                        return {
                            ...resultCol,
                            count: action.payload.count
                        }
                    }
                    return resultCol;
                });
            });
        }
    }
});

// Log in method
export const logIn = (submitObj) => {
    return async dispatch => {
        console.log('hit')
        let cookie = null;
        cookie = getCookie('XSRF-TOKEN');
        // If there's no cookie but there is an email and password passed then it has to be a fresh login
        if (submitObj) {
            await requestCookie();
            cookie = getCookie('XSRF-TOKEN');

            const responseJSON = await fetch(`${baseUrl}/api/login`, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(submitObj),
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': cookie
                }
            });
            
            const userData = await responseJSON.json();
            const r = await fetch(`${baseUrl}/api/user/changes`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': cookie
                }
            });
                    
            const finalResponse = await r.json();
            // return {
            //     user: userData,
            //     results: finalResponse,
            // };
            dispatch(appActions.login({ user: userData, results: finalResponse }));
        } else {
            // Without an email and password, it's safe, though still worth checking, that there's already a logged in user and thus a cookie.

            const userResponse = await fetch(`${baseUrl}/api/user`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': cookie
                }
            });
            
            const userResponseJSON = await userResponse.json();
            const guitarChanges = await fetch(`${baseUrl}/api/user/changes`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            const guitarChangesJSON = await guitarChanges.json();

            dispatch(appActions.login({user: userResponseJSON, results: guitarChangesJSON}));

        }
    };
};

export default appSlice;
export const appActions = appSlice.actions;