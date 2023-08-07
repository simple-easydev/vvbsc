

import { createSlice } from "@reduxjs/toolkit"

const initialState: any  = {
	depositAmount:false,
	depositDialogOpen:false,
	to:""
}

const reducers:any = {
	setDepositAmount: (state: any, action: { payload: any }) => {
		const { payload } = action
		state.isManager = payload
	},
	setDepositDialogOpen: (state: any, action: { payload: any }) => {
		const { payload } = action
		state.depositDialogOpen = payload.open
		state.to = payload.to
	},
}

const slice = createSlice({ name:"gasWallet", initialState, reducers })

export const { setDepositAmount, setDepositDialogOpen }:any = slice.actions 
export default slice.reducer
