import { getRequest, postRequest, putRequest } from "./requests"
import { API_URL } from "./config"

import { CHAIN_ID } from "./config"
const FEE_URL = `${API_URL}/fee/${CHAIN_ID}`

export const getAllFeeList = () => getRequest(`${FEE_URL}`)
export const requestUpdateFeeWhitelist = (payload:any) => putRequest(`${FEE_URL}`, payload)
export const requestCreateFeeWhitelist = (payload:any) => postRequest(`${FEE_URL}`, payload)