import React from 'react';
import { Typography } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';

import HoldingsTable from './HoldingsTable';

function App() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
      </Typography>
      <HoldingsTable />
    </div>
  );
}

export default App;
