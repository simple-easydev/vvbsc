import { ThemeOptions, createTheme } from "@mui/material/styles"


declare module "@mui/material/styles" {

  interface Palette {
    custom: {
      main:string
    };
  }

  interface PaletteOptions {
    custom: {
      main:string
    }
  }
  
}

const defaultTheme = createTheme()

const themeOptions:ThemeOptions = {
	palette: {
		...defaultTheme.palette,
		primary: {
			main: "#730fc3",
		}
	},

	components: {
		MuiCheckbox: {
			styleOverrides:{
				"root": {
					"&.Mui-checked": "#730fc3"
				}
				// checked:"#730fc3"
			}
		},

	},

	typography:{
		// fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,Liberation Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
		// h5:{
		// 	marginBottom: "0.75rem",
		// 	fontSize: "1.25rem",
		// 	fontWeight:"500",
		// },
		// h3:{
		// 	marginBottom: "0.75rem",
		// 	fontSize: "1.75rem",
		// 	fontWeight:"500",
		// },
	},
}

export const theme = createTheme(themeOptions)

