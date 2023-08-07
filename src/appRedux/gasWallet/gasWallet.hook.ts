
import { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as actions from "./gasWallet.reducer"
import { Address } from "viem"

const useGasWallet = () => {
	const dispatch = useDispatch()
	const wallet: any = useSelector((state: any) => {
		return state.walletReducer
	})
	const setDepositAmount = useCallback((amount:any) => {
		dispatch(actions.setDepositAmount(amount))
	}, [dispatch])

	const setDepositDialogOpen = useCallback((open:any, to:Address) => {
		dispatch(actions.setDepositDialogOpen({ open, to }))
	}, [dispatch])

	return { wallet, setDepositAmount, setDepositDialogOpen }
  
}

export default useGasWallet