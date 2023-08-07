
import React, { lazy } from "react"

// project imports
import MainLayout from "@/layout/MainLayout"
import Loadable from "@/components/Loader/Loadable"
import AuthorizationLayout from "@/layout/Authorization"
import RegisterManager from "@/pages/RegisterManager"
import WelcomeManager from "@/pages/WelcomeManager"
import Authorization from "@/pages/Authorization"
import ManagerHome from "@/pages/ManagerHome"
import ManagerViewPolls from "@/pages/ManagerViewPolls"
import SubmitPoll from "@/pages/SubmitPoll"
import SubmitWhitelist from "@/pages/SubmitWhitelist"
import SubmitQuestions from "@/pages/SubmitQuestions"
import ManagerPollDetails from "@/pages/ManagerPollDetails"
import GasWalletForm from "@/pages/GasWalletForm"
import OwnerHome from "@/pages/OwnerHome"
import OwnerViewPolls from "@/pages/OwnerViewPolls"
import OwnerPollDetails from "@/pages/OwnerPollDetails"
import Withdraw from "@/pages/Withdraw"
import VoterHome from "@/pages/VoterHome"
import VoteQuestions from "@/pages/VoteQuestions"
import VoterViewPolls from "@/pages/VoterViewPolls"

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("@/views/Dashboard")))
const AccountView = Loadable(lazy(() => import("@/views/Account")))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
	{
		path: "",
		element: <AuthorizationLayout />,
		children: [
			{
				path: "",
				element: <Authorization />,
			}
		]
	},
	{
		path: "/manager",
		element: <AuthorizationLayout />,
		children: [
			{
				path: "register",
				element: <RegisterManager />,
			},
			{
				path: "welcome",
				element: <WelcomeManager />,
			}
		]
	},
	{
		path: "/manager",
		element: <MainLayout />,
		children: [
			{
				path: "home",
				element: <ManagerHome />,
			},
			{
				path: "submit-poll",
				element: <SubmitPoll />,
			},
			{
				path: "submit-poll/:poll",
				element: <SubmitPoll />,
			},
			{
				path: "submit-whitelist/:poll",
				element: <SubmitWhitelist />,
			},
			{
				path: "submit-questions/:poll/:questionId",
				element: <SubmitQuestions />,
			},
			{
				path: "view/:type",
				element: <ManagerViewPolls />,
			},
			{
				path: "poll-details/:poll",
				element: <ManagerPollDetails />,
			},
			{
				path: "gas-wallet",
				element: <GasWalletForm />,
			},
		]
	},
	{
		path:"/owner",
		element:<MainLayout />,
		children:[
			{
				path:"home",
				element:<OwnerHome />
			},
			{
				path:"view/:type",
				element:<OwnerViewPolls />
			},
			{
				path:"poll-details/:poll",
				element:<OwnerPollDetails />
			},
			{
				path:"withdraw",
				element:<Withdraw />
			},
		]
	},
	{
		path:"/voter",
		element:<MainLayout />,
		children:[
			{
				path:"home",
				element:<VoterHome />
			},
			{
				path:"vote/:poll",
				element:<VoteQuestions />
			},
			{
				path:"view/:type",
				element:<VoterViewPolls />
			},
		]
	}
]

export default MainRoutes
