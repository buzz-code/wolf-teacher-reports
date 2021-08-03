import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterItem from '../../../common-modules/client/components/filter-item/FilterItem';

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  columnsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  columnWrapper: {
    margin: theme.spacing(1),
  },
  deleteIcon: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  inputField: {},
  buttonContainer: {
    display: 'flex',
  },
}));

const ReportFilter = ({ columns, handleRemoveColumn, handleFilterChange, onPreviewClick }) => {
  const classes = useStyles();

  const onChange = (filter, index) => {
    handleFilterChange(filter, index);
  };

  return (
    <Paper className={classes.container}>
      <form onSubmit={onPreviewClick}>
        <div className={classes.columnsContainer}>
          {columns.map((item, index) => (
            <div key={item.field} className={classes.columnWrapper}>
              <div>
                {item.field}
                <DeleteIcon
                  className={classes.deleteIcon}
                  onClick={() => handleRemoveColumn(item.field)}
                />
              </div>
              <FilterItem item={item} index={index} onChange={onChange} classes={classes} />
            </div>
          ))}
        </div>

        <input type="submit" style={{ display: 'none' }} />

        <div className={classes.buttonContainer}>
          <div style={{ flex: '1' }}> </div>
          <Button variant="contained" color="primary" onClick={onPreviewClick}>
            תצוגה מקדימה
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default ReportFilter;
