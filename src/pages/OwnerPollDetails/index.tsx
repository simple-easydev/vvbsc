import React, {
	FormEventHandler,
	useCallback,
	useEffect,
	useState,
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAlert } from "react-alert"
import { Button, Grid, Box, Card, CardContent, Typography, List, ListItem } from "@mui/material"
import smartTruncate from "smart-truncate"
import moment, { Moment } from "moment"

import { useAlertError, useDoing } from "../../hooks"
import { closePoll, getPollDetails, getQuestions, getUnclosedPolls, getVoteResult } from "../../web3"
import { Address } from "viem"
import Loading from "../../components/Loading"
import ActionButton from "../../components/ActionButton"
import CopyToClipboardButton from "../../components/CopyToClipboardButton"

import { useAccount } from "wagmi"
import { requestPollDetail } from "@/axios/poll"
import { IQuestion, IVoteAnswer } from "../SubmitQuestions"
import VoteResultTable from "./VoteResultTable"

const OwnerPollDetails: React.FC = () => {
	const navigate = useNavigate()
	const alertError = useAlertError()
	const { address } = useAccount()
	const { success: alertSuccess } = useAlert()
	const { poll } = useParams<{poll:Address}>()
	const [title, setTitle] = useState<string>("")
	const [tokenAddress, setTokenAddress] = useState<Address>("0x00")
	const [description, setDescription] = useState<string>("")
	const [openTime, setOpenTime] = useState<Moment>()
	const [closeTime, setCloseTime] = useState<Moment>()
	const [isClosed, setClosed] = useState<boolean>()
	const [isBusyFetching, setBusyFetching, setFreeFetching] = useDoing()
	const [isClosing, setBusyClosing, setFreeClosing] = useDoing()
	const [pollCreator, setPollCreator] = useState<Address>()
	const [voteResult, setVoteResult] = useState<readonly IVoteAnswer[]>([])
	const [questions, setQuestions] = useState<IQuestion[]>([])

	const fetchData = useCallback(async () => {
		if (poll !== undefined && address) {
			setBusyFetching()
			getPollDetails(poll)
				.finally(setFreeFetching)
				.then((data) => {
					if(data){
						console.log("data ===>", data)
						setTitle(data.title)
						setTokenAddress(data.tokenAddress)
						// setPollCreator(data.manager)
						setDescription(data.description)
						setOpenTime(data.openTime)
						setCloseTime(data.closeTime)


						getQuestions(poll).then(async (questions) => {
							const newQuestions = questions.map(
								({ text, kind, choices }: any) => ({
									text,
									type: Number(kind),
									choices,
								})
							)
							setQuestions(newQuestions)
						})
					}
				})

			const res =  await requestPollDetail(poll)
			const polldetail = res.data
			const voteR = await getVoteResult(poll, polldetail.creator)
			console.log("voteResult ==>", voteR)
			setVoteResult(voteR)
		} 
	}, [poll, address])

	const fetchUnclosedPolls = useCallback(
		() => {
			if (poll !== undefined && address) {
				getUnclosedPolls()
					.then((data) =>
						setClosed(
							!data.includes(poll)
						)
					)
					.catch(alertError)
			}
		}, 
		[poll, address]
	)

  
	useEffect(() => {
		if (address) {
			fetchData()
		}
	}, [poll, address])

  
	useEffect(() => {
		if (address) {
			fetchUnclosedPolls()
		}
	}, [poll, address])

	const handleClose = useCallback(
		() => {
			if (poll !== undefined && address) {
				setBusyClosing()
				closePoll(poll)
					.finally(setFreeClosing)
					.then(() => {
						setClosed(true)
						alertSuccess("Successfully closed.")
					})
					.catch(alertError)
			}
		}, 
		[poll, address]
	)

	const handleSubmit = useCallback<FormEventHandler>((e) => {
		e.preventDefault()
	}, [])

	return (
		<Box sx = {{ p:2 }}>
			<form className="m-auto" onSubmit={handleSubmit}>
				<h4 className="form-header mb-4">Poll Details (ID: {poll})</h4>
				{isBusyFetching ? (
					<Grid>
						<div className="col-xs-12 mb-1 d-flex justify-content-center">
							<Loading color="gray" />
						</div>
					</Grid>
				) : (
					<Box display={"flex"} flexDirection={"column"} gap={2}>
						<Card>
							<CardContent>
								<Grid container>
									<Grid item xs>
										<label>Title:</label>
									</Grid>
									<Grid item xs>
										<div>{title}</div>
									</Grid>
								</Grid>
								<Grid container>
									<Grid item xs>
										<label>Token Address:</label>
									</Grid>
									<Grid item xs>
										<div>
											{smartTruncate(tokenAddress, 9, { position: 5 })}
											<CopyToClipboardButton className="ms-2" text={tokenAddress} />
										</div>

									</Grid>
								</Grid>

								<Grid container>
									<Grid item xs>
										<label>Description:</label>
									</Grid>
									<Grid item xs>
										<div>{description}</div>
									</Grid>
								</Grid>

								<Grid container>
									<Grid item xs>
										<label>Open{openTime && openTime.isBefore(moment()) && "ed"} Time:</label>
									</Grid>
									<Grid item xs>
										<div>
											{moment(openTime).format("L LT")}
										</div>
									</Grid>
								</Grid>

								<Grid container>
									<Grid item xs>
										<label> Close{closeTime && closeTime.isBefore(moment()) && "d"} Time:</label>
									</Grid>
									<Grid item xs>
										<div>
											{moment(closeTime).format("L LT")}
										</div>
									</Grid>
								</Grid>
							</CardContent>
						</Card>

						{questions.map((question, index) => (
							<Card key={index}>
								<CardContent>
									<Grid container>
										<Grid item md = {3}>
											<Typography variant="body1">
											Question {index + 1}:
											</Typography>
										</Grid>
										<Grid item md = {9}>
											<Typography>{question.text}</Typography>
											<List sx = {{ listStyleType: "disc", ml:4 }}>
												{question.choices.map((text, idx) => (
													<ListItem
														disablePadding
														sx = {{ display:"list-item"}}
														key={idx}
													>
														{text}
													</ListItem>
												))}
											</List>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						))}

						<Card>
							<CardContent>
								<VoteResultTable data={voteResult} questions={questions}/>
							</CardContent>
						</Card>
					</Box>
				)}

				<Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} m={4}>
					{isClosed === false && (
						<ActionButton
							color="error"
							type="submit"
							isBusy={isClosing}
							disabled={isBusyFetching}
							onClick={handleClose}
						>Close
						</ActionButton>
					)}
					<Button
						className="btn-rounded px-4 py-2"
						variant="contained"
						type="button"
						onClick={() => navigate("/owner/view/all")}
					>Cancel
					</Button>
				</Box>
			</form>
		</Box>
	)
}

export default OwnerPollDetails
