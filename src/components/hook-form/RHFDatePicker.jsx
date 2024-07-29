import React from 'react'
// form
import { useFormContext, Controller } from 'react-hook-form'
// @mui
import { TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export default function RHFDatePicker({ name, ...other }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          onChange={(value) => {
            const date = new Date(value); 
            const offset = new Date().getTimezoneOffset()/-60;
            date.setHours(offset,0,0);
            
            field.onChange(date)
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
              error={!!error}
              helperText={error?.message}
              {...other}
            />
          )}
        />
      )}
    />
  )
}
