import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async'
// mui
import { Container, Grid } from '@mui/material'
// components
import { useSettingsContext } from '../../components/settings'
import { FinancialBalance, BarChart, TopAccounts } from '../../sections/dashboard';
import { useSnackbar } from '../../components/snackbar'
import { getTransactions } from '../../helpers/backend_helper';
// utils
import { fDate } from '../../utils/formatTime';

// eslint-disable-next-line no-extend-native
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

// ----------------------------------------------------------------------

// filter
const FILTER_OPTIONS = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'this_month', label: 'Bulan Ini' },
  { value: 'one_year', label: '1 Tahun' },
]

export default function DashboardPage() {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { themeStretch } = useSettingsContext()
  const { enqueueSnackbar } = useSnackbar()
  const offset = new Date().getTimezoneOffset()/-60;
  
  const [categories, setCategories] = useState([])
  const [filter, setFilter] = useState('today')
  const [financial, setFinancial] = useState({ income: 0, expense: 0, balance: 0 })
  const [series, setSeries] = useState({ income: [], expense: [] })
  const [subheader, setSubheader] = useState('')
  const [topAccountsExpense, setTopAccountsExpense] = useState([])
  const [topAccountsIncome, setTopAccountsIncome] = useState([])

  const today = new Date();
  today.setHours(offset,0,0);
  const dateOneYearAgo = new Date();
  dateOneYearAgo.setFullYear(dateOneYearAgo.getFullYear() - 1);
  dateOneYearAgo.setHours(offset,0,0)

  const todayString = today.toJSON().slice(0, 10);
  const dateOneYearAgoString = dateOneYearAgo.toJSON().slice(0, 10);

  const setDataDashboard = (response) => {
    const { data, message, status } = response;
    if(status) {
      const incomes = []
      const expenses = []
      const incomeValues = [];
      const expenseValues = [];
      const categories = [];
      let income = 0;
      let expense = 0;

      setTopAccountsIncome(incomes);
      setTopAccountsExpense(expenses);
      setTopAccountsExpense(expenses);

      const transactions = {}
      const incomeAccounts = {}
      const expenseAccounts = {}

      if(data.status) {
        let transactionIndex = 0;
        let incomeAccountIndex = 0;
        let expenseAccountIndex = 0;
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
            if(!(`${account.name}` in incomeAccounts)) {
              incomeAccounts[`${account.name}`] = incomeAccountIndex;
              incomes[incomeAccountIndex] = { name: account.name, value: 0 }
              incomeAccountIndex += 1
            }
            income = income + transaction.debit
            incomes[incomeAccounts[`${account.name}`]]['value'] += transaction.debit
            incomeValues[transactions[index]] = incomeValues[transactions[index]] + transaction.debit
          }
          if(account.account_type === 'expense') {
            if(!(`${account.name}` in expenseAccounts)) {
              expenseAccounts[`${account.name}`] = expenseAccountIndex;
              expenses[expenseAccountIndex] = { name: account.name, value: 0 }
              expenseAccountIndex += 1
            }
            expense = expense + transaction.credit
            expenses[expenseAccounts[`${account.name}`]]['value'] += transaction.credit
            expenseValues[transactions[index]] = expenseValues[transactions[index]] + transaction.credit
          }
        })
        setTopAccountsExpense(expenses);
        setTopAccountsIncome(incomes);
        
        setSeries({ income: incomeValues, expense: expenseValues });
        setCategories(categories)
        setFinancial({ income: income, expense: expense, balance: (income-expense) })
      } else {
        enqueueSnackbar(data.message, { variant: 'error' })
      }
    } else {
      enqueueSnackbar(message, { variant: 'error' })
    }
  }

  const getTransactionsToday = async () => {
    // set sub header
    setSubheader(fDate(todayString));

    // filter start date and end date
    const date = Date.parse(today);

    const response = await getTransactions({ headers: { authorization: `Bearer ${TOKEN}` }, params: { startDate: date, endDate: date } })
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

    const response = await getTransactions({ headers: { authorization: `Bearer ${TOKEN}` }, params: { startDate: startDate, endDate: endDate, sort: 'date' } })
    setDataDashboard(response);
  }

  const getTransactionsOneYear = async () => {
    // set sub header
    setSubheader(`${fDate(dateOneYearAgoString)} sampai ${fDate(today)}`);

    // filter start date and end date
    const endDate = Date.parse(today)
    const startDate = Date.parse(dateOneYearAgo);

    const response = await getTransactions({ headers: { authorization: `Bearer ${TOKEN}` }, params: { startDate: startDate, endDate: endDate, sort: 'date' } })
    setDataDashboard(response);
  }

  useEffect(() => {
    if(['today', 'this_month', 'one_year'].includes(filter)) {
      if(filter === 'today') {
        getTransactionsToday();
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
                {/* Balance */}
                <FinancialBalance
                  financial={financial}
                  title='Kondisi Keuangan'
                  subheader={subheader}
                />
              </Grid>
              <Grid item>
                {/* Top Account Income */}
                <TopAccounts title="Top Akun Income" list={topAccountsIncome} subheader={subheader}/>
              </Grid>
              <Grid item>
                {/* Top Account Expense */}
                <TopAccounts title="Top Akun Expense" list={topAccountsExpense} subheader={subheader}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={7} lg={8}>
            {/* Bart chart */}
            <BarChart 
              subheader={subheader}
              title='Income dan Expense'
              filter={filter}
              setFilter={setFilter}
              filters={FILTER_OPTIONS}
              chart={{
                categories,
                series: [
                  {
                    name: 'Income',
                    data: series.income
                  }, {
                    name: 'Expense',
                    data: series.expense
                  }
                ],
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}