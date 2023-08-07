

import { createSlice } from "@reduxjs/toolkit"

const initialState: any  = {
	isManager:false,
	isOwner:false
}

const reducers:any = {
	setManager: (state: any, action: { payload: any }) => {
		const { payload } = action
		state.isManager = payload
	},
	setOwner: (state: any, action: { payload: any }) => {
		const { payload } = action
		state.isOwner = payload
	},
}

const slice = createSlice({ name:"auth", initialState, reducers })

export const { setManager, setOwner }:any = slice.actions 
export default slice.reducer
