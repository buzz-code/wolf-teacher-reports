import React from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';

const OutTable = ({ data, cols }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: '2rem', minHeight: '500px' }}>
      <Table stickyHeader={true}>
        <TableHead>
          <TableRow>
            {cols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((r, i) => (
            <TableRow key={i}>
              {cols.map((c, j) => (
                <TableCell key={c}>{r[j]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OutTable;
