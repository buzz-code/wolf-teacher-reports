import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import MaterialTable from 'material-table';
import { materialTableLocalizations, materialTableOptions } from '../../config/config';

const ReportEdit = ({ tables, onPreviewClick, reportResults }) => {
  const [columns, setColumns] = useState([]);

  const handleNodeSelect = (e, value) => {
    const [type, id] = value.split('-');
    if (type !== 'C') {
      return false;
    }
    if (columns.includes(id)) {
      setColumns((cols) => cols.filter((item) => item !== id));
    } else {
      setColumns((cols) => [...cols, id]);
    }
  };

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>עורך הדוחות</h2>

      <Grid container spacing={4} style={{ marginBottom: '15px' }}>
        <Grid item xs={3}>
          <TreeView
            defaultCollapseIcon={<RemoveIcon />}
            defaultExpandIcon={<AddIcon />}
            onNodeSelect={handleNodeSelect}
          >
            {tables && tables.map(renderTree)}
          </TreeView>
        </Grid>
        <Grid item xs={3}>
          {columns.map((item) => (
            <div>{item}</div>
          ))}
          <Button onClick={() => onPreviewClick(columns)}>תצוגה מקדימה</Button>
        </Grid>
        <Grid item xs={6}>
          {reportResults && (
            <MaterialTable
              title={'תצוגה מקדימה'}
              data={reportResults.rows}
              columns={reportResults.previewCols}
              options={materialTableOptions}
              localization={materialTableLocalizations}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ReportEdit;
