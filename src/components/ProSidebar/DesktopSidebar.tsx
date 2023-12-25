import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, useTheme, styled, Theme, CSSObject, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Button, IconButton } from "@mui/material"
import MuiDrawer from "@mui/material/Drawer"
import { Color } from "@/color"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import useLayout from "@/appRedux/layout/layout.hook"
import useAuth from "@/appRedux/auth/auth.hook"


const drawerWidth = 240

  
const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
})
  
const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
})
  
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
	({ theme, open }) => ({
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
		boxSizing: "border-box",
		...(open && {
			...openedMixin(theme),
			"& .MuiDrawer-paper": openedMixin(theme),
		}),
		...(!open && {
			...closedMixin(theme),
			"& .MuiDrawer-paper": closedMixin(theme),
		}),
	}),
)

const DesktopSidebar = () => {
	const { layout: { sidebarOpen }, toggleSidebarOpen }  = useLayout()
	const navigate = useNavigate()
	const { menuItems } = useAuth()
	const theme = useTheme()
	const [menuKey, setMenuKey] = useState(0)

	return (
		<Drawer variant="permanent" open={sidebarOpen}>
			<Toolbar />
			<Box display={"flex"} justifyContent={"space-between"} flexDirection={"column"} height={"100%"} position={"relative"}>
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
				<Button 
					sx = {{ 
						p:2  
					}} 
					onClick={()=>{ toggleSidebarOpen() }}>
					{ sidebarOpen? <ArrowBackIosNewIcon sx = {{ width:"16px", height:"16px"}} /> : <ArrowForwardIosIcon sx = {{ width:"16px", height:"16px"}} /> }
				</Button>	
			</Box>
		</Drawer>
	)
}

export default DesktopSidebar
