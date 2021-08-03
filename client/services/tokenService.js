import {push} from 'connected-react-router';

import {isAuthenticated} from '../../common-modules/client/utils/jwtUtil';

export const verifyToken = () => {
    return dispatch => {
        if (isAuthenticated()) {
            dispatch(push('/dashboard'));
        }
    };
};