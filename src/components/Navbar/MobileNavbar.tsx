import React from "react"
import { AppBar, Box, Button, Container, Divider, IconButton } from "@mui/material"
import { useWeb3Modal } from "@web3modal/react"
import MenuIcon from "@mui/icons-material/Menu"
import useLayout from "@/appRedux/layout/layout.hook"

const MobileNavbar = () => {
	const { open } = useWeb3Modal()
	const { toggleSidebarOpen } = useLayout()
	return (
		<AppBar
			position="sticky"
			elevation={0}
			sx = {{
				bgcolor:"#fff"
			}}
		>
			<Container maxWidth = {false}>
				<Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ height:"60px" }}>
					<IconButton onClick={()=>{
						toggleSidebarOpen()
					}}>
						<MenuIcon />
					</IconButton>
					<Button variant="contained" onClick={open}>Disconnect</Button>
				</Box>
			</Container>
			<Divider />
		</AppBar>
	)
    
}

export default MobileNavbar