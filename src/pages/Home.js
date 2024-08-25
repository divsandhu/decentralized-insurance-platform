import React from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';

function Home() {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Summary Widgets */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Total Policies</Typography>
            <Typography variant="h4">5</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Active Claims</Typography>
            <Typography variant="h4">2</Typography>
          </Paper>
        </Grid>
        {/* More widgets here */}
      </Grid>
      <Grid container spacing={3} style={{ marginTop: '16px' }}>
        {/* Quick Actions */}
        <Grid item xs={12} sm={6} md={3}>
          <Button variant="contained" color="primary" fullWidth>
            Buy Insurance
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button variant="contained" color="secondary" fullWidth>
            File a Claim
          </Button>
        </Grid>
        {/* More actions here */}
      </Grid>
    </Container>
  );
}

export default Home;
