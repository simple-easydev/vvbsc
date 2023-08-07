import React, {
	FormEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAlert } from "react-alert"
import { Box, Button, Card, CardContent, Theme, Typography, colors } from "@mui/material"
import { FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { makeStyles } from "@mui/styles"
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	DroppableProvided,
	DraggableProvided,
} from "react-beautiful-dnd"
import { Address, useAccount } from "wagmi"
import { arrayMoveImmutable } from "array-move"

import { requestVoteQuestion } from "../../axios/poll"
import { getPollDetails, getQuestions, signVoteApi } from "../../web3"
import { useAlertError, useDoing } from "../../hooks"
import { IQuestion, QuestionType } from "../SubmitQuestions"
import { Color } from "../../color"
import Loading from "../../components/Loading"
import ActionButton from "../../components/ActionButton"

const useStyles = makeStyles((theme:Theme) => ({
	container: {
		paddingLeft: 274,
		paddingRight: 24,
		[theme.breakpoints.down("sm")]: {
			paddingLeft: 84,
		},
	},
	question: {
		boxShadow: "0 0 10px rgb(0 0 0 / 30%)",
	},
	narratorText: {
		fontSize: 14,
	},
	group: {
		marginBottom: "1rem",
		marginLeft: "2rem",
	},
	radioBox: {
		"& *": {
			fontSize: 14,
			fontFamily: "inherit",
			"& :first-child": { color: Color.Primary },
		},
	},
	box: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginLeft: 24,
		marginTop: 11,
		marginBottom: 11,
		width: 20,
		height: 20,
		border: `1px solid ${Color.Primary}`,
		borderRadius: 3,
		fontSize: 14,
	},
	draggable: {
		fontSize: 14,
		marginLeft: 10,
		paddingTop: 5,
		paddingBottom: 5,
	},
}))

