import React, { useMemo } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import { format } from 'date-fns';

import Table from '../../components/table/Table';
import { LESSON_TIMES } from '../../constants/entity';

const getTimeColumn = (field) => ({
  field,
  render: (rowData) => format(new Date(rowData[field]), 'HH:mm'),
  editComponent: (props) => (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
      <TimePicker
        {...props}
        format="HH:mm"
        value={props.value || null}
        onChange={props.onChange}
        clearable
        InputProps={{ style: { fontSize: 13 } }}
        inputProps={{ 'aria-label': `${props.columnDef.title}: press space to edit` }}
      />
    </MuiPickersUtilsProvider>
  ),
});

const getColumns = () => [
  { field: 'name', title: 'שם' },
  { field: 'day_in_week', title: 'ימים בשבוע' },
  { ...getTimeColumn('lesson_start'), title: 'התחלה' },
  { ...getTimeColumn('lesson_end'), title: 'סיום' },
];

const LessonTimesContainer = () => {
  const title = 'זמני שיעור';
  const entity = LESSON_TIMES;
  const columns = useMemo(() => getColumns(), []);

  return <Table entity={entity} title={title} columns={columns} />;
};

export default LessonTimesContainer;
