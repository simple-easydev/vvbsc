import axios from "axios"
import { getAccount, getWalletClient, signMessage } from "wagmi/actions"
import { recoverMessageAddress } from "viem"

const LIMIT_OFFSET = 60000 * 60 // 60 minutes


const generateHeaders = async (isSecure:boolean) => {
	const headers: any = {
		"Content-Type":"application/json"
	}
	if(isSecure){
		const { address } = getAccount()
		const client = await getWalletClient()
		console.log("address ==>", address)
		console.log("client ==>", client)

		if (!address || !client) {
			console.error("Please connect Wallet")
			return
		}
		
		const now = Date.now()
		headers.account = address
		const lastTimestamp = localStorage.getItem("api-timestamp")
		const signature = localStorage.getItem("api-signature")

		if (lastTimestamp === null || +lastTimestamp + LIMIT_OFFSET < now || signature === null ) {
			const msg = `API request by ${address} at ${now}`
			const newSignature = await signMessage({ message:msg })
			const newChainId = await client.getChainId()
			headers.signature = newSignature
			headers.timestamp = now
			localStorage.setItem("api-signature", newSignature)
			localStorage.setItem("chainId", `${newChainId}`)
			localStorage.setItem("api-timestamp", "" + now)
		} else {
			headers.signature = signature
			headers.timestamp = +lastTimestamp
		}
		
	}

	return headers
}

export const signForApi = async () => {
	try{
		await generateHeaders(true)
		return true
	}catch(error){
		console.log(error)
		return false
	}
}

export const getRequest = (route:string) => {
	return new Promise<any>((resolve, reject)=>
		axios.get(route)
			.then((response)=>resolve(response))
			.catch((error)=>reject(error)))
}

export const secureGetReqeust = async (route:string) => {

	const headers = await generateHeaders(true)
	return new Promise<any>((resolve, reject)=>
		axios.get(route, {
			headers
		})
			.then((response)=>resolve(response))
			.catch((error)=>reject(error)))
}

export const postRequest = async (route:string, payloads:any) => {
	const headers = await generateHeaders(true)
	return new Promise<any>((resolve, reject)=>
		axios.post<any>(route, payloads, 
			{ 
				headers
			})
			.then((response)=>resolve(response))
			.catch((error)=>reject(error)))
}

export const putRequest = async (route:string, payloads:any) => {
	const headers = await generateHeaders(true)
	return new Promise<any>((resolve, reject)=>
		axios.put(route, payloads,
			{ 
				headers
			})
			.then((response)=>resolve(response))
			.catch((error)=>reject(error)))
}

export const deleteRequest = async (route:string) => {
	const headers = await generateHeaders(true)
	return new Promise<any>((resolve, reject)=>
		axios.delete(route, {
			headers
		})
			.then((response)=>resolve(response))
			.catch((error)=>reject(error)))
}