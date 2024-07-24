import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Divider,
  TableBody,
  TableContainer,
} from '@mui/material'
// auth
import { useAuthContext } from '../../auth/useAuthContext'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// components
import Label from '../../components/label/Label'
import Scrollbar from '../../components/scrollbar'
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../components/table'
// sections
import { TableRow, TableToolbar } from '../../sections/order'
import { getOrders } from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'userId.name', label: 'Peminjam', align: 'left' },
  { id: 'documentId.name', label: 'Buku', align: 'left' },
  { id: 'date.start', label: 'Tgl', align: 'left' },
  { id: 'qty', label: 'Jumlah', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
]

// ----------------------------------------------------------------------

export default function OrderList({ userId }) {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'date.start' })

  const [reload, setReload] = useState(true)
  const [tableData, setTableData] = useState([])

  const [filterName, setFilterName] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  })

  const denseHeight = dense ? 56 : 76

  const isFiltered =
    filterStatus !== 'all' ||
    filterName !== ''

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus)

  const getLengthByStatus = (status) =>
    tableData.filter((item) => item.status === status).length
  const getLengthOrderLate = () =>
    tableData.filter((item) => {
      const dueDate = (item.date.return || new Date())
      return ['process', 'done'].includes(item.status) && item.date.end < dueDate
    }).length

  const TABS = [
    { value: 'all', label: 'Semua', color: 'primary', count: tableData.length },
    { value: 'draft', label: 'Diajukan', color: 'secondary', count: getLengthByStatus('draft') },
    { value: 'process', label: 'Dipinjam', color: 'info', count: getLengthByStatus('process') },
    { value: 'late', label: 'Terlambat', color: 'warning', count: getLengthOrderLate() },
    { value: 'done', label: 'Selesai', color: 'success', count: getLengthByStatus('done') },
    { value: 'cancel', label: 'Dibatalkan', color: 'error', count: getLengthByStatus('cancel') },
  ]

  const handleFilterStatus = (event, newValue) => {
    setPage(0)
    setFilterStatus(newValue)
  }

  const handleFilterName = (event) => {
    setPage(0)
    setFilterName(event.target.value)
  }

  const handleResetFilter = () => {
    setFilterName('')
    setFilterStatus('all')
  }

  const handleViewRow = (id) => navigate(PATH_DASHBOARD.order.view(id))

  useEffect(() => {
    async function fetchData() {
      const params = user.role === 'admin' && !userId ? {} : { userId: userId || user._id }
      const response = await getOrders({ params: params, headers: { authorization: `Bearer ${TOKEN}` } })
      if(response.status === 200) {
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
      <Card>
        <Tabs
          value={filterStatus}
          onChange={handleFilterStatus}
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
          filterName={filterName}
          onFilterName={handleFilterName}
          onResetFilter={handleResetFilter}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>

          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                onSort={onSort}
              />

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row._id}
                      row={row}
                      onViewRow={() => handleViewRow(row._id)}
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
    </>
  )
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
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
      (order) =>
        order.userId.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    )
  }

  if (filterStatus === 'late') {
    inputData = inputData.filter((order) => {
      const dueDate = order.date?.return || new Date()
      return ['process', 'done'].includes(order.status) && order.date.end < dueDate
    } )
  } else if (filterStatus !== 'all') {
    inputData = inputData.filter((order) => order.status === filterStatus)
  }

  return inputData
}