import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
// mui
import { Button, Card, Container, Grid, IconButton, Stack, Table, TableBody, TableContainer, Tooltip, Typography } from '@mui/material'
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import Label from '../../components/label/Label'
import Scrollbar from '../../components/scrollbar'
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table'
import { useSettingsContext } from '../../components/settings'
import { useSnackbar } from '../../components/snackbar'
// api
import { 
  getTransaction, 
  updateTransaction,
  getTransactionLines,
  updateTransactionLine, 
  deleteTransactionLine, 
} from '../../helpers/backend_helper'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// sections
import { 
  FormTransactionDialog,
  TableRowDetail, 
  TableToolbarDetail
} from '../../sections/transaction'
// utils
import { isValidToken } from '../../auth/utils'
import { fCurrency } from '../../utils/formatNumber'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'label', label: 'Label', align: 'left' },
  { id: 'account', label: 'Akun', align: 'left' },
  { id: 'vendor', label: 'Vendor', align: 'left' },
  { id: 'income', label: 'Income', align: 'right' },
  { id: 'expense', label: 'Expense', align: 'right' },
  { id: '' },
]

const OPTION_STATE = {
  'draft': 'Draft',
  'posted': 'Post',
  'cancel': 'Batal'
}

export default function TransactionDetailPage() {
  const { themeStretch } = useSettingsContext()

  const { id } = useParams()
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
  const { enqueueSnackbar } = useSnackbar()

  const [transaction, setTransaction] = useState({});

  const [data, setData] = useState(false)
  const [financial, setFinancial] = useState({ income: 0, expense: 0, margin: 0 });

  const [openFormDialog, setOpenFormDialog] = useState(false)
  const handleCloseFormDialog = () => setOpenFormDialog(false)

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'name' })

  const [reload, setReload] = useState(true)
  const [tableData, setTableData] = useState([])

  // Filter Data
  const [filterAccount, setFilterAccount] = useState('')
  const [filterVendor, setFilterVendor] = useState('')
  
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterAccount,
    filterVendor,
  })
  
  const isFiltered = filterAccount !== '' || filterVendor !== '';
  const isNotFound = 
    (!dataFiltered.length && !!filterAccount) ||
    (!dataFiltered.length && !!filterVendor)
  
  const denseHeight = dense ? 56 : 76

  const handleFilterAccount = (event) => {
    setPage(0);
    setFilterAccount(event.target.value);
  }

  const handleFilterVendor = (event) => {
    setPage(0);
    setFilterVendor(event.target.value);
  }

  const handleResetFilter = () => {
    setFilterAccount('')
    setFilterVendor('')
  }

  const handleSubmitDelete = async (id) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await deleteTransactionLine(id, { headers: { authorization: `Bearer ${TOKEN}` } })
      enqueueSnackbar(response.data.message)
      setReload(true);
    } else {
      enqueueSnackbar("TOKEN_REQUIRED")
    }
  }

  const handleSubmitMultipleDelete = () => {
    selected.forEach(async (row) => {
      const {_id} = row;
      await handleSubmitDelete(_id)
      if(transaction.state === 'cancel') {
      } else {
        enqueueSnackbar(`Gagal menghapus transaksi ${transaction.name} karena tidak dalam status Draft!`, { variant: 'error' });
      }
    });
    setReload(true)
    setSelected([])
  }

  const updateState = async (state) => {
    if(transaction) {
      let options = {};

      const response = await updateTransaction(transaction._id, {
        ...transaction,
        state: state,
      }, { headers: { authorization: `Bearer ${TOKEN}` } })
      const { message, status } = response.data;
      if(!status) {
        options = { variant: 'error' }
      } else {
        setTransaction((currentTransaction) => ({
          ...currentTransaction,
          state: state
        }));
      }
      enqueueSnackbar(message, options)
    } else {
      enqueueSnackbar('ID Transaksi tidak ditemukan!', { variant: 'error' })
    }
  }

  const handleEditRow = (data) => {
    setData(data)
    setOpenFormDialog(true)
  }

  const handleSubmitUpdate = async (data) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await updateTransactionLine(data._id, data, { headers: { authorization: `Bearer ${TOKEN}` } })
      return { ...response.data, code: response.status}
    }
    return { message: "TOKEN_REQUIRED", status: false }
  }

  useEffect(() => {
    async function fetchData() {
      let options = {};
      let message = '';

      const response = await getTransaction(id, { headers: { authorization: `Bearer ${TOKEN}` } })
      const { data, status } = response.data;
      
      if(status) {
        setTransaction(data);
        
        const transactions = await getTransactionLines({ headers: { authorization: `Bearer ${TOKEN}` } });
        
        if(transactions.data.status) {
          setTableData(transactions.data.data);
        } else {
          message = transactions.data.message;
          options = { variant: 'error' }
        }
      } else {
        message = response.data.message;
        options = { variant: 'error' }
      }

      if(message !== '') {
        enqueueSnackbar(message, options)
      }
    }

    if(reload || id) {
      fetchData();
      setReload(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reload])

  return (
    <>
      <Helmet>
        <title> Detail Transaksi | Cash Draw Simple Recording System</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Detail Transaksi"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Transaksi',
              href: PATH_DASHBOARD.transaction.root
            },
            {
              name: transaction?.name,
            },
          ]}
        />

        <Grid container justifyContent={'space-between'}>
          <Stack flex={1} spacing={1} direction={'row'}>
            {
              transaction?.state === 'cancel' &&
              <Button
                variant="outlined"
                color='success'
                size='small'
                onClick={() => updateState('draft')}
              >
                Draft
              </Button>
            }
            {
              transaction?.state === 'draft' &&
              <Button
                variant="outlined"
                color='info'
                size='small'
                onClick={() => updateState('posted')}
              >
                Post
              </Button>
            }
            {
              transaction?.state === 'posted' &&
              <Button
                variant="outlined"
                color='error'
                size='small'
                onClick={() => updateState('cancel')}
              >
                Batal
              </Button>
            }
          </Stack>
          <Label
            color='default'
            variant="soft"
          >
            {OPTION_STATE[transaction?.state]}
          </Label>
        </Grid>
        <Card sx={{ mt: 4 }}>
          <TableToolbarDetail
            isFiltered={isFiltered}
            filterAccount={filterAccount}
            onFilterAccount={handleFilterAccount}
            filterVendor={filterVendor}
            onFilterVendor={handleFilterVendor}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Hapus">
                    <IconButton color="primary" onClick={handleSubmitMultipleDelete}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return <TableRowDetail
                        key={row._id}
                        row={row}
                        onEditRow={() => handleEditRow(row)}
                        onDeleteRow={() => handleSubmitDelete(row._id)}
                        setReload={setReload}
                        onSelectRow={() => onSelectRow(row._id)}
                        selected={selected.includes(row._id)}
                      />
                    })}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>

        <Card sx={{ mt: 4, p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h3">{fCurrency(financial.income - financial.expense)}</Typography>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Income
              </Typography>
              <Typography variant="body2">{fCurrency(financial.income)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Expense
              </Typography>
              <Typography variant="body2">{fCurrency(financial.expense)}</Typography>
            </Stack>
          </Stack>
        </Card>
      </Container>

      <FormTransactionDialog 
        title='Ubah Transaksi'
        open={openFormDialog} 
        onClose={handleCloseFormDialog}
        onSubmitForm={handleSubmitUpdate}
        data={data}
        setReload={setReload}
      />
    </>
  )
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterAccount,
  filterVendor,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index])

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  inputData = stabilizedThis.map((el) => el[0])

  if (filterAccount) {
    inputData = inputData.filter(
      (data) => {

        if(data.accountId) {
          return data.accountId.name.toLowerCase().indexOf(filterAccount.toLowerCase()) !== -1
        }
        return false;
      }
    )
  }

  if (filterVendor) {
    inputData = inputData.filter(
      (data) => {
        if(data.vendorId) {
          return data.vendorId.name.toLowerCase().indexOf(filterVendor.toLowerCase()) !== -1
        }
        return false;
      }
    )
  }

  return inputData
}