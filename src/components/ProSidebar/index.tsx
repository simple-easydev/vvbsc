import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMediaQuery, Box, useTheme, styled, Theme, CSSObject, IconButton, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material"
import SVG from "react-inlinesvg"
import { useWalletClient } from "wagmi"
import MuiDrawer from "@mui/material/Drawer"

import { Color } from "@/color"

import "./style.scss"
import { grey } from "@mui/material/colors"
import HomeIcon from "@mui/icons-material/Home"
import AppsIcon from "@mui/icons-material/Apps"
import HistoryIcon from "@mui/icons-material/History"
import UpcomingIcon from "@mui/icons-material/Upcoming"
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown"
import WalletIcon from "@mui/icons-material/Wallet"
import NoteAddIcon from "@mui/icons-material/NoteAdd"
import PriceCheckIcon from "@mui/icons-material/PriceCheck"
import RequestQuoteIcon from "@mui/icons-material/RequestQuote"

const managerMenuItems = [
	{
		icon: <HomeIcon />,
		title: "Home",
		route: "/manager/home",
	},
	{
		icon: <AppsIcon />,
		title: "All Polls",
		route: "/manager/view/all",
	},
	{
		icon: <HistoryIcon />,
		title: "Historical Polls",
		route: "/manager/view/history",
	},
	{
		icon: <UpcomingIcon />,
		title: "Coming Polls",
		route: "/manager/view/coming",
	},
	{
		icon: <ThumbsUpDownIcon />,
		title: "Active Polls",
		route: "/manager/view/active",
	},
	{
		icon: <NoteAddIcon />,
		title: "Create New Poll",
		route: "/manager/submit-poll",
	},
	{
		icon: <WalletIcon />,
		title: "Gas Wallet",
		route: "/manager/gas-wallet",
	},
]

const ownerMenuItems = [
	{
		icon: <HomeIcon />,
		title: "Home",
		route: "/owner/home",
	},
	{
		icon: <AppsIcon />,
		title: "All Polls",
		route: "/owner/view/all",
	},
	{
		icon: <HistoryIcon />,
		title: "Unclosed Polls",
		route: "/owner/view/unclosed",
	},
	{
		icon: <PriceCheckIcon />,
		title: "Withdraw",
		route: "/owner/withdraw",
	},
	{
		icon: <RequestQuoteIcon />,
		title: "Fee Management",
		route: "/owner/fee",
	},
]

const voterMenuItems = [
	{
		icon: <HomeIcon />,
		title: "Home",
		route: "/voter/home",
	},
	{
		icon: <ThumbsUpDownIcon />,
		title: "Active Polls",
		route: "/voter/view/active",
	},
	{
		icon: <UpcomingIcon />,
		title: "Coming Polls",
		route: "/voter/view/coming",
	},
	{
		icon: <HistoryIcon />,
		title: "Historical Polls",
		route: "/voter/view/history",
	},
]

const drawerWidth = 240

type Props = {
  userType: string;
  children: JSX.Element | JSX.Element[];
};

  
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

const Sidebar: React.FC<Props> = ({ userType, children }) => {
	const { data: walletClient, isError, isLoading } = useWalletClient()
	const navigate = useNavigate()
	const theme = useTheme()
	const matches = useMediaQuery(theme.breakpoints.up("sm"))
	const [menuKey, setMenuKey] = useState(0)

	const menuItems = useMemo(()=>{
		return (userType === "owner")?ownerMenuItems:(userType === "manager")?managerMenuItems:voterMenuItems
	}, [ userType ])

	return (
		<Box sx = {{ display:"flex" }}>
			<Box sx = {{ borderRight:`solid 1px ${grey[100]}`}}>
				<Drawer variant="permanent" open={matches}>
					<Toolbar />
					<List sx={{ px:1 }}>
						{menuItems.map((item, index) => (
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
										justifyContent: matches ? "center" : "initial",
										px: matches? 2.5 : 0,
									}}
									onClick={()=>{
										setMenuKey(index)
										navigate(item.route)
									}}
								>
									<ListItemIcon
										sx={{
											width:"20px",
											height:"20px",
											mr: "auto",
											justifyContent: "center",
											color: menuKey == index?theme.palette.primary.main:theme.palette.grey[500]
										}}
									>
										{ item.icon }
									</ListItemIcon>
									<ListItemText primary={item.title} sx={{ opacity: matches ? 1 : 0 }} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Drawer>
			</Box>
			<Box sx = {{ flex: 1, pt:3 }}>
				{walletClient && children }
				{!walletClient && <h1>Loading...</h1> }
			</Box>
		</Box>
	)
}

export default Sidebar
