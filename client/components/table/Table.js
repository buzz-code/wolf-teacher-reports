import React, { createRef, useCallback, useMemo } from 'react';
import MaterialTable from 'material-table';

import CustomizedSnackbar from '../common/snakebar/CustomizedSnackbar';
import * as crudAction from '../../actions/crudAction';
import { useDispatch, useSelector } from 'react-redux';
import { materialTableOptions, materialTableLocalizations } from '../../config/config';

const getActions = (tableRef) => [
  {
    icon: 'refresh',
    tooltip: 'Refresh Data',
    isFreeAction: true,
    onClick: () => tableRef.current && tableRef.current.onQueryChange(),
  },
];

const Table = ({
  entity,
  title,
  columns,
  manipulateDataToSave,
  disableAdd,
  disableUpdate,
  disableDelete,
}) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector((state) => state[entity]);
  const tableRef = createRef();

  const actions = useMemo(() => getActions(tableRef), [tableRef]);

  const getSaveItem = (rowData) => {
    let dataToSave = {
      ...rowData,
      tableData: undefined,
      created_at: undefined,
      updated_at: undefined,
    };
    if (manipulateDataToSave) {
      dataToSave = manipulateDataToSave(dataToSave);
    }
    return dispatch(crudAction.submitForm(entity, dataToSave, dataToSave.id));
  };
  const onRowAdd = useCallback(getSaveItem);
  const onRowUpdate = useCallback(getSaveItem);
  const onRowDelete = useCallback((rowData) =>
    dispatch(crudAction.destroyItem(entity, rowData.id))
  );

  const getData = (query) => {
    return dispatch(crudAction.fetchAll(entity, query))
      .then((res) => res.data)
      .then((result) => {
        return {
          data: result.data,
          page: result.page,
          totalCount: result.total,
        };
      });
  };

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>{title}</h2>

      {error && <CustomizedSnackbar variant="error" message={error} />}

      <MaterialTable
        title={'רשימת ' + title}
        tableRef={tableRef}
        columns={columns}
        actions={actions}
        data={getData}
        isLoading={!data}
        editable={{
          onRowAdd: disableAdd ? null : onRowAdd,
          onRowUpdate: disableUpdate ? null : onRowUpdate,
          onRowDelete: disableDelete ? null : onRowDelete,
        }}
        options={materialTableOptions}
        localization={materialTableLocalizations}
      />
    </div>
  );
};

export default Table;
