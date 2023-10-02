import React from "react"
import { useNavigate } from "react-router-dom"
import { ProSidebar, Menu, MenuItem, SidebarContent } from "react-pro-sidebar"
import { makeStyles } from "@mui/styles"
import { useMediaQuery, Box, useTheme } from "@mui/material"
import SVG from "react-inlinesvg"
import { useWalletClient } from "wagmi"

import { Color } from "@/color"

import "./style.scss"
import { grey } from "@mui/material/colors"

const managerMenuItems = [
	{
		icon: <SVG src="/media/svg/menu-home.svg" fill={Color.Primary} />,
		title: "Home",
		route: "/manager/home",
	},
	{
		icon: <SVG src="/media/svg/menu-all.svg" fill={Color.Primary} />,
		title: "All Polls",
		route: "/manager/view/all",
	},
	{
		icon: <SVG src="/media/svg/menu-history.svg" fill={Color.Primary} />,
		title: "Historical Polls",
		route: "/manager/view/history",
	},
	{
		icon: <SVG src="/media/svg/menu-future.svg" fill={Color.Primary} />,
		title: "Coming Polls",
		route: "/manager/view/coming",
	},
	{
		icon: <SVG src="/media/svg/menu-active.svg" fill={Color.Primary} />,
		title: "Active Polls",
		route: "/manager/view/active",
	},
	{
		icon: <SVG src="/media/svg/menu-create.svg" fill={Color.Primary} />,
		title: "Create New Poll",
		route: "/manager/submit-poll",
	},
	{
		icon: <SVG src="/media/svg/menu-create.svg" fill={Color.Primary} />,
		title: "Gas Wallet",
		route: "/manager/gas-wallet",
	},
]

const ownerMenuItems = [
	{
		icon: <SVG src="/media/svg/menu-home.svg" fill={Color.Primary} />,
		title: "Home",
		route: "/owner/home",
	},
	{
		icon: <SVG src="/media/svg/menu-all.svg" fill={Color.Primary} />,
		title: "All Polls",
		route: "/owner/view/all",
	},
	{
		icon: <SVG src="/media/svg/menu-history.svg" fill={Color.Primary} />,
		title: "Unclosed Polls",
		route: "/owner/view/unclosed",
	},
	{
		icon: <SVG src="/media/svg/menu-withdraw.svg" fill={Color.Primary} />,
		title: "Withdraw",
		route: "/owner/withdraw",
	},
	{
		icon: <SVG src="/media/svg/menu-withdraw.svg" fill={Color.Primary} />,
		title: "Fee Management",
		route: "/owner/fee",
	},
]

const voterMenuItems = [
	{
		icon: <SVG src="/media/svg/menu-home.svg" fill={Color.Primary} />,
		title: "Home",
		route: "/voter/home",
	},
	{
		icon: <SVG src="/media/svg/menu-active.svg" fill={Color.Primary} />,
		title: "Active Polls",
		route: "/voter/view/active",
	},
	{
		icon: <SVG src="/media/svg/menu-future.svg" fill={Color.Primary} />,
		title: "Coming Polls",
		route: "/voter/view/coming",
	},
	{
		icon: <SVG src="/media/svg/menu-history.svg" fill={Color.Primary} />,
		title: "Historical Polls",
		route: "/voter/view/history",
	},
]

const useStyles = makeStyles(() => ({
	root: {
		paddingTop: 72,
		borderRight: `2px solid ${Color.Border}`,
	},
}))

type Props = {
  userType: string;
  children: JSX.Element | JSX.Element[];
};

const Sidebar: React.FC<Props> = ({ userType, children }) => {
	const { data: walletClient, isError, isLoading } = useWalletClient()
	const navigate = useNavigate()
	// const matches = useMediaQuery("(min-width: 768px)")
	const theme = useTheme()
	const matches = useMediaQuery(theme.breakpoints.up("sm"))

	return (
		<Box sx = {{ display:"flex", height:"100vh" }}>
			<Box sx = {{ borderRight:`solid 1px ${grey[100]}`}}>
				<ProSidebar
					className={"px-0 px-md-4 h-100"}
					collapsed={!matches}
				>
					<SidebarContent>
						<Menu iconShape="square">
							{(userType === "owner"
								? ownerMenuItems
								: userType === "manager"
									? managerMenuItems
									: voterMenuItems
							).map(({ icon, title, route }, index) => (
								<MenuItem key={index} icon={icon} onClick={() => navigate(route)}>
									<span className="text-primary">{title}</span>
								</MenuItem>
							))}
						</Menu>
					</SidebarContent>
				</ProSidebar>
			</Box>
			<Box sx = {{ flex: 1, pt:3 }}>
				{walletClient && children }
				{!walletClient && <h1>Loading...</h1> }
			</Box>
		</Box>
	)
}

export default Sidebar
