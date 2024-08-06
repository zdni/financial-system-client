import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
// mui
import { Button, Card, Container, IconButton, Stack, Table, TableBody, TableContainer, Tooltip } from '@mui/material'
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
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
  getDocuments, 
  deleteDocument,
  exportExcelTransaction, 
} from '../../helpers/backend_helper'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// sections
import { 
  ExportTransactionDialog,
  TableRowExport, 
  TableToolbarExport
} from '../../sections/transaction'
// utils
import { isValidToken } from '../../auth/utils'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'label', label: 'Label', align: 'left' },
  { id: 'type', label: 'Tipe', align: 'left' },
  { id: '' },
]

export default function TransactionExportPage() {
  const { themeStretch } = useSettingsContext()

  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
  const { enqueueSnackbar } = useSnackbar()

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
  const [filterName, setFilterName] = useState('')
  const [openExportDialog, setOpenExportDialog] = useState(false)
  
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  })
  
  const isFiltered = filterName !== '';
  const isNotFound = 
    (!dataFiltered.length && !!filterName)
  
  const denseHeight = 56

  const handleOpenExportDialog = () => {
    setOpenExportDialog(true)
  }
  const handleCloseExportDialog = () => setOpenExportDialog(false);

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  }

  const handleResetFilter = () => {
    setFilterName('')
  }

  const handleSubmitDelete = async (id) => {
    if(TOKEN && isValidToken(TOKEN)) {
      const response = await deleteDocument(id, { headers: { authorization: `Bearer ${TOKEN}` } })
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
    });
    setReload(true)
    setSelected([])
  }

  const handleSubmitExport = async (data) => {
    if(TOKEN && isValidToken(TOKEN)) {
      if(data.export_type === 'pdf') {
        // toPDF();
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
        const response = await getDocuments({ headers: { authorization: `Bearer ${TOKEN}` } })
        setTableData(response.data.data);
      }
    }

    if(reload) {
      fetchData();
      setReload(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  return (
    <>
      <Helmet>
        <title> File Export | Cash Draw Simple Recording System</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="File Export"
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
              name: 'File Export',
            },
          ]}
          action={
            <Stack spacing={1} direction={'row'}>
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

        <Card sx={{ mt: 4 }}>
          <TableToolbarExport
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
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
                      tableData.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return <TableRowExport
                        key={row._id}
                        row={row}
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
          />
        </Card>
      </Container>

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
      (data) => data.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    )
  }

  return inputData
}