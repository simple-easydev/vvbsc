

import { createSlice } from "@reduxjs/toolkit"

const initialState: any  = {
	searchBoxToggle:false,
	openLogin:false,
	openSignUp:false,
	openForgotPassword:false,
	openResetpassword:false,
	isModelerFullScreen:false,
	dialogTitle:"" //'login-form'|'signup-form'|'forgot-pass-form'|'reset-pass-form'|'reset-pass-success-form'|'close'
}

const reducers:any = {
	setSearchBoxToggle: (state: any, action: { payload: boolean }) => {
		const { payload } = action
		state.searchBoxToggle = payload
	},
	openLoginForm: (state: any, action: { payload: boolean }) => {
		const { payload } = action
		state.openLogin = payload
	},

	openSignUpForm: (state: any, action: { payload: boolean }) => {
		const { payload } = action
		state.openSignUp = payload
	},

	openForgotPasswordForm: (state: any, action: { payload: boolean }) => {
		const { payload } = action
		state.openForgotPassword = payload
	},

	openResetPasswordForm: (state: any, action: { payload: boolean }) => {
		const { payload } = action
		state.openResetpassword = payload
	},

	openDialogForm: (state: any, action: { payload: string }) => {
		const { payload } = action
		state.dialogTitle = payload
	},

	setModelerFullScreen: (state: any, action: { payload: string }) => {
		const { payload } = action
		state.isModelerFullScreen = payload
	},
}

const slice = createSlice({ name:"layout", reducers, initialState })
export const {
	setSearchBoxToggle, openLoginForm, openSignUpForm, openForgotPasswordForm, openResetPasswordForm, openDialogForm, setModelerFullScreen
} :any = slice.actions

export default slice.reducer
