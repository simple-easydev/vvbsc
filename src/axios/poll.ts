import { Address } from "viem"
import { getRequest, postRequest, putRequest, secureGetReqeust } from "./requests"
import { API_URL } from "./config"

import { CHAIN_ID } from "./config"
const POLL_URL = `${API_URL}/polls/${CHAIN_ID}`

export const requestCheckAuth = (poll: Address) => getRequest(`${POLL_URL}/${poll}/check`)
export const requestUpdateWhitelist = (poll: Address, whitelist: Address[]) => putRequest(`${POLL_URL}/${poll}`, { whitelist })
export const requestCreateWhitelist = (poll: Address, whitelist: Address[]) => postRequest(`${POLL_URL}/${poll}`, { whitelist })

export const requestGetUnClosedPolls = () => secureGetReqeust(`${POLL_URL}/owner/all/unclosed`)
export const requestGetPolls = () => secureGetReqeust(`${POLL_URL}/owner/all`)

export const requestGetPollsByManager = () => secureGetReqeust(`${POLL_URL}/manager/all`)
export const requestGetActivePollsByManager = () => secureGetReqeust(`${POLL_URL}/manager/all/active`)
export const requestGetComingPollsByManager = () => secureGetReqeust(`${POLL_URL}/manager/all/coming`)
export const requestGetFinishedPollsByManager = () => secureGetReqeust(`${POLL_URL}/manager/all/finished`)


export const requestGetActivePollsForVoter = () => secureGetReqeust(`${POLL_URL}/voter/all/active`)
export const requestGetComingPollsForVoter = () => secureGetReqeust(`${POLL_URL}/voter/all/coming`)
export const requestGetFinishedPollsOfVoter = () => secureGetReqeust(`${POLL_URL}/voter/all/finished`)

export const requestCreatePoll = (payload:any) => postRequest(`${POLL_URL}`,payload)
export const requestUpdatePoll = (poll:Address, payload:any) => putRequest(`${POLL_URL}/${poll}`,payload)
export const requestVoteQuestion = (poll:Address, payload:any) => postRequest(`${POLL_URL}/${poll}/vote`,payload)

export const requestPollDetail = (poll:Address) => getRequest(`${POLL_URL}/${poll}`)
