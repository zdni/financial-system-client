import orderBy from 'lodash/orderBy';
// @mui
import { Box, Stack, Card, CardHeader, Typography } from '@mui/material';
// utils
import { fCurrency } from '../../utils/formatNumber';
// components
import Iconify from '../../components/iconify';
import { CustomAvatar } from '../../components/custom-avatar';

// ----------------------------------------------------------------------

export default function TopAccounts({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ p: 3 }}>
        {orderBy(list, ['value'], ['desc']).slice(0,3).map((account, index) => (
          <AccountItem key={index} account={account} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

function AccountItem({ account }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <CustomAvatar name={account.name} />

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{account.name}</Typography>

        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <Iconify icon="ant-design:dollar-outlined" width={16} sx={{ mr: 0.5 }} />
          {fCurrency(account.value)}
        </Typography>
      </Box>
    </Stack>
  );
}
