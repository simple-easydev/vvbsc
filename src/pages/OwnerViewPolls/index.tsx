import React, { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Theme } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { Address, useAccount } from "wagmi"
import SVG from "react-inlinesvg"
import moment from "moment"

import SimpleTable from "../../components/SimpleTable"
import { IExPoll } from "../SubmitPoll"
import { requestGetPolls, requestGetUnClosedPolls } from "@/axios/poll"

const OwnerViewPolls: React.FC = () => {
	const navigate = useNavigate()
  
	const { address } = useAccount()
	

	const { type } = useParams<string>()
	const [polls, setPolls] = useState<IExPoll[]>()

	const fetchPolls = useCallback(() => {
		setPolls(undefined)
		if (type === "all") {
			requestGetPolls().then(({ data }) => setPolls(data))
		} else if (type === "unclosed") {
			requestGetUnClosedPolls().then(({ data }) => setPolls(data))
		}
	}, [type, address])

  
	useEffect(() => {
		if (address) {
			fetchPolls()
		}
	}, [type, address])

	const handleClick = useCallback((poll: Address) => {
		navigate(`/owner/poll-details/${poll}`) 
	}, [])

	const timeFormat = useCallback<(_: Date) => string>(
		(date) => moment(date).format("L LT"),
	[]
	)

	return (
		<Box sx = {{p:2}}>
			<h4 className="ps-3 pb-2 mb-2">
				{type === "all" ? "All" : "Unclosed"} Polls
			</h4>
			<SimpleTable
				data={polls}
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
				]}
				primaryKey="address"
				onClick={handleClick}
				icon={<SVG src="/media/svg/in.svg" />}
			/>
		</Box>
	)
}

export default OwnerViewPolls
