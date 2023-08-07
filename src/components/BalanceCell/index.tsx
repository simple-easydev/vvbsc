import React from "react"
import { Box } from "@mui/material"
import { Address, useBalance } from "wagmi"
import Loading from "../Loading"
import { formatUnits } from "viem"

interface Props {
    address:Address
}

const BalanceCell = ({ address }: Props)=>{

	const { data : balance, isLoading } = useBalance({ address, formatUnits:"ether", watch:true, cacheTime:10000, staleTime:10000 })
	const balanceval = formatUnits(balance?.value || BigInt(0), 18)

	return (
		<Box sx = {{ textAlign:"right"}}>
			{isLoading?<Loading />: balanceval }
		</Box>
	)
}

export default BalanceCell