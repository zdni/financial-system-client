import { useEffect, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
// helpers
import { getAccount, getAccounts, getVendors } from "../../helpers/backend_helper";
// components
import Iconify from "../../components/iconify";
import { useSnackbar } from '../../components/snackbar'

const TransactionFormLine = ({ data, deleteRow, form, remove, setComplete, setDeleteRow, setTransactions }) => {
  const TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
  const { enqueueSnackbar } = useSnackbar()

  const [accounts, setAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [transaction, setTransaction] = useState(data);
  const [save, setSave] = useState(false);


  useEffect(() => {
    async function fetchData() {
      const accounts = await getAccounts({})
      if(accounts.status === 200) {
        setAccounts(accounts.data.data);
        setTransaction((transaction) => ({
          ...transaction,
          accountId: accounts.data.data[0]?._id,
          type: accounts.data.data[0]?.account_type
        }))
      }

      const vendors = await getVendors({ headers: { authorization: `Bearer ${TOKEN}` }})
      if(vendors.status === 200) {
        setVendors(vendors.data.data);
      }
    }
    fetchData();
    setComplete(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangeTransaction = (event) => {
    setTransaction((transaction) => ({
      ...transaction,
      [event.target.name]: event.target.value
    }))
  }

  const onChangeAccountId = async (value) => {
    const response = await getAccount(value, { headers: { authorization: `Bearer ${TOKEN}` }});
    const { data, message, status } = response
    if(status === 200) {
      setTransaction((transaction) => ({
        ...transaction,
        accountId: value,
        type: data.data?.account_type
      }));
    } else {
      enqueueSnackbar(message, { variant: 'error' })
    }
  }

  const onChangeTransactions = () => {
    setTransactions((transactions) => ({
      ...transactions,
      [transaction.id]: transaction
    }))
  }


  return (
    <Stack spacing={1} direction='row'>
      <TextField
        name='label'
        label='Label'
        fullWidth
        value={transaction?.label}
        onChange={onChangeTransaction}
        disabled={save || (form === 'view')}
      />
      <TextField
        select
        fullWidth
        SelectProps={{ native: true }}
        name='accountId'
        label="Akun"
        defaultValue={transaction?.accountId}
        onChange={(event) => onChangeAccountId(event.target.value)}
        disabled={save || (form === 'view')}
      >
        {accounts.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        SelectProps={{ native: true }}
        name='vendorId'
        label="Vendor"
        defaultValue={transaction?.vendorId}
        onChange={onChangeTransaction}
        disabled={save || (form === 'view')}
      >
        <option key='' value=''></option>
        {vendors.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </TextField>
      <TextField
        name='debit'
        label='Income'
        fullWidth
        value={transaction?.debit}
        onChange={onChangeTransaction}
        type="number"
        disabled={transaction.type !== 'income' || save || (form === 'view')}
      />
      <TextField
        name='credit'
        label='Expense'
        fullWidth
        value={transaction?.credit}
        onChange={onChangeTransaction}
        type="number"
        disabled={transaction.type !== 'expense' || save || (form === 'view')}
      />
      {
        !save && (
          <Button
            color="success"
            sx={{ flexShrink: 0 }}
            onClick={() => { 
              setComplete(true); 
              setSave(true); 
              onChangeTransactions(); 
            }}
            startIcon={<Iconify icon="eva:save-outline" />}
          />
        )
      }
      {
        save && (
          <Button
            color="info"
            sx={{ flexShrink: 0 }}
            onClick={() => {
              setSave(false)
              setComplete(false)
            }}
            startIcon={<Iconify icon="cil:pencil" />}
          />
        )
      }
      <Button
        color="error"
        sx={{ flexShrink: 0 }}
        onClick={() => {
          const rows = [...deleteRow, transaction._id]
          setDeleteRow(rows); 
          remove(); 
        }}
        startIcon={<Iconify icon="eva:trash-2-outline" />}
      />
    </Stack>
  );
}

export default TransactionFormLine;