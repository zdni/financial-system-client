import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
// @mui
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
import ConfirmDialog from '../../components/confirm-dialog'
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
  FormUserDialog, 
  TableRow, 
  TableToolbar 
} from '../../sections/user'
// utils
import { isValidToken } from '../../auth/utils'
import { 
  createUser,
  deleteUser,
  getUsers, 
  resetPasswordUser, 
  updateUser,
} from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Pengguna', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
]

export default function UsersPage() {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  const { themeStretch } = useSettingsContext()
  const { enqueueSnackbar } = useSnackbar()

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

  const [filterName, setFilterName] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  
  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [data, setData] = useState(false)
  const [titleDialog, setTitleDialog] = useState('Tambah')
  
  const [openDialogUserInactive, setOpenDialogUserInactive] = useState(false)
  const [openDialogUserActive, setOpenDialogUserActive] = useState(false)
  
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  })
  
  const isFiltered = filterRole !== 'all' || filterName !== ''
  const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterRole)
  
  const getLengthByRole = (role) => tableData.filter((item) => item.role === role).length
  const TABS = [
    { value: 'all', label: 'Semua', color: 'default', count: tableData.length },
    { value: 'admin', label: 'Admin', color: 'success', count: getLengthByRole('admin') },
    { value: 'staff', label: 'Staf', color: 'info', count: getLengthByRole('staff') },
  ]

  const denseHeight = dense ? 56 : 76

  const handleOpenFormDialog = () => {
    setData(false)
    setTitleDialog('Tambah')
    setOpenFormDialog(true)
  }
  const handleCloseFormDialog = () => setOpenFormDialog(false)

  const handleOpenDialogUserActive = () => setOpenDialogUserActive(true)
  const handleCloseDialogUserActive = () => setOpenDialogUserActive(false)

  const handleOpenDialogUserInactive = () => setOpenDialogUserInactive(true)
  const handleCloseDialogUserInactive = () => setOpenDialogUserInactive(false)

  const handleFilterRole = (event, newValue) => {
    setPage(0)
    setFilterRole(newValue)
  }

  const handleFilterName = (event) => {
    setPage(0)
    setFilterName(event.target.value)
  }

  const handleResetFilter = () => {
    setFilterName('')
    setFilterRole('all')
  }

  const handleEditRow = (data) => {
    setTitleDialog('Ubah')
    setData(data)
    setOpenFormDialog(true)
  }

  const handleSubmitCreate = async (data) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await createUser(data, { headers: { authorization: `Bearer ${TOKEN}` } })
      return { ...response.data, code: response.status}
    }
    return { message: "TOKEN_REQUIRED", status: false }
  }

  const handleSubmitUpdate = async (data) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await updateUser(data._id, data, { headers: { authorization: `Bearer ${TOKEN}` } })
      return { ...response.data, code: response.status}
    }
    return { message: "TOKEN_REQUIRED", status: false }
  }

  const handleActiveRows = (selected) => {
    selected.forEach(async (id) => {
      const response = await handleSubmitUpdate({ _id: id, status: 'active' })
      const { message } = response
      enqueueSnackbar(message)
    });
    setReload(true)
    setSelected([])
  }

  const handleInactiveRows = (selected) => {
    selected.forEach(async (id) => {
      const response = await handleSubmitUpdate({ _id: id, status: 'inactive' })
      const { message } = response
      enqueueSnackbar(message)
    });
    setReload(true)
    setSelected([])
  }

  const handleSubmitResetPwd = async (id) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await resetPasswordUser(id, { headers: { authorization: `Bearer ${TOKEN}` } })
      enqueueSnackbar(response.data.message)
    } else {
      enqueueSnackbar("TOKEN_REQUIRED")
    }
  }

  const handleSubmitDelete = async (id) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await deleteUser(id, { headers: { authorization: `Bearer ${TOKEN}` } })
      enqueueSnackbar(response.data.message)
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

  useEffect(() => {
    async function fetchData() {
      if(TOKEN && isValidToken(TOKEN)) {
        const response = await getUsers({ query: { withAdmin: false }, headers: { authorization: `Bearer ${TOKEN}` } })
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
        <title>Daftar Pengguna | Cash Draw Simple Recording System</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Daftar Pengguna"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Manajemen',
            },
            {
              name: 'Pengguna',
            },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenFormDialog}
            >
              Tambah Pengguna
            </Button>
          }
        />

        <Card>
          <Tabs
            value={filterRole}
            onChange={handleFilterRole}
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
                  <Tooltip title="Nonaktifkan">
                    <IconButton color="primary" onClick={handleOpenDialogUserInactive}>
                      <Iconify icon="eva:person-remove-outline" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Aktifkan">
                    <IconButton color="primary" onClick={handleOpenDialogUserActive}>
                      <Iconify icon="eva:person-done-outline" />
                    </IconButton>
                  </Tooltip>
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
                        onResetPwd={() => handleSubmitResetPwd(row._id)}
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

      <ConfirmDialog
        open={openDialogUserInactive}
        onClose={handleCloseDialogUserInactive}
        title="Nonaktifkan Pengguna"
        content={
          <>
            Apakah Anda yakin ingin menonaktifkan <strong> {selected.length} </strong> pengguna?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleInactiveRows(selected)
              handleCloseDialogUserInactive()
            }}
          >
            Nonaktifkan
          </Button>
        }
      />

      <ConfirmDialog
        open={openDialogUserActive}
        onClose={handleCloseDialogUserActive}
        title="Aktifkan Pengguna"
        content={
          <>
            Apakah Anda yakin ingin mengaktifkan <strong> {selected.length} </strong> pengguna?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleActiveRows(selected)
              handleCloseDialogUserActive()
            }}
          >
            Aktifkan
          </Button>
        }
      />

      <FormUserDialog 
        title={`${titleDialog} Pengguna`}
        open={openFormDialog} 
        onClose={handleCloseFormDialog}
        onSubmitForm={titleDialog === 'Tambah' ? handleSubmitCreate : handleSubmitUpdate}
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
  filterName,
  filterRole,
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

  if (filterRole !== 'all') {
    inputData = inputData.filter((data) => data.role === filterRole)
  }

  return inputData
}