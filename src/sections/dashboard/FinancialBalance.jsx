// @mui
import { Card, Typography, Stack } from '@mui/material';
// utils
import { fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

export default function FinancialBalance({
  title,
  financial,
  subheader,
  sx,
  ...other
}) {
  const { income, expense, balance } = financial;

  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      <Typography variant="subtitle2" >
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }} gutterBottom>
        {subheader}
      </Typography>

      <Stack spacing={2}>
        <Typography variant="h3">{fCurrency(balance)}</Typography>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Income
          </Typography>
          <Typography variant="body2">{fCurrency(income)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Expense
          </Typography>
          <Typography variant="body2">{fCurrency(expense)}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
