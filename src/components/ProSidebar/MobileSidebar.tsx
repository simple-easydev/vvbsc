import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, useTheme, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Button, Typography } from "@mui/material"
import { Color } from "@/color"
import useLayout from "@/appRedux/layout/layout.hook"
import { Drawer } from "@mui/material"
import useAuth from "@/appRedux/auth/auth.hook"

const MobileSidebar = () => {
	const { layout: { sidebarOpen }, toggleSidebarOpen }  = useLayout()
	const { menuItems } = useAuth()
	const navigate = useNavigate()
	const theme = useTheme()
	const [menuKey, setMenuKey] = useState(0)
	return (
		<Drawer 
			variant="temporary" 
			open={sidebarOpen} onClose={()=>{
				toggleSidebarOpen()
			}}>
			<Toolbar >
				<Box
					sx = {{ cursor:"pointer"}}
					component={"img"}
					style={{ height: 60, width:"auto" }}
					onClick={() => navigate("/")}
					src="/media/logo/velocity-vote-logo.png"
					alt="logo"
				/>
			</Toolbar>
			<Box sx = {{ width:"240px", height:"100%" }} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
				<List sx={{ px:1 }}>
					{menuItems.map(({ route, title, Icon }, index) => (
						<ListItem key={index} disablePadding 
							sx={{ 
								display: "block", 
								mb:"2px",  
								borderRadius:"10px", 
								overflow:"hidden", 
								...(menuKey == index)?{
									background:"rgba(118, 53, 220, 0.08)", 
									color:Color.Primary 
								}:{
										
								}
							}}>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: sidebarOpen ? "initial" : "center",
									px: sidebarOpen? 2.5 : 0,
								}}
								onClick={()=>{
									setMenuKey(index)
									navigate(route)
								}}
							>
								<ListItemIcon
									sx={{
										width:"20px",
										mx: "auto",
										justifyContent: "center",
										color: menuKey == index?theme.palette.primary.main:theme.palette.grey[500]
									}}
								>
									<Icon />
								</ListItemIcon>
								<ListItemText primary={title} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Box sx = {{ p: 2, color:theme.palette.primary.main }}>
					<Typography textAlign={"center"} component={"p"} sx={{ fontSize:"14px" }}>
                        Rematic Finance ©2024 Created by Rematic Finance Team
					</Typography>
				</Box>
			</Box>
		</Drawer>
	)
}

export default MobileSidebar
