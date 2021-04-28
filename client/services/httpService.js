// Import custom utils
import { fetch, store, update, destroy } from '../utils/httpUtil';
import { getPathParam } from '../utils/serializeUtil';

export const fetchEntity = (
  entityName,
  { error, orderBy, orderDirection, page, pageSize, search, totalCount },
  filters
) => {
  const columnOrder = orderBy && orderBy.field;
  return fetch(entityName.toLowerCase(), {
    page,
    pageSize,
    orderBy: columnOrder,
    orderDirection,
    // filters:
    //   filters &&
    //   filters.map(({ column: { field }, operator, value }) => ({ field, operator, value })),
  });
};

export const fetchEntityById = (entityName, dataId) => {
  return fetch(getPathParam(entityName.toLowerCase(), dataId));
};

export const storeEntity = (entityName, data) => {
  return store(entityName.toLowerCase(), data);
};

export const updateEntity = (entityName, data, dataId) => {
  return update(getPathParam(entityName.toLowerCase(), dataId), data);
};

export const destroyEntity = (entityName, dataId) => {
  return destroy(getPathParam(entityName.toLowerCase(), dataId));
};

export const customHttpRequest = (entityName, method, url, data, dataId) => {
  const mapping = { GET: fetch, POST: store, PUT: update, DELETE: destroy };
  return mapping[method](getPathParam(entityName.toLowerCase(), url, dataId), data);
};
