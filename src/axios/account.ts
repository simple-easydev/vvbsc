import { Address } from "viem"
import { API_URL } from "./config"
import { getRequest, postRequest, secureGetReqeust } from "./requests"

import { CHAIN_ID } from "./config"

export const createGasWallet = () => postRequest(`${API_URL}/account/${CHAIN_ID}/gas-wallet`, {})

export const getGasWalletLists = () => secureGetReqeust(`${API_URL}/account/${CHAIN_ID}/gas-wallets`)

export const withdrawBnbFromGasWallet = (wallet:Address) => postRequest(`${API_URL}/account/${CHAIN_ID}/withdraw`, { wallet } )

export const getTokenHolderList = (token:Address) => getRequest(`${API_URL}/account/${CHAIN_ID}/token/${token}/holders`)