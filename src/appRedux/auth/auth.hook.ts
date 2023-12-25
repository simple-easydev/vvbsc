
import React, { useCallback, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as actions from "./auth.reducer"
import { UserType } from "@/utils/types"
import HomeIcon from "@mui/icons-material/Home"
import AppsIcon from "@mui/icons-material/Apps"
import HistoryIcon from "@mui/icons-material/History"
import UpcomingIcon from "@mui/icons-material/Upcoming"
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown"
import WalletIcon from "@mui/icons-material/Wallet"
import NoteAddIcon from "@mui/icons-material/NoteAdd"
import PriceCheckIcon from "@mui/icons-material/PriceCheck"
import RequestQuoteIcon from "@mui/icons-material/RequestQuote"

const useAuth = () => {
	const dispatch = useDispatch()
	const auth: any = useSelector((state: any) => {
		return state.authReducer
	})
	const setManager = useCallback((profile:any) => {
		dispatch(actions.setManager(profile))
	}, [dispatch])

	const setOwner = useCallback((profile:any) => {
		dispatch(actions.setOwner(profile))
	}, [dispatch])

	const setUserType = useCallback((usertype:UserType) => {
		dispatch(actions.setUserType(usertype))
	}, [dispatch])

	const menuItems = useMemo(()=>{

		const managerMenuItems = [
			{
				Icon: HomeIcon,
				title: "Home",
				route: "/manager/home",
			},
			{
				Icon: AppsIcon,
				title: "All Polls",
				route: "/manager/view/all",
			},
			{
				Icon: HistoryIcon,
				title: "Historical Polls",
				route: "/manager/view/history",
			},
			{
				Icon: UpcomingIcon,
				title: "Coming Polls",
				route: "/manager/view/coming",
			},
			{
				Icon: ThumbsUpDownIcon ,
				title: "Active Polls",
				route: "/manager/view/active",
			},
			{
				Icon: NoteAddIcon ,
				title: "Create New Poll",
				route: "/manager/submit-poll",
			},
			{
				Icon: WalletIcon ,
				title: "Gas Wallet",
				route: "/manager/gas-wallet",
			},
		]
		
		const ownerMenuItems = [
			{
				Icon: HomeIcon ,
				title: "Home",
				route: "/owner/home",
			},
			{
				Icon: AppsIcon ,
				title: "All Polls",
				route: "/owner/view/all",
			},
			{
				Icon: HistoryIcon ,
				title: "Unclosed Polls",
				route: "/owner/view/unclosed",
			},
			{
				Icon: PriceCheckIcon ,
				title: "Withdraw",
				route: "/owner/withdraw",
			},
			{
				Icon: RequestQuoteIcon ,
				title: "Fee Management",
				route: "/owner/fee",
			},
		]
		
		const voterMenuItems = [
			{
				Icon: HomeIcon ,
				title: "Home",
				route: "/voter/home",
			},
			{
				Icon: ThumbsUpDownIcon ,
				title: "Active Polls",
				route: "/voter/view/active",
			},
			{
				Icon: UpcomingIcon ,
				title: "Coming Polls",
				route: "/voter/view/coming",
			},
			{
				Icon: HistoryIcon ,
				title: "Historical Polls",
				route: "/voter/view/history",
			},
		]

		return (auth.userType === UserType.OWNER)?ownerMenuItems:(auth.userType === UserType.MANAGER)?managerMenuItems:voterMenuItems


	}, [ auth.usesrType ])

	return { auth, menuItems, setManager, setOwner, setUserType }
  
}

export default useAuth