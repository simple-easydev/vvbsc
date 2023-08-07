import React, { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAccount, useNetwork } from "wagmi"
import { watchAccount } from "wagmi/actions"
import MainNavbar from "@/components/Navbar"



const AuthorizationLayout = () => {
	const navigate = useNavigate()
	const { address, isConnected } = useAccount()
	const { chain } = useNetwork()
	console.log("chain ==>", chain)

	watchAccount((account) => {
		console.log("-- account is changed --")
		console.log("old account:", address)
		console.log("new account:", account.address)
		if(address != account.address){
			localStorage.removeItem("api-signature")
		}
	})

	useEffect(
		() => {
			if (!isConnected) {
				navigate("/auth")
			}
		}, 
		[address, isConnected]
	)

	return (
		<>
			<MainNavbar />	
			<Outlet />
		</>
	)
}

export default AuthorizationLayout
