/**
 * Import all commonAction as an object.
 */
import * as commonAction from './commonAction';

/**
 * Import all httpService as an object.
 */
import * as httpService from '../services/httpService';

/**
 * CRUD actions for the application.
 * Every time an action that requires the API is called, it first dispatch an "apiRequest" action.
 *
 * entity = 'Product', 'Employee', ...
 */

export const fetchAll = (entity, query) => {
  return (dispatch) => {
    return httpService
      .fetchEntity(entity, query)
      .then((response) => {
        return dispatch(commonAction.fetch(entity, response.data));
      })
      .catch((error) => {
        return dispatch(commonAction.failure(entity, error.response.data));
      });
  };
};

export const fetchById = (entity, id) => {
  return (dispatch) => {
    return httpService
      .fetchEntityById(entity, id)
      .then((response) => {
        return dispatch(commonAction.selectItem(entity, response.data));
      })
      .catch((error) => {
        return dispatch(commonAction.failure(entity, error.response.data));
      });
  };
};

export const storeItem = (entity, data) => {
  return (dispatch) => {
    return httpService
      .storeEntity(entity, data)
      .then((response) => {
        // return dispatch(fetchAll(entity, data));
      })
      .catch((error) => {
        return dispatch(commonAction.failure(entity, error.response.data));
      });
  };
};

export const updateItem = (entity, data, id) => {
  return (dispatch) => {
    return httpService
      .updateEntity(entity, data, id)
      .then((response) => {
        // return dispatch(fetchAll(entity, data));
      })
      .catch((error) => {
        return dispatch(commonAction.failure(entity, error.response.data));
      });
  };
};

export const destroyItem = (entity, id, data) => {
  return (dispatch) => {
    return httpService
      .destroyEntity(entity, id)
      .then((response) => {
        // return dispatch(fetchAll(entity, data));
      })
      .catch((error) => {
        return dispatch(commonAction.failure(entity, error.response.data));
      });
  };
};

export const submitForm = (entity, data, id) => {
  return (dispatch) => {
    if (id) {
      return dispatch(updateItem(entity, data, id));
    } else {
      return dispatch(storeItem(entity, data));
    }
  };
};

export const getEditData = (entity) => {
  return (dispatch) => {
    return httpService
      .getEditData(entity)
      .then((response) => {
        return dispatch(commonAction.getEditData(entity, response.data));
      })
      .catch((error) => {
        return dispatch(commonAction.failure(entity, error.response.data));
      });
  };
};
