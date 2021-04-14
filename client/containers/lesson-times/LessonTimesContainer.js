import React, { useMemo } from 'react';

import Table from '../../components/table/Table';
import { LESSON_TIMES } from '../../constants/entity';

const getColumns = () => [
  { field: 'name', title: 'שם' },
  { field: 'day_in_week', title: 'ימים בשבוע' },
  { field: 'lesson_start', title: 'התחלה', type: 'time' },
  { field: 'lesson_end', title: 'סיום', type: 'time' },
];

const LessonTimesContainer = () => {
  const title = 'זמני שיעור';
  const entity = LESSON_TIMES;
  const columns = useMemo(() => getColumns(), []);

  const manipulateDataToSave = (rowData) => {
    return {
      ...rowData,
      lesson_start:
        rowData.lesson_start &&
        rowData.lesson_start.toLocaleTimeString &&
        rowData.lesson_start.toLocaleTimeString(),
      lesson_end:
        rowData.lesson_end &&
        rowData.lesson_end.toLocaleTimeString &&
        rowData.lesson_end.toLocaleTimeString(),
    };
  };

  return (
    <Table
      entity={entity}
      title={title}
      columns={columns}
      manipulateDataToSave={manipulateDataToSave}
    />
  );
};

export default LessonTimesContainer;
