import { del, get, post, put } from "./api_helper"
import * as url from "./url_helper"

export const checkServer = () => get('', {})
//  .............................. AUTH ....................................
export const authLogin = user => post(url.LOGIN, user)
export const authRefreshToken = user => post(url.REFRESH_TOKEN, user, { params: { ...user } })

//  .............................. USERS ....................................
export const getUserFromToken = token => get(url.USER_FROM_TOKEN, { headers: { authorization: `Bearer ${token}` } })
export const getUsers = config => get(url.USERS, config) // { params: query, headers }
export const getUser = (id, config) => get(`${url.USERS}/${id}`, config) // { params: { id } }
export const createUser = (data, config) => post(url.USERS, data, config)
export const updateUser = (id, data, config) => put(`${url.USERS}/${id}`, data, config)
export const resetPasswordUser = (id, config) => put(`${url.USER_RESET_PASSWORD}/${id}`, {}, config)
export const changePasswordUser = (id, data, config) => put(`${url.USER_CHANGE_PASSWORD}/${id}`, data, config)
export const deleteUser = (id, config) => del(`${url.USERS}/${id}`, config)

//  .............................. TRANSACTION ....................................
export const getTransactions = config => get(url.TRANSACTIONS, config)
export const getTransaction = id => get(`${url.TRANSACTIONS}/${id}`)
export const getTransactionGroup = config => get(url.TRANSACTIONS_GROUP, config)
export const createTransaction = (data, config) => post(url.TRANSACTIONS, data, config)
export const updateTransaction = (id, data, config) =>  put(`${url.TRANSACTIONS}/${id}`, data, config)
export const deleteTransaction = (id, config) =>  del(`${url.TRANSACTIONS}/${id}`, config)
export const exportExcelTransaction = config =>  get(`${url.TRANSACTIONS}/export/xlsx`, config)

//  .............................. ACCOUNT ....................................
export const getAccounts = config => get(url.ACCOUNTS, config)
export const getAccount = (id, config) => get(`${url.ACCOUNTS}/${id}`, config)
export const createAccount = (data, config) => post(url.ACCOUNTS, data, config)
export const updateAccount = (id, data, config) =>  put(`${url.ACCOUNTS}/${id}`, data, config)
export const deleteAccount = (id, config) => del(`${url.ACCOUNTS}/${id}`, config)

//  .............................. VENDOR ....................................
export const getVendors = config => get(url.VENDORS, config)
export const getVendor = (id, config) => get(`${url.VENDORS}/${id}`, config)
export const createVendor = (data, config) => post(url.VENDORS, data, config)
export const updateVendor = (id, data, config) =>  put(`${url.VENDORS}/${id}`, data, config)
export const deleteVendor = (id, config) => del(`${url.VENDORS}/${id}`, config)