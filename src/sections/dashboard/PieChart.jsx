import { useEffect, useState } from 'react';
// @mui
import { Card, CardHeader, Stack, TextField, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// components
import Chart, { useChart } from '../../components/chart';
import { useSnackbar } from '../../components/snackbar';
// utils
import { fCurrency } from '../../utils/formatNumber';
import { fDate } from '../../utils/formatTime';
import { getTransactionLines } from '../../helpers/backend_helper';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT,
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));


export default function PieChart() {
  const theme = useTheme();
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()
  const offset = new Date().getTimezoneOffset()/-60;

  const today = new Date();
  today.setHours(offset,0,0);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [subheader, setSubheader] = useState('')
  const [margin, setMargin] = useState(0);
  const [series, setSeries] = useState([
    { label: 'Income', value: 0 },
    { label: 'Expense', value: 0 },
  ]);
  const colors = [
    theme.palette.primary.main,
    theme.palette.warning.main,
  ];

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series.map((i) => `${i.label}: ${fCurrency(i.value)}`),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fCurrency(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });

  useEffect(() => {
    setSubheader(`${fDate(startDate)} sampai ${fDate(endDate)}`);
    async function fetchData() {

      const endDateParse = Date.parse(endDate)
      const startDateParse = Date.parse(startDate);
  
      const response = await getTransactionLines({ headers: { authorization: `Bearer ${TOKEN}` }, params: { startDate: startDateParse, endDate: endDateParse, sort: 'date' } })
      const { data, message, status } = response;
      if(status) {
        let income = 0;
        let expense = 0;
  
        if(data.status) {
          
          // eslint-disable-next-line array-callback-return
          data.data.map((transaction) => {
            const account = transaction.accountId
  
            if(account.account_type === 'income') {
              income = income + transaction.debit
            }
            if(account.account_type === 'expense') {
              expense = expense + transaction.credit
            }
          })
          setMargin(income - expense);
          setSeries([
            { label: 'Income', value: income },
            { label: 'Expense', value: expense },
          ]);
        } else {
          enqueueSnackbar(data.message, { variant: 'error' })
        }
      } else {
        enqueueSnackbar(message, { variant: 'error' })
      }
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  return (
    <Card>
      <CardHeader 
        title='Margin' 
        subheader={
          <Stack sx={{ mt: 2 }}>
            <Typography variant='subtitle2'>
              {fCurrency(margin)}
            </Typography>
            <Typography variant='caption'>
              {subheader}
            </Typography>
          </Stack>
        } 
        action={
          <Stack spacing={1.5}>
            <DatePicker
              label="Tanggal Awal"
              value={startDate}
              onChange={(newValue) => {
                const date = new Date(newValue); 
                date.setHours(offset,0,0);
                setStartDate(date);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{
                    maxWidth: { md: 160 },
                  }}
                />
              )}
            />
            <DatePicker
              label="Tanggal Akhir"
              value={endDate}
              onChange={(newValue) => {
                const date = new Date(newValue); 
                date.setHours(offset,0,0);
                setEndDate(date);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{
                    maxWidth: { md: 160 },
                  }}
                />
              )}
            />
          </Stack>
        }
      />

      <StyledChart dir="ltr">
        <Chart type="pie" series={chartSeries} options={chartOptions} height={280} />
      </StyledChart>
    </Card>
  );
}