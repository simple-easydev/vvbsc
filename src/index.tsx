import React from "react"
import ReactDOM from "react-dom/client"

import { Provider } from "react-redux"
import store from "@/appRedux/store"

import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum"
import { Web3Modal } from "@web3modal/react"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { bscTestnet, bsc, polygon } from "wagmi/chains"

import { Provider as AlertProvider, transitions, positions } from "react-alert"

import AlertTemplate from "./components/AlertTemplate"


import App from "./App"
import reportWebVitals from "./reportWebVitals"


const chains:any[] = [bsc]

const projectId = process.env.REACT_APP_PROJECT_ID || ""

const alertOpts = {
	position: positions.TOP_RIGHT,
	timeout: 5000,
	transition: transitions.FADE,
}

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: w3mConnectors({ projectId, chains }),
	publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)



const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
)

root.render(
	<React.StrictMode>

		<Provider store={store}>
			<WagmiConfig config={wagmiConfig}>
				<AlertProvider template={AlertTemplate} {...alertOpts}>

					<App />

				</AlertProvider>
			</WagmiConfig>
			<Web3Modal
				themeMode="dark"
				themeVariables={{
					"--w3m-background-color":"#730fc3",
					"--w3m-accent-color":"#730fc3"
				}}
				projectId={projectId}
				ethereumClient={ethereumClient}
			/>
			
		</Provider>
	</React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