const VoteQuestions: React.FC = () => {
	const classes = useStyles()
	const navigate = useNavigate()
	const alertError = useAlertError()
	const { address } = useAccount()
	
	const { success: alertSuccess } = useAlert()
	const { poll } = useParams<{ poll:Address }>()
	const [title, setTitle] = useState<string>("")
	const [description, setDescription] = useState<string>("")
	const [questions, setQuestions] = useState<IQuestion[]>([])
	const [votes, setVotes] = useState<number[][]>([])
	const [isFetching, setBusyFetching, setFreeFetching] = useDoing()
	const [isSubmitting, setBusySubmitting, setFreeSubmitting] = useDoing()

	useEffect(() => {
		if (poll !== undefined && address) {
			setBusyFetching()
			getPollDetails(poll)
				.finally(setFreeFetching)
				.then((data) => {
					if(data){
						setTitle(data.title)
						setDescription(data.description)
						getQuestions(poll).then((questions) => {
							console.log("getQuestions ===>", questions)
							setQuestions(
								questions.map(({ text, kind, choices }: any) => ({
									text,
									type: Number(kind),
									choices,
								}))
							)
						})
					}
				})
				.catch()
		}
	}, [poll, address])

	useEffect(
		() =>
			setVotes(() => {
				const state = new Array(questions.length).fill([-1])
				for (let i = 0; i < state.length; i++) {
					if (questions[i].type === QuestionType.RankChoice) {
						const numChoices = questions[i].choices.length
						state[i] = Array.from(Array(numChoices).keys())
					}
				}
				return state
			}),
		[questions]
	)

	console.log("votes ==>", votes)

	const handleDragEnd = useCallback(
		(index: number) =>
			({ source, destination }: DropResult) => {
				if (!destination) {
					return
				}

				if (destination.index === source.index) {
					return
				}

				const numChoices = questions[index].choices.length
				const tempArr = votes[index].length > 0 ? Array.from(votes[index]):Array.from(Array(numChoices).keys())
				const newData = arrayMoveImmutable(tempArr, source.index, destination.index)

				setVotes((prev) =>
					prev.map((q:number[], idx:number) => {
						if(index == idx) {
							prev[index] = newData
							return prev[index]
						}
						return q
					})
				)
			},
		[questions, votes]
	)

	const reorderedVotes = useCallback((choices: string[], orders: number[] = []) => {

		const numChoices = choices.length
		orders = orders.length > 0 ? Array.from(orders):Array.from(Array(numChoices).keys())
		const result: string[] = new Array(choices.length)
		for (let i = 0; i < choices.length; i++) {
			result[i] = choices[orders[i]]
		}
		return result
	}, [votes])

	const isAllVoted = useMemo(() => votes.every((q) => q.length >= 0), [votes])

	const handleSubmit = useCallback<FormEventHandler>(
		async (e) => {
			e.preventDefault()

			console.log("votes ==>", votes)

			if (poll !== undefined && isAllVoted && address) {
				setBusySubmitting()

				// sign vote signature
				const { vote_signature, nonce, amount } = await signVoteApi(poll)
				
				requestVoteQuestion(poll, { vote_signature, votes, nonce, amount }).then((res)=>{
					setFreeSubmitting()
					alertSuccess("Vote summited.")
					navigate("/voter/home")
				}).catch(alertError)
			}
		}, 
		[poll, isAllVoted, votes, address]
	)

	return (
		<Box sx = {{ p:2 }}>
			<form onSubmit={handleSubmit}>
				<Box>
					<Typography variant="h4">{title}</Typography>
					<Typography variant="h6">{description}</Typography>
				</Box>
				{isFetching ? (
					<Box>
						<Loading />
					</Box>
				) : (
					<Box display={"flex"} gap={2} flexDirection={"column"}>
						{questions.map((question, index) => (
							<Card key={index}>
								<CardContent>
									<Typography fontWeight={"bold"} variant="body1">
										{index + 1}. {question.text}
									</Typography>
									<Typography fontWeight={"bold"} color={colors.green[600]} variant="body2">
										{question.type === QuestionType.RankChoice
											? "Arrange Your Preferences from First to Last. Place Your First Choice on Top, Last Choice on Bottom."
											: "Please Select 1 Answer, Below."}
									</Typography>
									{question.type === QuestionType.RankChoice ? (
										<Box display={"flex"} alignItems={"center"}>
											<div>
												{question.choices.map((value, idx) => (
													<span key={idx} className={classes.box}>
														{idx + 1}
													</span>
												))}
											</div>
											<DragDropContext onDragEnd={handleDragEnd(index)}>
												<Droppable droppableId={`question-${index}`}>
													{(provided: DroppableProvided) => (
														<div
															ref={provided.innerRef}
															{...provided.droppableProps}
														>
															{reorderedVotes(
																question.choices,
																votes[index]
															).map((choice, idx) => (
																<Draggable
																	key={idx}
																	draggableId={`choice-${idx}`}
																	index={idx}
																>
																	{(provided: DraggableProvided) => (
																		<div
																			className={classes.draggable}
																			ref={provided.innerRef}
																			{...provided.draggableProps}
																			{...provided.dragHandleProps}
																		>
																			{choice}
																		</div>
																	)}
																</Draggable>
															))}

															{provided.placeholder}
														</div>
													)}
												</Droppable>
											</DragDropContext>
										</Box>
									) : (
										<RadioGroup
											sx = {{ ml:2, mb:1 }}
											name={"" + index}
											value={votes[index] === undefined ? -1 : votes[index][0]}
											onChange={(e, value) => {
												setVotes((prev) =>
													prev.map((q:number[], idx:number) => {
														if(index == idx) {
															prev[index] = [+value]
															return prev[index]
														}
														return q
													})
												)
											}}
										>
											{question.choices.map((choice, idx) => (
												<FormControlLabel
													key={idx}
													// className={classes.radioBox}
													value={idx}
													control={<Radio color="primary" />}
													label={choice}
												/>
											))}
										</RadioGroup>
									)}
								</CardContent>
							</Card>
						))}
					</Box>
				)}

				<Box display={"flex"} justifyContent={"end"} mt={2}  gap={2}>
					<ActionButton
						type="submit"
						disabled={isFetching || isSubmitting || !isAllVoted}
						isBusy={isSubmitting}
					>Submit
					</ActionButton>
					<Button
						variant="contained"
						disabled={isFetching || isSubmitting}
						onClick={() => navigate("/voter/home")}
					> Cancel
					</Button>
				</Box>
			</form>
		</Box>
	)
}

export default VoteQuestions
