import { createStore } from 'redux';

const reducer = (state = { user: { id: -1 } }, action) => {

    switch(action.type) {
        case 'USER_LOG_IN':
            console.log('login action hit')
            console.log(action)
            return {
                user: action.payload.user,
                results: action.payload.results
            };
        default:
            return state;

    }
    
};

const store = createStore(reducer);

export default store;