import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FilterItem from '../filter-item/FilterItem';

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  inputField: {
    margin: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
  },
}));

const TableFilter = ({ filters, onFilterChange }) => {
  const classes = useStyles();
  const [conditions, setConditions] = useState({});

  const onChange = (filter, index) => {
    setConditions((conditions) => ({ ...conditions, [index]: filter }));
  };

  const onFilterFire = (e) => {
    e.preventDefault();
    onFilterChange(conditions);
  };

  useEffect(() => {
    setConditions({});
  }, [filters]);

  return (
    <Paper className={classes.container}>
      <form onSubmit={onFilterFire}>
        <div>
          {filters.map((item, index) => (
            <FilterItem
              item={item}
              index={index}
              key={index}
              onChange={onChange}
              classes={classes}
            />
          ))}
        </div>

        <input type="submit" style={{ display: 'none' }} />

        <div className={classes.buttonContainer}>
          <div style={{ flex: '1' }}> </div>
          <Button variant="contained" color="primary" onClick={onFilterFire}>
            סנן נתונים
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default TableFilter;
