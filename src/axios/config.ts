export const API_URL = process.env.REACT_APP_BASE_API_URL
export const CHAIN_ID = process.env.REACT_APP_CHAIN_ID || "56"
export const T_SYMBOL = CHAIN_ID == "56"?"BNB":CHAIN_ID == "97"?"TBNB":CHAIN_ID == "137"?"MATIC":"UNKNOW"