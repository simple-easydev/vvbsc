import { useRoutes } from "react-router-dom"

// routes
import MainRoutes from "./MainRoutes"
import AuthenticationRoutes from "./AuthenticationRoutes"
import ErrorRoutes from "./ErrorRoutes"

// ==============================|| ROUTING RENDER ||============================== //

export default function AppRoutes() {
	return useRoutes([
		...MainRoutes, 
		...AuthenticationRoutes, 
		...ErrorRoutes
	])
}
