import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export const getPropsForAutoComplete = (field, list) => ({
  render: (rowData) => <span>{list.find((item) => item.id == rowData[field]).name}</span>,
  editComponent: (props) => (
    <Autocomplete
      size="small"
      options={list}
      getOptionLabel={(option) => option.name || list.find((item) => item.id == props.value).name}
      getOptionSelected={(option, value) => option.id == value}
      value={props.value}
      renderInput={(params) => {
        return <TextField {...params} fullWidth />;
      }}
      onChange={(e, value) => props.onChange(value && value.id)}
    />
  ),
});
