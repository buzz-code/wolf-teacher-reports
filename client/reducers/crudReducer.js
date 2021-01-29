import {
  ENTITY_FAILURE,
  ENTITY_CREATE,
  ENTITY_UPDATE,
  ENTITY_FETCH,
  SELECT_ENTITY_ITEM,
  ENTITY_DELETE,
  CLEAR_ENTITY_LIST,
  GET_EDIT_DATA,
} from '../constants/actionType';

let initialState = {
  error: null,
  data: null,
  selectedItem: null,
  editData: null,
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
      case ENTITY_FAILURE:
        return {
          ...state,
          error: action.error,
        };

      case ENTITY_CREATE:
        return {
          ...state,
          selectedItem: action.data.data,
        };

      case ENTITY_UPDATE:
        return {
          ...state,
          selectedItem: action.data.data,
        };

      case ENTITY_FETCH:
        return {
          ...state,
          error: null,
          data: action.data.data,
        };

      case ENTITY_DELETE:
        return {
          ...state,
          selectedItem: null,
        };

      case SELECT_ENTITY_ITEM:
        return {
          ...state,
          selectedItem: action.data.data,
        };

      case CLEAR_ENTITY_LIST:
        return {
          ...state,
          data: null,
        };

      case GET_EDIT_DATA:
        return {
          ...state,
          editData: action.data.data,
        };

      default:
        return state;
    }
  };
}
