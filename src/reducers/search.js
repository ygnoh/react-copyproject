import * as types from 'action/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    status: 'INIT',
    usernames: []
};

export default function search(state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        case types.SEARCH:
            return update(state, {
                status: { $set: 'WAITING' },
                usernames: { $set: [] }
            });
        case types.SEARCH_SUCCESS:
            return update(state, {
                status: { $set: 'SUCCESS' },
            });
        case types.SEARCH_FAILURE:
            return update(state, {
                status: { $set: 'FAILURE' },
                usernames: { $set: [] }
            });
        default:
            return state;
    }
}