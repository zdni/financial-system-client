import React from "react"
// @mui
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles'
//
import useLocales from "./useLocales"

// ----------------------------------------------------------------------

export default function ThemeLocalization({ children }) {
  const outerTheme = useTheme()

  const { currentLang } = useLocales()

  const theme = createTheme(outerTheme, currentLang.systemValue)

  return <ThemeProvider theme={theme}> {children} </ThemeProvider>
}
