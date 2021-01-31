import React, { useCallback, useEffect, useMemo } from 'react';
import MaterialTable from 'material-table';

import CustomizedSnackbar from '../common/snakebar/CustomizedSnackbar';
import { TEXTS } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { useDispatch, useSelector } from 'react-redux';
import { materialTableOptions, materialTableLocalizations } from '../../config/config';

const getColumns = () => [
  { field: 'name', title: 'שם' },
  { field: 'description', title: 'תיאור' },
  { field: 'value', title: 'ערך' },
];

const Texts = () => {
  const dispatch = useDispatch();
  const { data, error } = useSelector((state) => state[TEXTS]);

  useEffect(() => {
    dispatch(crudAction.fetchAll(TEXTS));
  }, []);

  const columns = useMemo(() => getColumns(), []);

  const getSaveItem = (rowData) => {
    const dataToSave = {
      ...rowData,
      tableData: undefined,
    };
    return dispatch(crudAction.submitForm(TEXTS, dataToSave, dataToSave.id));
  };
  const onRowAdd = useCallback(getSaveItem);
  const onRowUpdate = useCallback(getSaveItem);
  const onRowDelete = useCallback((rowData) => dispatch(crudAction.destroyItem(TEXTS, rowData.id)));

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>טקסטים</h2>

      {error && <CustomizedSnackbar variant="error" message={error} />}

      <MaterialTable
        title="נתונים"
        columns={columns}
        data={data || []}
        isLoading={!data}
        editable={{ onRowAdd, onRowUpdate, onRowDelete }}
        options={materialTableOptions}
        localization={materialTableLocalizations}
      />
    </div>
  );
};

export default Texts;
