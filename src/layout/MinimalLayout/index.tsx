import { signForApi } from "@/axios/requests"
import React, { useEffect } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { useAccount } from "wagmi"

// project imports

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {

	const { isConnected } = useAccount()
	const navigate = useNavigate()


	const sign = async () => {
		const result = await signForApi()
		if(result){
			navigate("/")
		}
	}

	useEffect(()=>{
		if(isConnected){
			sign()
		}
	}, [isConnected])


	return (
		<>
			<Outlet />
		</>
	)
}

export default MinimalLayout
