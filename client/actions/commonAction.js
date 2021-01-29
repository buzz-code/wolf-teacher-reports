import {
  ENTITY_FAILURE,
  ENTITY_CREATE,
  ENTITY_UPDATE,
  ENTITY_FETCH,
  ENTITY_DELETE,
  SELECT_ENTITY_ITEM,
  CLEAR_ENTITY_LIST,
  GET_EDIT_DATA,
} from '../constants/actionType';

export const failure = (entity, error) => {
  return {
    type: ENTITY_FAILURE,
    entity: entity,
    error: error,
  };
};

export const add = (entity, data) => {
  return {
    type: ENTITY_CREATE,
    entity: entity,
    data: data,
  };
};

export const update = (entity, data) => {
  return {
    type: ENTITY_UPDATE,
    entity: entity,
    data: data,
  };
};

export const fetch = (entity, data) => {
  return {
    type: ENTITY_FETCH,
    entity: entity,
    data: data,
  };
};

export const destroy = (entity, id) => {
  return {
    type: ENTITY_DELETE,
    entity: entity,
    id: id,
  };
};

export const selectItem = (entity, data) => {
  return {
    type: SELECT_ENTITY_ITEM,
    entity: entity,
    data: data,
  };
};

export const clearList = (entity) => {
  return {
    type: CLEAR_ENTITY_LIST,
    entity: entity,
  };
};

export const getEditData = (entity, data) => {
  return {
    type: GET_EDIT_DATA,
    entity: entity,
    data: data,
  };
};
