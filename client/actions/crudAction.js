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
        dispatch(commonAction.failure(entity, error.response.data));
        return Promise.Reject();
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
        dispatch(commonAction.failure(entity, error.response.data));
        return Promise.Reject();
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
        dispatch(commonAction.failure(entity, error.response.data));
        return Promise.Reject();
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
        dispatch(commonAction.failure(entity, error.response.data));
        return Promise.Reject();
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
        dispatch(commonAction.failure(entity, error.response.data));
        return Promise.Reject();
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

export const customHttpRequest = (entity, method, url, data, id) => {
  return (dispatch) => {
    return httpService
      .customHttpRequest(entity, method, url, data, id)
      .then((response) => {
        return dispatch(commonAction.customHttpRequest(entity, method, url, response.data));
      })
      .catch((error) => {
        return dispatch(commonAction.failure(entity, error.response.data));
      });
  };
};
