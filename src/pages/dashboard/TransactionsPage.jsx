import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePDF } from 'react-to-pdf';
// mui
import {
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  Tooltip,
} from '@mui/material'
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import Label from '../../components/label/Label'
import Scrollbar from '../../components/scrollbar'
import { useSettingsContext } from '../../components/settings'
import { useSnackbar } from '../../components/snackbar'
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
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// sections
import { 
  ExportTransactionDialog,
  FormTransactionDialog,
  TableRow, 
  TableToolbar 
} from '../../sections/transaction'
// utils
import { isValidToken } from '../../auth/utils'
import { fTimestamp } from '../../utils/formatTime'
import { 
  deleteTransaction,
  exportExcelTransaction,
  getTransactions, 
  updateTransaction,
} from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Tanggal', align: 'left' },
  { id: 'label', label: 'Label', align: 'left' },
  { id: 'vendorId', label: 'Vendor', align: 'left' },
  { id: 'accountId', label: 'Akun', align: 'left' },
  { id: 'income', label: 'Income', align: 'right' },
  { id: 'expense', label: 'Expense', align: 'right' },
  { id: '' },
]

export default function TransactionsPage() {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { themeStretch } = useSettingsContext()
  const { enqueueSnackbar } = useSnackbar()

  const navigate = useNavigate()

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

  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [data, setData] = useState(false)
  
  const handleCloseFormDialog = () => setOpenFormDialog(false)
  
  // Filter Data
  const [filterAccount, setFilterAccount] = useState('')
  const [filterEndDate, setFilterEndDate] = useState(null)
  const [filterStartDate, setFilterStartDate] = useState(null)
  const [filterAccountType, setFilterAccountType] = useState('all')
  const [filterVendor, setFilterVendor] = useState('')
  const [openExportDialog, setOpenExportDialog] = useState(false)
  
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterAccount,
    filterAccountType,
    filterEndDate,
    filterStartDate,
    filterVendor,
  })
  
  const isFiltered = filterAccount !== '' || filterAccountType !== 'all' || filterVendor !== '' || (!!filterStartDate && !!filterEndDate);
  const isNotFound = 
    (!dataFiltered.length && !!filterAccount) ||
    (!dataFiltered.length && !!filterAccountType) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate) ||
    (!dataFiltered.length && !!filterVendor)
  
  const denseHeight = dense ? 56 : 76

  const handleOpenExportDialog = () => {
    setOpenExportDialog(true)
  }
  const handleCloseExportDialog = () => setOpenExportDialog(false);

  const getLengthByAccountType = (type) =>
    tableData.filter((item) => item.accountId.account_type === type).length;

  const TABS = [
    { value: 'all', label: 'Semua', color: 'default', count: tableData.length },
    { value: 'income', label: 'Income', color: 'success', count: getLengthByAccountType('income') },
    { value: 'expense', label: 'Expense', color: 'info', count: getLengthByAccountType('expense') },
  ]

  const handleFilterAccount = (event) => {
    setPage(0)
    setFilterAccount(event.target.value)
  }

  const handleFilterAccountType = (event, newValue) => {
    setPage(0);
    setFilterAccountType(newValue);
  }

  const handleFilterVendor = (event) => {
    setPage(0)
    setFilterVendor(event.target.value)
  }

  const handleResetFilter = () => {
    setFilterAccount('')
  }

  const handleEditRow = (data) => {
    setData(data)
    setOpenFormDialog(true)
  }

  const handleSubmitUpdate = async (data) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await updateTransaction(data._id, data, { headers: { authorization: `Bearer ${TOKEN}` } })
      return { ...response.data, code: response.status}
    }
    return { message: "TOKEN_REQUIRED", status: false }
  }

  const handleSubmitDelete = async (id) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await deleteTransaction(id, { headers: { authorization: `Bearer ${TOKEN}` } })
      enqueueSnackbar(response.data.message)
      setReload(true);
    } else {
      enqueueSnackbar("TOKEN_REQUIRED")
    }
  }

  const handleSubmitMultipleDelete = () => {
    selected.forEach(async (id) => {
      await handleSubmitDelete(id)
    });
    setReload(true)
    setSelected([])
  }

  const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

  const handleSubmitExport = async (data) => {
    if(TOKEN && isValidToken(TOKEN)) {
      if(data.export_type === 'pdf') {
        toPDF();
      } else if(data.export_type === 'excel') {
        const response = await exportExcelTransaction({ headers: { authorization: `Bearer ${TOKEN}` }, params: { startDate: Date.parse(data.start_date), endDate: Date.parse(data.end_date), sort: 'date' }})
        enqueueSnackbar(response.data.message)
      } else {
        enqueueSnackbar("Aksi tidak tersedia!", { variant: "error" });
      }
      return { status: true }
    } else {
      enqueueSnackbar("TOKEN_REQUIRED", { variant: "error" });
    }
  }

  useEffect(() => {
    async function fetchData() {
      if(TOKEN && isValidToken(TOKEN)) {
        const response = await getTransactions({ headers: { authorization: `Bearer ${TOKEN}` }, params: { sort: '-date' } })
        setTableData(response.data.data)
      }
    }
    if(reload) {
      fetchData()
      setReload(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  return (
    <>
      <Helmet>
        <title> Daftar Transaksi | Cash Draw Simple Recording System</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'} ref={targetRef}>
        <CustomBreadcrumbs
          heading="Daftar Transaksi"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Transaksi',
            },
          ]}
          action={
            <Stack spacing={1} direction={'row'}>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => navigate(`${PATH_DASHBOARD.transaction.form}`)}
              >
                Tambah Transaksi
              </Button>
              <Button
                variant="contained"
                color='success'
                startIcon={<Iconify icon="lets-icons:export-duotone-line" />}
                onClick={handleOpenExportDialog}
              >
                Export
              </Button>
            </Stack>
            
          }
        />

        <Card>
          <Tabs
            value={filterAccountType}
            onChange={handleFilterAccountType}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={
                  <Label color={tab.color} sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <Divider />
          
          <TableToolbar
            isFiltered={isFiltered}
            filterAccount={filterAccount}
            filterEndDate={filterEndDate}
            filterStartDate={filterStartDate}
            filterVendor={filterVendor}
            onFilterAccount={handleFilterAccount}
            onFilterVendor={handleFilterVendor}
            onFilterEndDate={(newValue) => {
              const date = new Date(newValue); 
              const offset = new Date().getTimezoneOffset()/-60;
              date.setHours(offset,0,0);
              setFilterEndDate(date);
            }}
            onFilterStartDate={(newValue) => {
              const date = new Date(newValue); 
              const offset = new Date().getTimezoneOffset()/-60;
              date.setHours(offset,0,0);
                
              setFilterStartDate(date);
              console.log(fTimestamp(date));
            }}
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
                    .map((row) => (
                      <TableRow
                        key={row._id}
                        row={row}
                        onEditRow={() => handleEditRow(row)}
                        onDeleteRow={() => handleSubmitDelete(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        selected={selected.includes(row._id)}
                        setReload={setReload}
                      />
                    ))}

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
      </Container>

      <FormTransactionDialog 
        title={'Ubah Transaksi'}
        open={openFormDialog} 
        onClose={handleCloseFormDialog}
        onSubmitForm={handleSubmitUpdate}
        data={data}
        setReload={setReload}
      />

      <ExportTransactionDialog 
        open={openExportDialog} 
        onClose={handleCloseExportDialog}
        onSubmitForm={handleSubmitExport}
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
  filterAccountType,
  filterEndDate,
  filterStartDate,
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
      (data) =>
        data.accountId.name.toLowerCase().indexOf(filterAccount.toLowerCase()) !== -1
    )
  }
  if (filterAccountType !== 'all') {
    inputData = inputData.filter(
      (data) =>
        data.accountId.account_type === filterAccountType
    )
  }
  if (filterVendor) {
    inputData = inputData.filter(
      (data) => {
        if(data.vendorId) {
          return data.vendorId.name.toLowerCase().indexOf(filterVendor.toLowerCase()) !== -1
        }
        return false
      }
    )
  }

  if (filterStartDate && filterEndDate) {
    inputData = inputData.filter(
      (invoice) =>
        fTimestamp(invoice.date) >= fTimestamp(filterStartDate) &&
        fTimestamp(invoice.date) <= fTimestamp(filterEndDate)
    );
  }

  return inputData
}