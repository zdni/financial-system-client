// routes
import Router from './routes'
// theme
import ThemeProvider from './theme'
// locales
import ThemeLocalization from './locales'
// components
import { MotionLazyContainer } from './components/animate'
import { StyledChart } from './components/chart'
import SnackbarProvider from './components/snackbar'

function App() {
  return (
    <ThemeProvider>
      <ThemeLocalization>
        <MotionLazyContainer>
          <SnackbarProvider>
            <StyledChart />
            <Router />
          </SnackbarProvider>
        </MotionLazyContainer>
      </ThemeLocalization>
    </ThemeProvider>
  );
}

export default App;
