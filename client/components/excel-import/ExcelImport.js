import React from 'react';
import XLSX from 'xlsx';
import { Button, Grid, MenuItem, Select } from '@material-ui/core';

import CustomizedSnackbar from '../common/snakebar/CustomizedSnackbar';
import * as crudAction from '../../actions/crudAction';
import { useDispatch, useSelector } from 'react-redux';
import DragDropFile from './DragDropFiles';
import OutTable from './PreviewTable';

const ExcelImport = ({ title, supportedEntities }) => {
  const dispatch = useDispatch();
  const [entityIndex, setEntityIndex] = React.useState(0);
  const [data, setData] = React.useState([]);

  const selectedEntity = supportedEntities[entityIndex];
  const {
    POST: { 'upload-multiple': uploadResult },
  } = useSelector((state) => state[selectedEntity.value]);

  const handleFile = (file) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      /* Update state */
      setData(data.slice(1));
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  const uploadDataToServer = () => {
    const dataToSave = data.map((item) => {
      const value = {};
      selectedEntity.columns.forEach((c, i) => (value[c] = item[i]));
      return value;
    });
    dispatch(
      crudAction.customHttpRequest(selectedEntity.value, 'POST', 'upload-multiple', dataToSave)
    );
  };

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>{title}</h2>

      {uploadResult && (
        <CustomizedSnackbar variant={uploadResult.variant} message={uploadResult.message} />
      )}

      <Grid container>
        <Grid item xs={4}>
          <Select
            value={entityIndex}
            onChange={(e) => setEntityIndex(e.target.value)}
            style={{ width: 'calc(100% - 1rem)' }}
          >
            {supportedEntities.map((item, index) => (
              <MenuItem key={item.value} value={index}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <DragDropFile handleFile={handleFile} />
        </Grid>
        <Grid item xs={4}>
          <Button variant="outlined" color="secondary" onClick={uploadDataToServer}>
            העלאה לשרת
          </Button>
        </Grid>
      </Grid>
      <OutTable data={data} cols={selectedEntity.columns} />
    </div>
  );
};

export default ExcelImport;
