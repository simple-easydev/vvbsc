import React, { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Theme, Box, Typography } from "@mui/material"
import { CheckCircle } from "@mui/icons-material"
import { makeStyles } from "@mui/styles"
import { useAccount } from "wagmi"
import SVG from "react-inlinesvg"
import moment from "moment"
import smartTruncate from "smart-truncate"

import { requestGetActivePollsForVoter, requestGetComingPollsForVoter, requestGetFinishedPollsOfVoter } from "../../axios/poll"
import { IExPoll } from "../SubmitPoll"
import SimpleTable from "../../components/SimpleTable"
import { isVoted, signVoteApi } from "@/web3"

const useStyles = makeStyles((theme:Theme) => ({
	container: {
		paddingLeft: 262,
		[theme.breakpoints.down("sm")]: { paddingLeft: 72 },
	},
	vote: {
		width: 24,
		height: 24,
	},
}))

const VoterHome: React.FC = () => {
	const classes = useStyles()
	const navigate = useNavigate()
	const { address } = useAccount()
	const { type } = useParams<string>()
	const [polls, setPolls] = useState<IExPoll[]>()

	const fetchPolls = useCallback(async () => {
		if (address) {
			setPolls(undefined)
			if (type === "active") {
				const { data } = await requestGetActivePollsForVoter()
				for(let i = 0; i < data.length; i++){
					const poll = data[i]
					poll.isVoted = await isVoted(poll.address)
				}
				setPolls(data)

				// requestGetActivePollsForVoter().then(({ data }) => async {
				// 	data.forEach((element:IExPoll) => {
				// 		// element.
				// 		element.isVoted = await isVoted(element.address)
						
						
				// 	})
				// 	setPolls(data)
				// })
			} else if (type === "coming") {
				requestGetComingPollsForVoter().then(({ data }) => setPolls(data))
			} else if (type === "history") {
				requestGetFinishedPollsOfVoter().then(({ data }) => setPolls(data))
			}
		}
	}, [type, address])

  
	useEffect(() => {
		if (address) {
			fetchPolls()
		}
	}, [type, address])

	const handleClick = useCallback((id: number) => {
		navigate(`/voter/vote/${id}`) 
	}, [])

	const timeFormat = useCallback<(_: Date) => string>(
		(date) => moment(date).format("L LT"),
	[])

	const checkMarkFormat = useCallback((val:boolean) => {
		if(val){
			return <CheckCircle color="success" />
		}
		return ""
	},
	[])

	const descFormat = useCallback<(_: string) => string>(
		(desc) => smartTruncate(desc, 20),
	[]
	)

	// test func
	// const func =async () => {
	// 	const { signature, nonce, amount } = await signVoteApi("0x6270A0ba9e3192e68b6cc6703844a0b1665d92fd")
	// 	console.log(signature)
	// 	console.log(nonce)
	// 	console.log(amount)
	// }
	// func()

	console.log("polls ===>", polls)

	return (
		<Box sx = {{ p:2 }}>
			<Typography textTransform={"capitalize"} variant="h5">{ type } Polls</Typography>
			<SimpleTable
				data={polls}
				headRows={[
					{
						id: "title",
						label: "Title",
					},
					{
						id: "description",
						label: "Description",
						format: descFormat,
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
					{
						id: "isVoted",
						label: "Voted",
						format: checkMarkFormat,
					},
				]}
				primaryKey="address"
				onClick={type === "active" ? handleClick : undefined}
				icon={
					type === "active" ? (
						<SVG className={classes.vote} src="/media/svg/vote.svg" />
					) : undefined
				}
			/>
		</Box>
	)
}

export default VoterHome
