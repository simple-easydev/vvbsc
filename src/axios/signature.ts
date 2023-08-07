import { Address } from "viem"
import { postRequest } from "./requests"
import { API_URL } from "./config"

const SIGNATURE_URL = `${API_URL}/signature`
import { CHAIN_ID } from "./config"

export const requestSignature = (payload:{ poll:Address }) => postRequest(`${SIGNATURE_URL}/${CHAIN_ID}`, payload)