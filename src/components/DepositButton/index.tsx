import React, { useState } from "react"
import { Address } from "viem"
import { useBalance } from "wagmi"
import ActionButton from "../ActionButton"
import useGasWallet from "@/appRedux/gasWallet/gasWallet.hook"
import { withdrawBnbFromGasWallet } from "@/axios/account"
import { useResponseError } from "@/hooks"

interface Props {
    to:Address
}

const DepositButton = ({ to }: Props) => {

	const { data : balance, isLoading } = useBalance({ address:to, formatUnits:"ether", watch:true, cacheTime:10000, staleTime:10000 })
	const { setDepositDialogOpen } = useGasWallet()
	const [ isRequesting, setRequesting] = useState(false)
	const alertError = useResponseError()

	const withdraw = async () => {
		// 
		setRequesting(true)
		try{
			await withdrawBnbFromGasWallet(to)
		}catch(error){
			console.log(error)
			alertError(error)
		}
		setRequesting(false)
	}

	return (
		<>
			<ActionButton 
				isBusy = {isLoading}
				size="small"
				variant="contained" 
				onClick={async ()=>{
					setDepositDialogOpen(true, to)
				}}>Deposit
			</ActionButton>
			{
				Number(balance?.value) > 0 && 
				<ActionButton
					isBusy = {isRequesting}
					sx = {{ ml:2 }}
					size="small"
					variant="contained" 
					onClick={async ()=>{
						withdraw()
					}}>
					Withdraw
				</ActionButton>
			}
		</>
	)

}

export default DepositButton