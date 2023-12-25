import React, { useCallback, useEffect } from "react"
import { Suspense } from "react"

import CssBaseline from "@mui/material/CssBaseline"
import { BrowserRouter as Router } from "react-router-dom"
import AppRoutes from "@/routes"

import { useAccount } from "wagmi"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { ThemeProvider } from "@mui/material"
import { theme } from "./theme"
import { useAlertError } from "./hooks"
import useAuth from "./appRedux/auth/auth.hook"
import { isManager, isOwner } from "./web3"

import "./App.css"


export default function App() {

	const alertError = useAlertError()
	const { setManager, setOwner } = useAuth()
	const { address } = useAccount()
	
	const fetchUserRole = useCallback(() => {
		if (address) {
			isManager().then(setManager).catch(alertError)
			isOwner().then(setOwner).catch(alertError)
		}
	}, [address])
  
	useEffect(() => {
		if (address) {
			fetchUserRole()
		}
	}, [address])

	
	return (
		<Suspense fallback={<></>}>
			<LocalizationProvider dateAdapter={AdapterMoment}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Router basename="/">
						<AppRoutes />
					</Router>
				</ThemeProvider>
			</LocalizationProvider>
		</Suspense>

	)
}