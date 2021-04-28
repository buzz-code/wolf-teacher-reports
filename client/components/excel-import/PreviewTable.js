import React from 'react';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

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
