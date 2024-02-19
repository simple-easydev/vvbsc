import { checkChainalysis } from "@/axios/account"
import { signForApi } from "@/axios/requests"
import { useAlertError } from "@/hooks"
import React, { useEffect } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { Address, useAccount } from "wagmi"

// project imports

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {

	const { isConnected, address } = useAccount()
	const navigate = useNavigate()
	const alertError = useAlertError()



	const sign = async (address:Address) => {

		let isSantioned = false
		try {
			const { data } = await checkChainalysis(address)
			isSantioned = data.isSantioned
			if(data.isSantioned){
				alertError(new Error("Your wallet address is santioned"))
			}
		}catch(error){
			console.log(error)
		}
		
		if(!isSantioned){
			const result = await signForApi()
			if(result){
				navigate("/")
			}
		}

	}

	useEffect(()=>{
		if(isConnected && address){
			sign(address)
		}
	}, [isConnected, address])


	return (
		<>
			<Outlet />
		</>
	)
}

export default MinimalLayout
