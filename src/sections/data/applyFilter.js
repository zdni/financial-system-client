export default function applyFilter({
  inputData,
  comparator,
  filterName,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index])

  stabilizedThis.sort((a, b) => {
    const data = comparator(a[0], b[0])
    if (data !== 0) return data
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