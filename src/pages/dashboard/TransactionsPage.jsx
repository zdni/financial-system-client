import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  TableRow, 
  TableToolbar 
} from '../../sections/transaction'
// utils
import { isValidToken } from '../../auth/utils'
import { fTimestamp } from '../../utils/formatTime'
import { 
  deleteTransaction,
  getTransactions, 
} from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Tanggal', align: 'left' },
  { id: 'name', label: 'Label', align: 'left' },
  { id: 'state', label: 'Status', align: 'left' },
  { id: '' },
]

export default function TransactionsPage() {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { themeStretch } = useSettingsContext()
  const { enqueueSnackbar } = useSnackbar()

  const navigate = useNavigate()

  const {
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
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'name' })

  const [reload, setReload] = useState(true)
  const [tableData, setTableData] = useState([])

  // Filter Data
  const [filterEndDate, setFilterEndDate] = useState(null)
  const [filterName, setFilterName] = useState('')
  const [filterState, setFilterState] = useState('all')
  const [filterStartDate, setFilterStartDate] = useState(null)
  
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterState,
    filterEndDate,
    filterStartDate,
  })
  
  const isFiltered = filterName !== '' || filterState !== 'all' || (!!filterStartDate && !!filterEndDate);
  const isNotFound = 
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterState) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate)
  
  const denseHeight = 56

  const getLengthByState = (state) =>
    tableData.filter((item) => item.state === state).length;

  const TABS = [
    { value: 'all', label: 'Semua', color: 'default', count: tableData.length },
    { value: 'draft', label: 'Draft', color: 'success', count: getLengthByState('draft') },
    { value: 'posted', label: 'Post', color: 'info', count: getLengthByState('posted') },
    { value: 'cancel', label: 'Batal', color: 'warning', count: getLengthByState('cancel') },
  ]

  const handleFilterName = (event, newValue) => {
    setPage(0);
    setFilterName(event.target.value);
  }

  const handleFilterState = (event, newValue) => {
    setPage(0);
    setFilterState(newValue);
  }

  const handleResetFilter = () => {
    setFilterEndDate(null)
    setFilterName('')
    setFilterStartDate(null)
    setFilterState('all')
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
    selected.forEach(async (row) => {
      const {_id, state, name} = row;
      if(state === 'cancel') {
        await handleSubmitDelete(_id)
      } else {
        enqueueSnackbar(`Gagal menghapus transaksi ${name} karena tidak dalam status Draft!`, { variant: 'error' });
      }
    });
    setReload(true)
    setSelected([])
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

      <Container maxWidth={themeStretch ? false : 'xl'}>
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
            </Stack>
            
          }
        />

        <Card>
          <Tabs
            value={filterState}
            onChange={handleFilterState}
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
            filterEndDate={filterEndDate}
            filterName={filterName}
            filterStartDate={filterStartDate}
            onFilterName={handleFilterName}
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
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row)
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
              <Table size='small' sx={{ minWidth: 800 }}>
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
                      tableData.map((row) => row)
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
                        setReload={setReload}
                        onSelectRow={() => onSelectRow(row._id)}
                        selected={selected.includes(row._id)}
                        onDeleteRow={() => handleSubmitDelete(row._id)}
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
          />
        </Card>
      </Container>
    </>
  )
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterEndDate,
  filterName,
  filterStartDate,
  filterState,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index])

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  inputData = stabilizedThis.map((el) => el[0])

  if (filterName) {
    inputData = inputData.filter(
      (data) =>
        data.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    )
  }
  if (filterState !== 'all') {
    inputData = inputData.filter(
      (data) =>
        data.state === filterState
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