// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { CustomSmallSelect } from '../../components/custom-input';
import Chart, { useChart } from '../../components/chart';
import { fCurrency } from '../../utils/formatNumber';

export default function BarChart({ subheader, title, chart, filter, setFilter, filters, ...other }) {
  const { categories, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: 'Rp.'
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return fCurrency(value);
          }
          return value;
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader 
        title={title} 
        subheader={subheader}
        action={
          <CustomSmallSelect
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            {filters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CustomSmallSelect>
        }
      />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <Chart type="bar" series={series} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}