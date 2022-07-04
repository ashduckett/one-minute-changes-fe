import { createStore } from 'redux';

const reducer = (state = { user: { id: -1 }, results: null, modalOpen: false }, action) => {

    switch(action.type) {
        case 'USER_LOG_IN':
            return {
                user: action.payload.user,
                results: action.payload.results
            };
        case 'MODAL_TOGGLED':
            return {
                ...state,
                modalOpen: !state.modalOpen,
                
            }
        default:
            return state;

    }
    
};

const store = createStore(reducer);

export default store;