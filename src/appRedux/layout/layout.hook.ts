
import { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as layoutAction from "./layout.reducer"

const useLayout = () => {
	const dispatch = useDispatch()
	const layout: any = useSelector((state: any) => {
		return state.layoutReducer
	})

	const toggleSidebarOpen = useCallback(()=>{
		dispatch(layoutAction.toggleSidebarOpen())
	}, [dispatch])


	return { layout, toggleSidebarOpen }
  
}

export default useLayout