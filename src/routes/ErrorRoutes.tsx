import React, { lazy } from "react"

// project imports
import Loadable from "@/components/Loader/Loadable"
import MinimalLayout from "@/layout/MinimalLayout"

// ==============================|| ERROR ROUTING ||============================== //

const ErrorRoutes = [
	{
		path: "*",
		element: <div>Error</div>
	}
]

export default ErrorRoutes
