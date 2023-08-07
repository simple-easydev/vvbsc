import * as React from "react"
import { Outlet, useNavigate } from "react-router-dom"
import MainNavbar from "@/components/Navbar"
import Sidebar from "@/components/ProSidebar"
import { watchAccount, watchNetwork } from "wagmi/actions"
import { useAccount, useNetwork, useWalletClient } from "wagmi"


export default function MainLayout() {

	// const { path } = useParams()
	const path = window.location.pathname

	const navigate = useNavigate()
	const { address, isConnected } = useAccount()
	const { chain } = useNetwork()
	const { data: walletClient, isError, isLoading } = useWalletClient()

	watchAccount((account) => {
		if(address != account.address){
			localStorage.removeItem("api-signature")
			navigate("/")
		}
	})

	watchNetwork((network) => {
		if(chain?.id != network.chain?.id){
			localStorage.removeItem("chainId")
			navigate("/")
		}
	})

	return (
		<>
			<MainNavbar />
			<Sidebar userType={(path as string).split("/")[1]}>
				<Outlet />
			</Sidebar>
			
		</>
		
	)
}