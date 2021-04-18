import React, { createRef, useCallback, useMemo, useState } from 'react';
import MaterialTable from 'material-table';

import CustomizedSnackbar from '../common/snakebar/CustomizedSnackbar';
import * as crudAction from '../../actions/crudAction';
import { useDispatch, useSelector } from 'react-redux';
import { materialTableOptions, materialTableLocalizations } from '../../config/config';
import { exportCsv } from '../../utils/exportsUtil';

const getActions = (tableRef) => [
  {
    icon: 'refresh',
    tooltip: 'רענון נתונים',
    isFreeAction: true,
    onClick: () => tableRef.current && tableRef.current.onQueryChange(),
  },
];

const Table = ({
  entity,
  title,
  columns,
  validateRow,
  manipulateDataToSave,
  disableAdd,
  disableUpdate,
  disableDelete,
}) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector((state) => state[entity]);
  const [validationError, setValidationError] = useState(null);
  const tableRef = createRef();
  const tableTitle = useMemo(() => 'רשימת ' + title, [title]);
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
    if (validateRow) {
      const errorMessage = validateRow(dataToSave);
      setValidationError(errorMessage);
      if (errorMessage) {
        return Promise.reject(errorMessage);
      }
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

  const handleCsvExport = (columns, data) => {
    exportCsv(columns, entity, tableTitle);
  };

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>{title}</h2>

      {error && <CustomizedSnackbar variant="error" message={error} />}
      {validationError && <CustomizedSnackbar variant="error" message={validationError} />}

      <MaterialTable
        title={tableTitle}
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
        options={{ ...materialTableOptions, exportCsv: handleCsvExport }}
        localization={materialTableLocalizations}
      />
    </div>
  );
};

export default Table;
