function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = '/auth'
const ROOTS_DASHBOARD = '/beranda'

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
}


export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  transaction: {
    root: path(ROOTS_DASHBOARD, '/transaksi'),
    form: path(ROOTS_DASHBOARD, '/transaksi/form'),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/pengguna'),
    list: path(ROOTS_DASHBOARD, '/pengguna/daftar'),
  },
  management: {
    account: path(ROOTS_DASHBOARD, '/manajemen/akun'),
    vendor: path(ROOTS_DASHBOARD, '/manajemen/vendor'),
    user: path(ROOTS_DASHBOARD, '/manajemen/pengguna'),
  },
}