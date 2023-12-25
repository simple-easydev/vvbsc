

import { UserType } from "@/utils/types"
import { createSlice } from "@reduxjs/toolkit"

const initialState: any  = {
	isManager:false,
	isOwner:false,
	userType:UserType
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
	setUserType: (state: any, action: { payload: any }) => {
		const { payload } = action
		state.userType = payload
	},
}

const slice = createSlice({ name:"auth", initialState, reducers })

export const { setManager, setOwner, setUserType }:any = slice.actions 
export default slice.reducer
