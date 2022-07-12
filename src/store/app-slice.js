import { createSlice } from '@reduxjs/toolkit';

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
            state.user = null
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

export default appSlice;