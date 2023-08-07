import React from "react"
import { Box, Button, Container } from "@mui/material"

import { useWeb3Modal } from "@web3modal/react"
import { useNetwork } from "wagmi"

const AuthPage: React.FC = () => {
	// const { open: walletOpen } = useConnectModal();
	const  {open:walletOpen } = useWeb3Modal()

	return (
		<Container sx = {{ height:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
			<Box>
				<img
					style={{ height: 200 }}
					src="/media/logo/velocity-vote-logo.png"
					alt="logo"
				/>
			</Box>
			<Button 
				variant="contained"
				sx = {{
					px:4,
					mb:4
				}}
				onClick={walletOpen}
			>
				Connect
			</Button>
		</Container>
	)
}

export default AuthPage
