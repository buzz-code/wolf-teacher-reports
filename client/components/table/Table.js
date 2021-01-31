import React, { useCallback, useEffect, useMemo } from 'react';
import MaterialTable from 'material-table';

import CustomizedSnackbar from '../common/snakebar/CustomizedSnackbar';
import * as crudAction from '../../actions/crudAction';
import { useDispatch, useSelector } from 'react-redux';
import { materialTableOptions, materialTableLocalizations } from '../../config/config';

const Texts = ({ entity, title, columns, manipulateDataToSave }) => {
  const dispatch = useDispatch();
  const { data, error } = useSelector((state) => state[entity]);

  useEffect(() => {
    dispatch(crudAction.fetchAll(entity));
  }, []);

  const getSaveItem = (rowData) => {
    let dataToSave = {
      ...rowData,
      tableData: undefined,
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

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>{title}</h2>

      {error && <CustomizedSnackbar variant="error" message={error} />}

      <MaterialTable
        title={'רשימת ' + title}
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
