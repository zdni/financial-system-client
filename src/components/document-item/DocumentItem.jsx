import { Link as RouterLink } from 'react-router-dom'
// @mui
import { alpha, styled } from '@mui/material/styles'
import { Box, Card, Avatar, CardContent, Stack, Link } from '@mui/material'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// hooks
import useResponsive from '../../hooks/useResponsive'
// components
import Image from '../image'
import Iconify from '../iconify'
import TextMaxLine from '../text-max-line'
import SvgColor from '../svg-color'

// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}))

// ----------------------------------------------------------------------

export default function DocumentItem({ document, index }) {
  const isDesktop = useResponsive('up', 'md')

  const { author, cover, coverUrl } = document

  const latestPost = index === 0 || index === 1 || index === 2

  if (isDesktop && latestPost) {
    return (
      <Card>
        <Avatar
          alt={author}
          src={`http://139.59.108.29:4901/uploads/users/avatar.jpg`}
          sx={{
            top: 24,
            left: 24,
            zIndex: 9,
            position: 'absolute',
          }}
        />

        <DocumentContent
          document={document}
          index={index}
        />

        <StyledOverlay />

        <Image alt="cover" src={`${coverUrl}`} sx={{ height: 360 }} />
      </Card>
    )
  }

  return (
    <Card sx={{ m: 0.8 }}>
      <Box sx={{ position: 'relative' }}>
        <SvgColor
          src="/assets/shape_avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Avatar
          alt={author}
          src={`http://139.59.108.29:4901/uploads/users/avatar.jpg`}
          sx={{
            left: 24,
            zIndex: 9,
            width: 32,
            height: 32,
            bottom: -16,
            position: 'absolute',
          }}
        />

        <Image alt="cover" src={`${coverUrl}`} ratio="4/3" />
      </Box>

      <DocumentContent
        document={document}
      />
    </Card>
  )
}

// ----------------------------------------------------------------------

export function DocumentContent({ document, index }) {
  const { accessed, author, title, year } = document

  const isDesktop = useResponsive('up', 'md')

  const linkTo = `${PATH_DASHBOARD.document.root}/${document._id}`

  const latestPostLarge = index === 0

  const latestPostSmall = index === 1 || index === 2

  const POST_INFO = [
    { number: accessed, icon: 'eva:eye-fill' },
    { number: year, icon: 'eva:calendar-fill' },
  ]

  return (
    <CardContent
      sx={{
        pt: 4.5,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }),
      }}
    >
      <TextMaxLine
        gutterBottom
        variant="caption"
        component="div"
        sx={{
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
        line={1}
      >
        {author}
      </TextMaxLine>

      <Link color="inherit" to={linkTo} component={RouterLink}>
        <TextMaxLine
          variant={isDesktop && latestPostLarge ? 'h5' : 'subtitle2'}
          line={2}
          persistent
        >
          {title}
        </TextMaxLine>
      </Link>

      <Stack
        flexWrap="wrap"
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: 3,
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {POST_INFO.map((info, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            sx={{ typography: 'caption', ml: index === 0 ? 0 : 1.5 }}
          >
            <Iconify icon={info.icon} width={16} sx={{ mr: 0.5 }} />
            {info.number}
          </Stack>
        ))}
      </Stack>
    </CardContent>
  )
}
