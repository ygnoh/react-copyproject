import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    post: {
        status: 'INIT',
        error: -1
    },
    list: {
        status: 'INIT',
        data: [],
        isLast: false
    }
};

export default function memo(state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch(action.type) {
        case types.MEMO_POST:
            return update(state, {
                post: {
                    status: { $set: 'WAITING'},
                    error: { $set: -1 }
                }
            });
        case types.MEMO_POST_SUCCESS:
            return update(state, {
                post: {
                    status: { $set: 'SUCCESS' }
                }
            });
        case types.MEMO_POST_FAILURE:
            return update(state, {
                post: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.MEMO_LIST:
            return update(state, {
                list: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.MEMO_LIST_SUCCESS:
            if (action.isInitial) {
                return update(state, {
                    list: {
                        status: { $set: 'SUCCESS' },
                        data: { $set: action.data },
                        // 한 페이지에 메모는 6개
                        // 따라서 메모가 6개 미만이라면 마지막 페이지가 아니다.
                        isLast: { $set: action.data.length < 6 }
                    }
                });
            }

            return state;
        case types.MEMO_LIST_FAILURE:
            return update(state, {
                list: {
                    status: { $set: 'FAILURE' }
                }
            });
        default:
            return state;
    }
}