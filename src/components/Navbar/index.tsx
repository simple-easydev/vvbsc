import React from "react"
import { useNavigate } from "react-router-dom"
import { Container, AppBar, Box, Divider } from "@mui/material"


const MainNavbar = () => {
	const navigate = useNavigate()

	return (
		<AppBar
			position="sticky"
			elevation={0}
			// position="top"
			sx = {{
				bgcolor:"#fff"
			}}
		>
			<Container maxWidth = {false}>
				<Box
					sx = {{ cursor:"pointer"}}
					component={"img"}
					style={{ height: 60, width:"auto" }}
					onClick={() => navigate("/")}
					src="/media/logo/velocity-vote-logo.png"
					alt="logo"
				/>
				<Box className="d-flex align-items-center justify-content-end py-2">
					{/* <Button className="px-3 text-uppercase" onClick={disconnect}>
              Close
            </Button> */}
				</Box>
			</Container>
			<Divider />
		</AppBar>
	)
}

export default MainNavbar
