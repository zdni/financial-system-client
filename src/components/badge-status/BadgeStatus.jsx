// @mui
import { useTheme } from '@mui/material/styles'
//
import { StyledBadgeStatus } from './styles'
// ----------------------------------------------------------------------

export default function BadgeStatus({ size = 'medium', status = 'offline', sx }) {
  const theme = useTheme()

  return <StyledBadgeStatus ownerState={{ status, size }} sx={sx} theme={theme} />
}
