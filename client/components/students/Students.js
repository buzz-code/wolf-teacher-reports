import React, { useCallback, useEffect, useMemo } from 'react';
import MaterialTable from 'material-table';

import { STUDENTS } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { useDispatch, useSelector } from 'react-redux';
import { materialTableOptions, materialTableLocalizations } from '../../config/config';

const getColumns = () => [
  { field: 'tz', title: 'תעודת זהות' },
  { field: 'name', title: 'שם' },
  { field: 'phone_number', title: 'מספר טלפון' },
];

const Students = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state[STUDENTS]);

  useEffect(() => {
    dispatch(crudAction.fetchAll(STUDENTS));
  }, []);

  const columns = useMemo(() => getColumns(), []);

  const getSaveItem = (rowData) => {
    const dataToSave = {
      ...rowData,
      tableData: undefined,
    };
    return dispatch(crudAction.submitForm(STUDENTS, dataToSave, dataToSave.id));
  };
  const onRowAdd = useCallback(getSaveItem);
  const onRowUpdate = useCallback(getSaveItem);
  const onRowDelete = useCallback((rowData) =>
    dispatch(crudAction.destroyItem(STUDENTS, rowData.id))
  );

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>תלמידות</h2>

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

export default Students;
