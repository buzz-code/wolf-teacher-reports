import React from 'react';
import Button from '@material-ui/core/Button';

const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  .map((x) => `.${x}`)
  .join(',');

const DragDropFile = ({ handleFile, children }) => {
  const suppress = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFile(files[0]);
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  };

  return (
    <span onDrop={handleDrop} onDragEnter={suppress} onDragOver={suppress}>
      <form className="form-inline">
        <span className="form-group">
          <Button variant="outlined" color="primary" component="label">
            בחר או גרור קובץ אקסל
            <input type="file" accept={SheetJSFT} onChange={handleChange} hidden />
          </Button>
        </span>
      </form>
    </span>
  );
};

export default DragDropFile;
