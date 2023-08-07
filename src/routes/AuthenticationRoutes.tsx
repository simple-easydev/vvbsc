import React, { lazy } from "react"

// project imports
import Loadable from "@/components/Loader/Loadable"
import MinimalLayout from "@/layout/MinimalLayout"

const AuthenticationView = Loadable(lazy(() => import("@/pages/Authentication")))

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = [
	{
		path: "/auth",
		element: <MinimalLayout />,
		children: [
			{
				path: "",
				element: <AuthenticationView />
			}
		]
	}
]

export default AuthenticationRoutes
