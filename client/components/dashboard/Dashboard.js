import React, { useMemo } from 'react';
import { cyan, pink, purple, orange } from '@material-ui/core/colors';
import { Grid } from '@material-ui/core';
import { ListAlt, People, SupervisedUserCircle } from '@material-ui/icons';

import SummaryBox from './SummaryBox';

const statItems = [
  { id: 'reports', text: 'צפיות', icon: ListAlt, color: pink[600], value: 0 },
  { id: 'students', text: 'תלמידות', icon: People, color: cyan[600], value: 0 },
  { id: 'teachers', text: 'מורות', icon: SupervisedUserCircle, color: purple[600], value: 0 },
];

const Dashboard = ({ stats }) => {
  const dashboardItems = useMemo(
    () => statItems.map((item) => ({ ...item, value: stats[item.id] })),
    [stats]
  );

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>לוח הבקרה</h2>

      <Grid container spacing={4} style={{ marginBottom: '15px' }}>
        {dashboardItems.map((item) => (
          <Grid key={item.id} item lg={3} sm={6} xl={3} xs={12}>
            <SummaryBox
              Icon={item.icon}
              color={item.color}
              title={item.text}
              value={String(item.value)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
