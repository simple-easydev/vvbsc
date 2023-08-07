
import { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as layoutAction from "./layout.reducer"

const useLayout = () => {
	const dispatch = useDispatch()
	const layout: any = useSelector((state: any) => {
		return state.layoutReducer
	})
	const setSearchBoxToggle = useCallback((toggle:any) => {
		dispatch(layoutAction.setSearchBoxToggle(toggle))
	}, [dispatch])

	const openLoginForm = useCallback((toggle:any) => {
		dispatch(layoutAction.openLoginForm(toggle))
	}, [dispatch])

	const openSignUpForm = useCallback((toggle:any) => {
		dispatch(layoutAction.openSignUpForm(toggle))
	}, [dispatch])

	const openForgotPasswordForm = useCallback((toggle:any) => {
		dispatch(layoutAction.openForgotPasswordForm(toggle))
	}, [dispatch])

	const openResetPasswordForm = useCallback((toggle:any) => {
		dispatch(layoutAction.openResetPasswordForm(toggle))
	}, [dispatch])

	const setModelerFullScreen = useCallback((toggle:any) => {
		dispatch(layoutAction.setModelerFullScreen(toggle))
	}, [dispatch])

	const openDialogForm = useCallback((title:"login-form"|"signup-form"|"forgot-pass-form"|"reset-pass-form"|"reset-pass-success-form"|"confirm-success-form"|"close") => {
		dispatch(layoutAction.openDialogForm(title))
	}, [dispatch])


	return { layout, openDialogForm, setSearchBoxToggle, openLoginForm,  openSignUpForm, openForgotPasswordForm, openResetPasswordForm, setModelerFullScreen }
  
}

export default useLayout