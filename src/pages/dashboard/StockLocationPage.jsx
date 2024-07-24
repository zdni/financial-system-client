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
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import Scrollbar from '../../components/scrollbar'
import { useSnackbar } from '../../components/snackbar'
import { useSettingsContext } from '../../components/settings'
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from '../../components/table'
// section
import { 
  applyFilter, 
  CustomTableRow, 
  FormDataDialog,
  TableToolbar 
} from '../../sections/data'
// api
import { 
  createLocation, 
  deleteLocation, 
  getLocations, 
  updateLocation,
} from '../../helpers/backend_helper'
import { isValidToken } from '../../auth/utils'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Label', align: 'left' },
  { id: 'action' },
]

// ----------------------------------------------------------------------

export default function StockLocationPage() {
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
  } = useTable({})

  const [reload, setReload] = useState(true)
  const [tableData, setTableData] = useState([])
  const [filterName, setFilterName] = useState('')

  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [data, setData] = useState(false)
  const [titleDialog, setTitleDialog] = useState('Tambah')

  const handleOpenFormDialog = () => {
    setData([])
    setTitleDialog('Tambah')
    setOpenFormDialog(true)
  }
  const handleCloseFormDialog = () => setOpenFormDialog(false)

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  })

  // const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const denseHeight = dense ? 56 : 76

  const isFiltered = filterName !== ''

  const isNotFound = (!dataFiltered.length && !!filterName)

  const handleFilterName = (event) => {
    setPage(0)
    setFilterName(event.target.value)
  }
  const handleResetFilter = () => setFilterName('')

  const handleEditRow = (data) => {
    setTitleDialog('Ubah')
    setData(data)
    setOpenFormDialog(true)
  }

  const handleSubmitCreate = async (data) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await createLocation(data, { headers: { authorization: `Bearer ${TOKEN}` } })
      return { ...response.data, code: response.status}
    }
    return { message: "TOKEN_REQUIRED", status: false }
  }

  const handleSubmitUpdate = async (data) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await updateLocation(data._id, data, { headers: { authorization: `Bearer ${TOKEN}` } })
      return { ...response.data, code: response.status}
    }
    return { message: "TOKEN_REQUIRED", status: false }
  }

  const handleSubmitDelete = async (id) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await deleteLocation(id, { headers: { authorization: `Bearer ${TOKEN}` } })
      return { ...response.data, code: response.status}
    }
    return { message: "TOKEN_REQUIRED", status: false }
  }

  const handleSubmitMultipleDelete = () => {
    selected.forEach(async (id) => {
      const response = await handleSubmitDelete(id)
      const { message } = response
      enqueueSnackbar(message)
    });
    setReload(true)
    setSelected([])
  }

  useEffect(() => {
    async function fetchData() {
      const response = await getLocations({})
      setTableData(response.data.data)
    }
    if(reload) {
      fetchData()
      setReload(false)
    }
  }, [reload])
  
  return (
    <>
      <Helmet>
        <title>Lokasi Penyimpanan | Ruang Baca TI UHO</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Lokasi Penyimpanan"
          links={[
            {
              name: 'Beranda',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Data',
            },
            {
              name: 'Lokasi Penyimpanan',
            },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenFormDialog}
            >
              Tambah Lokasi Penyimpanan
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
                  <Tooltip title="Delete">
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
                      <CustomTableRow
                      row={row}
                        key={row._id}
                        onDeleteRow={() => handleSubmitDelete(row._id)}
                        onEditRow={() => handleEditRow(row)}
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

      <FormDataDialog 
        title={`${titleDialog} Lokasi Penyimpanan`}
        label='Lokasi Penyimpanan'
        open={openFormDialog} 
        onClose={handleCloseFormDialog}
        onSubmitForm={titleDialog === 'Tambah' ? handleSubmitCreate : handleSubmitUpdate}
        data={titleDialog === 'Tambah' ? false : data}
        setReload={setReload}
      />
    </>
  )
}