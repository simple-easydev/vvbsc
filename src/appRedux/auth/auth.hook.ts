
import { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as actions from "./auth.reducer"

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

	return { auth, setManager, setOwner }
  
}

export default useAuth