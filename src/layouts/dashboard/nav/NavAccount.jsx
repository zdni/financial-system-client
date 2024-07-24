import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------
const VALUE_OF_ROLE = {
  admin: 'Administrator',
  lecture: 'Dosen',
  staff: 'Staf',
  student: 'Mahasiswa'
}

export default function NavAccount() {
  const { user } = useAuthContext();

  return (
    <Link to={PATH_DASHBOARD.user.root} component={RouterLink} underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar src={user?.photoURL} alt={user?.name} name={user?.name} />

        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {VALUE_OF_ROLE[user?.role]}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}
