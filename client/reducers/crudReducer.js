import {
  ENTITY_LOADING,
  ENTITY_FAILURE,
  ENTITY_CREATE,
  ENTITY_UPDATE,
  ENTITY_FETCH,
  SELECT_ENTITY_ITEM,
  ENTITY_DELETE,
  CLEAR_ENTITY_LIST,
  CUSTOM_HTTP_REQUEST,
} from '../constants/actionType';

let initialState = {
  error: null,
  isLoading: false,
  data: [],
  selectedItem: null,
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {},
};

/**
 * A reducer takes two arguments, the current state and an action.
 */
export default function (entity) {
  return function (state = initialState, action) {
    if (action.entity !== entity) {
      return state;
    }

    switch (action.type) {
      case ENTITY_LOADING:
        return {
          ...state,
          error: null,
          isLoading: true,
        };

      case ENTITY_FAILURE:
        return {
          ...state,
          error: action.error.error,
          isLoading: false,
        };

      case ENTITY_CREATE:
        return {
          ...state,
          error: null,
          isLoading: false,
          selectedItem: action.data.data,
        };

      case ENTITY_UPDATE:
        return {
          ...state,
          error: null,
          isLoading: false,
          selectedItem: action.data.data,
        };

      case ENTITY_FETCH:
        return {
          ...state,
          error: null,
          isLoading: false,
          data: action.data.data,
        };

      case ENTITY_DELETE:
        return {
          ...state,
          error: null,
          isLoading: false,
          selectedItem: null,
        };

      case SELECT_ENTITY_ITEM:
        return {
          ...state,
          error: null,
          isLoading: false,
          selectedItem: action.data.data,
        };

      case CLEAR_ENTITY_LIST:
        return {
          ...state,
          error: null,
          isLoading: false,
          data: null,
        };

      case CUSTOM_HTTP_REQUEST:
        return {
          ...state,
          error: null,
          isLoading: false,
          [action.method]: {
            [action.url]: action.data.data,
          },
        };

      default:
        return state;
    }
  };
}
