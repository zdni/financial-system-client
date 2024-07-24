import Iconify from '../iconify'

// ----------------------------------------------------------------------

export function LeftIcon({ icon = 'eva:arrow-ios-forward-fill', isRTL }) {
  return (
    <Iconify
      icon={icon}
      sx={{
        width: 20,
        height: 20,
        transform: ' scaleX(-1)',
        ...(isRTL && {
          transform: ' scaleX(1)',
        }),
      }}
    />
  )
}

export function RightIcon({ icon = 'eva:arrow-ios-forward-fill', isRTL }) {
  return (
    <Iconify
      icon={icon}
      sx={{
        width: 20,
        height: 20,
        ...(isRTL && {
          transform: ' scaleX(-1)',
        }),
      }}
    />
  )
}
