import { useEffect, useState } from 'react';
// @mui
import { Card, CardHeader, Box, TextField, Stack } from '@mui/material';
// components
import { CustomSmallSelect } from '../../components/custom-input';
import Chart, { useChart } from '../../components/chart';
import { useSnackbar } from '../../components/snackbar';
// utils
import { fCurrency } from '../../utils/formatNumber';
import { fDate } from '../../utils/formatTime';
import { getTransactionLines } from '../../helpers/backend_helper';
import { DatePicker } from '@mui/x-date-pickers';

// filter
const FILTER_OPTIONS = [
  { value: 'day', label: 'Hari Ini' },
  { value: 'this_month', label: 'Bulan Ini' },
  { value: 'one_year', label: '1 Tahun' },
]

export default function BarChart() {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { enqueueSnackbar } = useSnackbar()
  const offset = new Date().getTimezoneOffset()/-60;
  
  const [categories, setCategories] = useState([])
  const [filter, setFilter] = useState('this_month')
  const [series, setSeries] = useState([
    {
      name: 'Income',
      data: []
    }, {
      name: 'Expense',
      data: []
    }
  ])
  const [subheader, setSubheader] = useState('')
  
  const today = new Date();
  today.setHours(offset,0,0);
  const dateOneYearAgo = new Date();
  dateOneYearAgo.setFullYear(dateOneYearAgo.getFullYear() - 1);
  dateOneYearAgo.setHours(offset,0,0)
  
  const todayString = today.toJSON().slice(0, 10);
  const dateOneYearAgoString = dateOneYearAgo.toJSON().slice(0, 10);
  
  const [day, setDay] = useState(today);

  const setDataDashboard = (response) => {
    const { data, message, status } = response;
    if(status) {
      const incomeValues = [];
      const expenseValues = [];
      const categories = [];
      let income = 0;
      let expense = 0;

      const transactions = {}

      if(data.status) {
        let transactionIndex = 0;
        let index = '';
        
        // eslint-disable-next-line array-callback-return
        data.data.map((transaction) => {
          if(filter === 'one_year') {
            index = `${fDate(transaction.date, 'MMM yyyy')}`
          } else {
            index = `${fDate(transaction.date)}`
          }
          const account = transaction.accountId

          if(!(index in transactions)) {
            transactions[index] = transactionIndex
            categories.push(index)
            incomeValues[transactionIndex] = 0
            expenseValues[transactionIndex] = 0
            transactionIndex += 1
          }
          
          if(account.account_type === 'income') {
            income = income + transaction.debit
            incomeValues[transactions[index]] = incomeValues[transactions[index]] + transaction.debit
          }
          if(account.account_type === 'expense') {
            expense = expense + transaction.credit
            expenseValues[transactions[index]] = expenseValues[transactions[index]] + transaction.credit
          }
        })
        
        setSeries([
          {
            name: 'Income',
            data: incomeValues
          }, {
            name: 'Expense',
            data: expenseValues
          }
        ]);
        setCategories(categories)
      } else {
        enqueueSnackbar(data.message, { variant: 'error' })
      }
    } else {
      enqueueSnackbar(message, { variant: 'error' })
    }
  }

  const getTransactionsDay = async () => {
    // set sub header
    setSubheader(fDate(day.toJSON().slice(0, 10)));

    // filter start date and end date
    const date = Date.parse(day);

    const response = await getTransactionLines({ headers: { authorization: `Bearer ${TOKEN}` }, params: { startDate: date, endDate: date, state: 'posted' } })
    setDataDashboard(response);
  }

  const getTransactionsThisMonth = async () => {
    // set sub header
    setSubheader(`Bulan ${fDate(todayString, 'MMM')}`);
    
    // filter start date and end date
    const endDate = Date.parse(today);

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDay.setHours(offset,0,0);
    const startDate = Date.parse(firstDay);

    const response = await getTransactionLines({ headers: { authorization: `Bearer ${TOKEN}` }, params: { startDate: startDate, endDate: endDate, sort: 'date', state: 'posted' } })
    setDataDashboard(response);
  }

  const getTransactionsOneYear = async () => {
    // set sub header
    setSubheader(`${fDate(dateOneYearAgoString)} sampai ${fDate(today)}`);

    // filter start date and end date
    const endDate = Date.parse(today)
    const startDate = Date.parse(dateOneYearAgo);

    const response = await getTransactionLines({ headers: { authorization: `Bearer ${TOKEN}` }, params: { startDate: startDate, endDate: endDate, sort: 'date', state: 'posted' } })
    setDataDashboard(response);
  }

  useEffect(() => {
    if(filter === 'day') {
      getTransactionsDay();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, day])

  useEffect(() => {
    if(['day', 'this_month', 'one_year'].includes(filter)) {
      if(filter === 'day') {
        // getTransactionsDay();
      } else if(filter === 'this_month') {
        getTransactionsThisMonth();
      } else if(filter === 'one_year') {
        getTransactionsOneYear();
      }
    } else {
      enqueueSnackbar('Pilihan tidak tersedia!', { variant: 'error' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const chartOptions = useChart({
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: 'Rp.'
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return fCurrency(value);
          }
          return value;
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader 
        title='Income dan Expense' 
        subheader={subheader}
        action={
          <Stack spacing={1.5} direction={'column-reverse'}>
            {
              filter === 'day' && <>
                <DatePicker
                  label="Tanggal"
                  value={day}
                  onChange={(newValue) => {
                    const date = new Date(newValue); 
                    const offset = new Date().getTimezoneOffset()/-60;
                    date.setHours(offset,0,0);
                    setDay(date);
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
              </>
            }
            <CustomSmallSelect
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </CustomSmallSelect>
          </Stack>
        }
      />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <Chart 
          type="bar" 
          series={series} 
          options={chartOptions} 
          height={364} 
        />
      </Box>
    </Card>
  );
}