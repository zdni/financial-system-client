import { enUS, idID } from '@mui/material/locale'

export const allLangs = [
  {
    label: 'Indonesia',
    value: 'id',
    systemValue: idID,
    icon: '/assets/icons/flags/ic_flag_id.svg'
  },
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/flags/ic_flag_en.svg'
  },
]

export const defaultLang = allLangs[0]