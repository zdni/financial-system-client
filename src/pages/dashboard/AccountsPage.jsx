import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
// @mui
import {
  Button,
  Card,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material'
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
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
  FormAccountDialog, 
  TableRow, 
  TableToolbar 
} from '../../sections/account'
// utils
import { isValidToken } from '../../auth/utils'
import { 
  createAccount,
  deleteAccount,
  getAccounts, 
  updateAccount,
} from '../../helpers/backend_helper'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Akun', align: 'left' },
  { id: 'account_type', label: 'Tipe', align: 'left' },
  { id: '' },
]

export default function AccountsPage() {
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
  
  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [data, setData] = useState(false)
  const [titleDialog, setTitleDialog] = useState('Tambah')
  
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  })
  
  const isFiltered = filterName !== ''
  const isNotFound = (!dataFiltered.length && !!filterName)
  
  const denseHeight = dense ? 56 : 76

  const handleOpenFormDialog = () => {
    setData(false)
    setTitleDialog('Tambah')
    setOpenFormDialog(true)
  }
  const handleCloseFormDialog = () => setOpenFormDialog(false)

  const handleFilterName = (event) => {
    setPage(0)
    setFilterName(event.target.value)
  }

  const handleResetFilter = () => {
    setFilterName('')
  }

  const handleEditRow = (data) => {
    setTitleDialog('Ubah')
    setData(data)
    setOpenFormDialog(true)
  }

  const handleSubmitCreate = async (data) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await createAccount(data, { headers: { authorization: `Bearer ${TOKEN}` } })
      return { ...response.data, code: response.status}
    }
    return { message: "TOKEN_REQUIRED", status: false }
  }

  const handleSubmitUpdate = async (data) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await updateAccount(data._id, data, { headers: { authorization: `Bearer ${TOKEN}` } })
      return { ...response.data, code: response.status}
    }
    return { message: "TOKEN_REQUIRED", status: false }
  }

  const handleSubmitDelete = async (id) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await deleteAccount(id, { headers: { authorization: `Bearer ${TOKEN}` } })
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

  useEffect(() => {
    async function fetchData() {
      if(TOKEN && isValidToken(TOKEN)) {
        const response = await getAccounts({ headers: { authorization: `Bearer ${TOKEN}` } })
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
        <title>Daftar Akun | Cash Draw Simple Recording System</title>
      </Helmet>
      
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Daftar Akun"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Manajemen',
            },
            {
              name: 'Akun',
            },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenFormDialog}
            >
              Tambah Akun
            </Button>
          }
        />

        <Card>
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

      <FormAccountDialog 
        title={`${titleDialog} Akun`}
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

  return inputData
}