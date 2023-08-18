import React, {
	FormEventHandler,
	useCallback,
	useEffect,
	useState,
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAlert } from "react-alert"
import { Button, Box, Grid, Card, Typography, List, ListItem, CardContent } from "@mui/material"
import smartTruncate from "smart-truncate"
import moment, { Moment } from "moment"

import { useAlertError, useDoing } from "../../hooks"
import {
	closePoll,
	getPollDetails,
	getQuestions,
	getUnclosedPolls,
	getVoteResult,
} from "../../web3"
import { IQuestion, IVoteAnswer } from "../SubmitQuestions"
import Loading from "../../components/Loading"
import ActionButton from "../../components/ActionButton"
import CopyToClipboardButton from "../../components/CopyToClipboardButton"

import { useAccount } from "wagmi"
import { Address } from "viem"



const ManagerPollDetails: React.FC = () => {
	const navigate = useNavigate()
	const alertError = useAlertError()
	const { success: alertSuccess } = useAlert()
	const { poll } = useParams<{ poll: Address }>()
	const [title, setTitle] = useState<string>("")
	const [tokenAddr, setTokenAddr] = useState<Address>("0x0")
	const [description, setDescription] = useState<string>("")
	const [openTime, setOpenTime] = useState<Moment>()
	const [closeTime, setCloseTime] = useState<Moment>()
	const [questions, setQuestions] = useState<IQuestion[]>([])
	const [result, setResult] = useState<readonly IVoteAnswer[]>([])
	const [isClosed, setClosed] = useState<boolean>()
	const [isBusyFetching, setBusyFetching, setFreeFetching] = useDoing()
	const [isClosing, setBusyClosing, setFreeClosing] = useDoing()
	const { address } = useAccount()

	const fetchData = useCallback(async () => {
		if (poll !== undefined) {
			setBusyFetching()
			getPollDetails(poll)
				.finally(setFreeFetching)
				.then((data) => {
					if(!data) return
					setTitle(data.title)
					setTokenAddr(data.tokenAddress)
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
				})
			const voteResult = await getVoteResult(poll)
			console.log("voteResult ==>", voteResult)
			setResult(voteResult)


		} 
	}, [poll, address])

	const fetchUnclosedPolls = useCallback(
		() => {
			if (poll !== undefined) {
				const pollAddress = poll as Address
				getUnclosedPolls()
					.then((data) =>
						setClosed(
							!data.includes(pollAddress)
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

	const reorderedChoices = useCallback(
		(index: number) => {

			const question = questions[index]

			const getPoints = (qIndex:number, aIndex:number, qType:number) => {
				return result.reduce((acc, curObj, index)=>{
					if(curObj.answers.length > 0){
						const ansR = curObj.answers[qIndex]
						const pos = ansR.indexOf(BigInt(aIndex))
						if(pos>-1){
							if(qType == 2){
								return acc + (5 - pos)
							}
							return acc + 1
						}
					}
					return acc
				},0)
			}
			
			const data: { text: string; weight: number }[] = []
			
			for (let i = 0; i < question.choices.length; i++) {
				data.push({
					text: question.choices[i],
					weight: getPoints(index, i, question.type),
				})
			}

			return data.sort((a, b) => b.weight - a.weight)
		}, 
		[questions, result]
	)

	console.log("questions ==>", questions)

	const handleClose = useCallback(
		() => {
			if (poll !== undefined) {
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
		[poll]
	)

	const handleSubmit = useCallback<FormEventHandler>((e) => {
		e.preventDefault()
	}, [])

	return (
		<Box sx = {{ p:2 }}>
			<form className="m-auto" onSubmit={handleSubmit}>
				<h4 className="form-header mb-4">Poll Details (ID: {poll})</h4>
				{isBusyFetching ? (
					<Grid className="mb-3">
						<div className="col-xs-12 mb-1 d-flex justify-content-center">
							<Loading color="gray" />
						</div>
					</Grid>
				) : (
					<Box display="flex" flexDirection="column" gap={2}>
						<Card>
							<CardContent>
								<Grid container>
									<Grid item md = {3}>
										<label>Title:</label>
									</Grid>
									<Grid item md = {9}>
										<Typography variant="body1">{title}</Typography>
									</Grid>
								</Grid>

								<Grid container>
									<Grid item md = {3}>
										<label>Token Address:</label>
									</Grid>
									<Grid item md = {9}>
										<Typography variant="body1">
											{smartTruncate(tokenAddr, 9, { position: 5 })}
											<CopyToClipboardButton className="ms-2" text={tokenAddr} />
										</Typography>
									</Grid>
								</Grid>

								<Grid container>
									<Grid item md = {3}>
										<label>Description:</label>
									</Grid>
									<Grid item md = {9}>
										{description}
									</Grid>
								</Grid>

								<Grid container>
									<Grid item md = {3}>
										<label>Open{openTime && openTime.isBefore(moment()) && "ed"} Time:</label>
									</Grid>
									<Grid item md = {9}>
										{moment(openTime).format("L LT")}
									</Grid>
								</Grid>

								<Grid container>
									<Grid item md = {3}> Close{closeTime && closeTime.isBefore(moment()) && "d"} Time:</Grid>
									<Grid item md = {9}>{moment(closeTime).format("L LT")}</Grid>
								</Grid>

								<Grid container>
									<Grid item md = {3}> Voter Count:</Grid>
									<Grid item md = {9}>{result.length}</Grid>
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
												{reorderedChoices(index).map(({ text, weight }, idx) => (
													<ListItem
														disablePadding
														sx = {{ display:"list-item"}}
														key={idx}
														className={
															(idx === 0 && weight > 0 ? "text-primary " : "") +"my-1"
														}
													>
														{text} ({weight})
													</ListItem>
												))}
											</List>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						))}
					</Box>
				)}

				<Box display="flex" justifyContent="end" gap = {2} mt={2}>
					{closeTime && closeTime.isAfter(moment()) ? (
						<Button
							variant="contained"
							type="submit"
							disabled={isBusyFetching}
							onClick={() => navigate(`/manager/submit-poll/${poll}`)}
						> Edit
						</Button>
					) : (
						isClosed === false && (
							<ActionButton
								color="error"
								type="submit"
								isBusy={isClosing}
								disabled={isBusyFetching}
								onClick={handleClose}
							> Close
							</ActionButton>
						)
					)}
					<Button variant="contained" onClick={() => navigate("/manager/view/all")}> Cancel</Button>
				</Box>
			</form>
		</Box>
	)
}

export default ManagerPollDetails
