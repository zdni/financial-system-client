import { Helmet } from 'react-helmet-async'
// mui
import { Container, Grid } from '@mui/material'
// components
import { useSettingsContext } from '../../components/settings'
import { PieChart, BarChart } from '../../sections/dashboard';

// eslint-disable-next-line no-extend-native
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

// ----------------------------------------------------------------------

export default function DashboardPage() {
  const { themeStretch } = useSettingsContext()

  return (
    <>
      <Helmet>
        <title> Dashboard | Cash Draw Simple filterRecording System</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3} direction='row-reverse'>
          <Grid item sm={12} md={5} lg={4}>
            <Grid container spacing={3} direction='column'>
              <Grid item>
                {/* Pie Chart */}
                <PieChart />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={7} lg={8}>
            {/* Bart chart */}
            <BarChart />
          </Grid>
          <Grid item xs={12} md={4}>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}