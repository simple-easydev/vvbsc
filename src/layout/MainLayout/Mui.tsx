import * as React from "react"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"

import { Outlet } from "react-router-dom"
import SideBar, { DrawerHeader } from "@/components/Sidebar"
import MainNavbar from "@/components/MuiNavbar"

const drawerwidth = 240

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: `-${drawerwidth}px`,
	...(open && {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	}),
}))


export default function MainLayout() {

	const [open, setOpen] = React.useState(true)

	const handleDrawerOpen = () => {
		setOpen(true)
	}

	const handleDrawerClose = () => {
		setOpen(false)
	}

	return (
		<Box sx={{ display: "flex" }}>

			<MainNavbar drawerwidth={drawerwidth} handleDrawerOpen={handleDrawerOpen} open = {open} />

			<SideBar 
				open = {open} 
				drawerwidth={drawerwidth} 
				handleDrawerClose={handleDrawerClose} 
				handleDrawerOpen={handleDrawerOpen} 
			/>

			<Main open={open}>
				<DrawerHeader />
				<Outlet />
			</Main>
		</Box>
	)
}