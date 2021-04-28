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

export const fetchAll = (entity, query, filters) => {
  return (dispatch) => {
    dispatch(commonAction.loading(entity));
    return httpService
      .fetchEntity(entity, query, filters)
      .then((response) => {
        return dispatch(commonAction.fetch(entity, response.data));
      })
      .catch((error) => {
        dispatch(commonAction.failure(entity, error.response.data));
        return Promise.reject();
      });
  };
};

export const fetchById = (entity, id) => {
  return (dispatch) => {
    dispatch(commonAction.loading(entity));
    return httpService
      .fetchEntityById(entity, id)
      .then((response) => {
        return dispatch(commonAction.selectItem(entity, response.data));
      })
      .catch((error) => {
        dispatch(commonAction.failure(entity, error.response.data));
        return Promise.reject();
      });
  };
};

export const storeItem = (entity, data) => {
  return (dispatch) => {
    dispatch(commonAction.loading(entity));
    return httpService
      .storeEntity(entity, data)
      .then((response) => {
        // return dispatch(fetchAll(entity, data));
      })
      .catch((error) => {
        dispatch(commonAction.failure(entity, error.response.data));
        return Promise.reject();
      });
  };
};

export const updateItem = (entity, data, id) => {
  return (dispatch) => {
    dispatch(commonAction.loading(entity));
    return httpService
      .updateEntity(entity, data, id)
      .then((response) => {
        // return dispatch(fetchAll(entity, data));
      })
      .catch((error) => {
        dispatch(commonAction.failure(entity, error.response.data));
        return Promise.reject();
      });
  };
};

export const destroyItem = (entity, id, data) => {
  return (dispatch) => {
    dispatch(commonAction.loading(entity));
    return httpService
      .destroyEntity(entity, id)
      .then((response) => {
        // return dispatch(fetchAll(entity, data));
      })
      .catch((error) => {
        dispatch(commonAction.failure(entity, error.response.data));
        return Promise.reject();
      });
  };
};

export const submitForm = (entity, data, id) => {
  return (dispatch) => {
    dispatch(commonAction.loading(entity));
    if (id) {
      return dispatch(updateItem(entity, data, id));
    } else {
      return dispatch(storeItem(entity, data));
    }
  };
};

export const customHttpRequest = (entity, method, url, data, id) => {
  return (dispatch) => {
    dispatch(commonAction.loading(entity));
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
