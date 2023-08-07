import React, { useCallback, useEffect, useState } from "react"
import { Box } from "@mui/material"
import { useAccount, useWalletClient } from "wagmi"
import { createGasWallet, getGasWalletLists } from "../../axios/account"
import SimpleTable from "../../components/SimpleTable"
import SVG from "react-inlinesvg"
import ActionButton from "../../components/ActionButton"
import BalanceCell from "@/components/BalanceCell"
import DepositButton from "@/components/DepositButton"
import useGasWallet from "@/appRedux/gasWallet/gasWallet.hook"
import DepositDialog from "@/components/DepositDialog"
import { useResponseError } from "@/hooks"

const GasWalletForm : React.FC = () => {

	const { address } = useAccount()
	const { connector } = useAccount()
	
	const { wallet: { depositDialogOpen }, setDepositDialogOpen } = useGasWallet()

	const [gasWallets, setGasWallets] = useState<any[]>([])
	const alertError = useResponseError()

	useEffect(()=>{
		if(address){
			fetchGasWallets()
		}
	}, [address])

	const fetchGasWallets = useCallback(() => {
		getGasWalletLists().then((res:any)=>{
			setGasWallets(res.data)
		})
	}, [address])

	const createNewGasWallet = useCallback(async () => {

		if (!address) throw new Error("Please connect Wallet")
		const chainId = await connector?.getChainId()
		createGasWallet().then((res)=>{
			fetchGasWallets()
		}).catch(alertError)

	}, [address])

	const handleClick = () => {
		console.log("---handleClick---")
	}

	const columns = [
		{
			id: "address",
			label: "Address",
			hasCopyToClipboard:true
		},
		{
			id: "balance",
			label: "Balance",
			textAlign:"right",
			format:(val:any, row:any)=>{
				return <BalanceCell address={row.address} />
			}
		},
		{
			id: "deposit",
			label: "Deposit/Withdraw",
			format:(val:any, row:any)=>
				<DepositButton to ={row.address} />
		},
	]

	return (
		<Box sx = {{ p:2 }}>
			<Box display={"flex"} justifyContent={"end"}>
				<ActionButton onClick={createNewGasWallet}>Create New Gas Wallet</ActionButton>
			</Box>
			<SimpleTable
				data={gasWallets}
				headRows={columns}
				primaryKey="address"
				onClick={handleClick}
				icon={<SVG src="/media/svg/in.svg" />}
			/>
			<DepositDialog />
		</Box>
	)
}

export default GasWalletForm