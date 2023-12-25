import * as React from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { DesktopNavbar, MobileNavbar } from "@/components/Navbar"
import { DesktopSidebar, MobileSidebar } from "@/components/ProSidebar"
import { watchAccount, watchNetwork } from "wagmi/actions"
import { useAccount, useNetwork } from "wagmi"
import { Box, Hidden, Typography, useMediaQuery, useTheme } from "@mui/material"
import useLayout from "@/appRedux/layout/layout.hook"

export default function MainLayout() {
	const navigate = useNavigate()
	const { address } = useAccount()
	const { chain } = useNetwork()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
	const { layout: { sidebarOpen } }  = useLayout()
	
	console.log("isMobile ===>", isMobile)

	watchAccount((account) => {
		if(address != account.address){
			localStorage.removeItem("api-signature")
			navigate("/")
		}
	})

	watchNetwork((network) => {
		if(chain?.id != network.chain?.id){
			localStorage.removeItem("chainId")
			navigate("/")
		}
	})

	return (
		<>
			<Hidden smDown >
				<DesktopNavbar />
				<DesktopSidebar />
				<Box sx = {{ pl: sidebarOpen?"240px":"80px" }}>
					<Outlet />
					<Box sx = {{ p: 2, color:theme.palette.primary.main }}>
						<Typography textAlign={"center"}>
							Rematic Finance ©2024 Created by Rematic Finance Team
						</Typography>
					</Box>
				</Box>
			</Hidden>
			<Hidden smUp >
				<MobileNavbar />
				<MobileSidebar />
				<Outlet />
			</Hidden>
			
		</>
		
	)
}