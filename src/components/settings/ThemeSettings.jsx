import ThemeContrast from './ThemeContrast'
import ThemeRtlLayout from './ThemeRtlLayout'
import ThemeColorPresets from './ThemeColorPresets'
import SettingsDrawer from './drawer'

// ----------------------------------------------------------------------

export default function ThemeSettings({ children }) {
  return (
    <ThemeColorPresets>
      <ThemeContrast>
        <ThemeRtlLayout>
          {children}
          <SettingsDrawer />
        </ThemeRtlLayout>
      </ThemeContrast>
    </ThemeColorPresets>
  )
}
