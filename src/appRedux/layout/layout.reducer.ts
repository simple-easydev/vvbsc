

import { createSlice } from "@reduxjs/toolkit"

const initialState: any  = {
	sidebarOpen:true
}

const reducers:any = {
	toggleSidebarOpen: (state:any) => {
		state.sidebarOpen = !state.sidebarOpen
	}
}

const slice = createSlice({ name:"layout", reducers, initialState })

export const {
	toggleSidebarOpen
} :any = slice.actions

export default slice.reducer
