import { CsvBuilder } from 'filefy';

import * as httpService from '../services/httpService';

const getExportData = (entity, filters, columns) => {
  return httpService
    .fetchEntity(entity, { page: 0, pageSize: 1000 }, filters)
    .then((response) => response.data)
    .then((response) => response.data)
    .then((data) => {
      const exportData = data.map((rowData) =>
        columns.map((columnDef) => getFieldValue(rowData, columnDef))
      );
      const exportColumns = columns.map((columnDef) => columnDef.title);

      return {
        data: exportData,
        columns: exportColumns,
      };
    });
};

const getFieldValue = (rowData, columnDef, lookup = true) => {
  let value =
    typeof rowData[columnDef.field] !== 'undefined'
      ? rowData[columnDef.field]
      : byString(rowData, columnDef.field);
  if (columnDef.lookup && lookup) {
    value = columnDef.lookup[value];
  }

  return value;
};

export const exportCsv = (columns, entity, filters, title) => {
  getExportData(entity, filters, columns).then(({ data, columns }) => {
    let fileName = title || 'data';

    const builder = new CsvBuilder(fileName + '.csv');
    builder.setDelimeter(',').setColumns(columns).addRows(data).exportFile();
  });
};
