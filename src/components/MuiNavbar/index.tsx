
import React from "react"
import { styled } from "@mui/material/styles"
import { Toolbar, IconButton, Typography } from "@mui/material"
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import MenuIcon from "@mui/icons-material/Menu"

type Props = {
    open: boolean;
	drawerwidth:number;
	handleDrawerOpen:()=>void;
};

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
	drawerwidth:number;
}
  
const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open, drawerwidth }) => ({
	transition: theme.transitions.create(["margin", "width"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		width: `calc(100% - ${drawerwidth}px)`,
		marginLeft: `${drawerwidth}px`,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}))

const MainNavbar: React.FC<Props> = ({ open, drawerwidth, handleDrawerOpen }) => {
	return (
		<AppBar position="fixed" open={open} drawerwidth = {drawerwidth} >
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					onClick={handleDrawerOpen}
					edge="start"
					sx={{ mr: 2, ...(open && { display: "none" }) }}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" noWrap component="div"></Typography>
			</Toolbar>
		</AppBar>
	)
}

export default MainNavbar