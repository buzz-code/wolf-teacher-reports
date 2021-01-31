import React, { useCallback, useEffect, useMemo } from 'react';
import MaterialTable from 'material-table';

import { TEACHERS } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { useDispatch, useSelector } from 'react-redux';
import { materialTableOptions, materialTableLocalizations } from '../../config/config';

const getColumns = () => [
  { field: 'tz', title: 'תעודת זהות' },
  { field: 'name', title: 'שם' },
];

const Teachers = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state[TEACHERS]);

  useEffect(() => {
    dispatch(crudAction.fetchAll(TEACHERS));
  }, []);

  const columns = useMemo(() => getColumns(), []);

  const getSaveItem = (rowData) => {
    const dataToSave = {
      ...rowData,
      tableData: undefined,
    };
    return dispatch(crudAction.submitForm(TEACHERS, dataToSave, dataToSave.id));
  };
  const onRowAdd = useCallback(getSaveItem);
  const onRowUpdate = useCallback(getSaveItem);
  const onRowDelete = useCallback((rowData) =>
    dispatch(crudAction.destroyItem(TEACHERS, rowData.id))
  );

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>מורות</h2>

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

export default Teachers;
