
import React from "react"
import { styled } from "@mui/material/styles"
import AppMenuItem from "@/layout/MainLayout/AppMenuItem"
import { Drawer, IconButton, Divider, List } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import IconDashboard from "@mui/icons-material/Dashboard"
import IconShoppingCart from "@mui/icons-material/ShoppingCart"
import IconPeople from "@mui/icons-material/People"
import IconLibraryBooks from "@mui/icons-material/LibraryBooks"

type Props = {
	drawerwidth:number;
    open:boolean;
	handleDrawerOpen:()=>void;
	handleDrawerClose:()=>void;
};

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: "flex-end",
}))

const appMenuItems = [
	{
		name: "Dashboard",
		link: "/",
		Icon: IconDashboard,
	},
	{
		name: "Orders",
		link: "/orders",
		Icon: IconShoppingCart,
	},
	{
		name: "Customers",
		link: "/customers",
		Icon: IconPeople,
	},
	{
		name: "Nested Pages",
		Icon: IconLibraryBooks,
		items: [
			{
				name: "Level 2",
				link: "/level2",
			},
			{
				name: "Level 2",
				items: [
					{
						name: "Level 3",
					},
					{
						name: "Level 3",
					},
				],
			},
		],
	},
]

const SideBar: React.FC<Props> = ({ open, drawerwidth, handleDrawerOpen, handleDrawerClose }) => {

	return (
		<Drawer
			sx={{
				width: drawerwidth,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: drawerwidth,
					boxSizing: "border-box",
				},
			}}
			variant="persistent"
			anchor="left"
			open={open}
		>
			<DrawerHeader>
				<IconButton onClick={handleDrawerClose}>
					<ChevronLeftIcon /> 
				</IconButton>
			</DrawerHeader>

			<Divider />
				
			<List>
				{appMenuItems.map((item, index) => (
					<AppMenuItem {...item} key={index} />
				))}
			</List>
		</Drawer>
	)
}

export { DrawerHeader }

export default SideBar