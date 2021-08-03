import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import MaterialTable from '@material-table/core';
import { materialTableLocalizations, materialTableOptions } from '../../../common-modules/client/config/config';
import ReportFilter from '../report-filter/ReportFilter';

const ReportEdit = ({ tables, onPreviewClick, reportResults }) => {
  const [columns, setColumns] = useState([]);

  const handleNodeSelect = (e, value) => {
    const [type, field] = value.split('-');
    if (type !== 'C') {
      return false;
    }
    if (columns.find((item) => item.field === field)) {
      setColumns((cols) => cols.filter((item) => item.field !== field));
    } else {
      setColumns((cols) => [
        ...cols,
        { field, type: 'text', operator: 'like', value: '', label: '' },
      ]);
    }
  };

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  const handleRemoveColumn = (field) => handleNodeSelect(null, `C-${field}`);
  const handleFilterChange = (filter, index) =>
    setColumns((cols) =>
      cols.map((item, itemIndex) => (itemIndex !== index ? item : { ...item, ...filter }))
    );

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>עורך הדוחות</h2>

      <Grid container spacing={4} style={{ marginBottom: '15px' }}>
        <Grid item xs={2}>
          <TreeView
            defaultCollapseIcon={<RemoveIcon />}
            defaultExpandIcon={<AddIcon />}
            onNodeSelect={handleNodeSelect}
          >
            {tables && tables.map(renderTree)}
          </TreeView>
        </Grid>
        <Grid item xs={10}>
          <ReportFilter
            columns={columns}
            handleRemoveColumn={handleRemoveColumn}
            handleFilterChange={handleFilterChange}
            onPreviewClick={(e) => {
              e.preventDefault(), onPreviewClick(columns);
            }}
          />
          <div>
            {reportResults && (
              <MaterialTable
                title={'תצוגה מקדימה'}
                data={reportResults.rows}
                columns={reportResults.previewCols}
                options={materialTableOptions}
                localization={materialTableLocalizations}
              />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReportEdit;
