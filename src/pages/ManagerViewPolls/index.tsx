import React, { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Box } from "@mui/material"
import { Address, useAccount } from "wagmi"
import SVG from "react-inlinesvg"
import moment, { Moment } from "moment"

import SimpleTable from "../../components/SimpleTable"
import {
	getPollDetails,
	getUnclosedPolls,
} from "../../web3"
import { IExPoll } from "../SubmitPoll"
import { requestGetActivePollsByManager, requestGetFinishedPollsByManager, requestGetPollsByManager, requestGetComingPollsByManager } from "@/axios/poll"
import { useAlertError } from "@/hooks/useAlertError"

const ManagerViewPolls: React.FC = () => {
	const alertError = useAlertError()
	const navigate = useNavigate()
	const { address } = useAccount()
	const { type } = useParams<string>()
	const [polls, setPolls] = useState<IExPoll[]>()
	const [unclosedPolls, setUnclosedPolls] = useState<readonly Address[]>([])

	const fetchPolls = useCallback(() => {
		setPolls(undefined)
		const fetchData = (pollAddrs: readonly Address[]) => {
			for (const pollAddr of pollAddrs) {
				getPollDetails(pollAddr).then((data) => {
					if(data){
						const newPoll:IExPoll = {
							creator: address!,
							address: pollAddr,
							title: data.title,
							tokenAddress: data.tokenAddress,
							description: data.description,
							gasWallet: data.gasWallet,
							openTime: data.openTime,
							closeTime: data.closeTime,
							questions: [],
						}
						setPolls((prev) =>!prev? [newPoll]: !prev.find((ele:IExPoll) => ele.address === pollAddr )? [...prev, newPoll]: prev)
					}
				})
			}
		}

		if (type === "all") {
			requestGetPollsByManager().then(({ data }) => setPolls(data))
		} else if (type === "history") {
			requestGetFinishedPollsByManager().then(({ data }) => setPolls(data))
		} else if (type === "active") {
			requestGetActivePollsByManager().then(({ data }) => setPolls(data))
		} else if (type === "coming") {
			requestGetComingPollsByManager().then(({ data }) => setPolls(data))
		}
	}, [type, address])

	const fetchUnclosedPolls = useCallback(() => {
		if (type !== "history") {
			return
		}
		getUnclosedPolls()
			.then((data) =>
				setUnclosedPolls(data)
			)
			.catch(alertError)
	}, [type])

	useEffect(() => {
		if (address) {
			fetchPolls()
		}
	}, [type, address])

	useEffect(() => {
		if (address) {
			fetchUnclosedPolls()
		}
	}, [type, address])

	const handleClick = useCallback((pollAddr: Address) => {
		navigate(`/manager/poll-details/${pollAddr}`)
	}, [])

	const timeFormat = useCallback<(_: Moment) => string>(
		(date) => moment(date).format("L LT"),
	[]
	)

	console.log("polls ==>",polls)

	return (
		<Box p={2}>
			<h4 className="ps-3 pb-2 mb-2"> {type === "all" ? "All" : type === "history" ? "Historical" : type === "active" ? "Active":"Coming"}{" "}Polls</h4>
			<SimpleTable
				data={polls?.map((poll) => ({
					...poll,
					status: unclosedPolls.includes(poll.address) ? "Not closed" : "Closed",
				}))}
				headRows={[
					{
						id: "title",
						label: "Title",
					},
					{
						id: "openTime",
						label: "Poll Open",
						format: timeFormat,
					},
					{
						id: "closeTime",
						label: "Poll Close",
						format: timeFormat,
					},
					...(type === "history"
						? [
							{
								id: "status",
								label: "Status",
							},
						]
						: []),
				]}
				primaryKey="address"
				onClick={handleClick}
				icon={<SVG src="/media/svg/in.svg" />}
			/>
		</Box>
	)
}

export default ManagerViewPolls
