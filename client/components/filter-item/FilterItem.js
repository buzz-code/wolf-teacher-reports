import React, { useRef } from 'react';
import TextField from '@material-ui/core/TextField';

const FilterItem = ({ item, index, onChange, classes }) => {
  const inputRef = useRef();
  const handleChange = () => {
    const filter = {
      field: item.field,
      value: inputRef.current.value,
      operator: item.operator,
    };
    onChange(filter, index);
  };

  return item.type === 'text' || item.type === 'date' ? (
    <TextField
      className={classes.inputField}
      type={item.type}
      label={item.label}
      inputRef={inputRef}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
    />
  ) : null;
};

export default FilterItem;
