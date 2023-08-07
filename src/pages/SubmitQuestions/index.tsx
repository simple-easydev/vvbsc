import React, {
	ChangeEventHandler,
	FocusEventHandler,
	FormEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAlert } from "react-alert"
import { Box, Button, Divider, MenuItem,  Grid, Select, TextField, Theme, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useAccount, Address } from "wagmi"

import {
	approveTokensForQuestion,
	createQuestion,
	deleteQuestion,
	getQuestionDetails,
	updateQuestion,
} from "../../web3"
import { useAlertError, useDoing } from "../../hooks"
import { Color } from "../../color"
import MultipleChoiceInput from "../../components/MultipleChoiceInput"
import Loading from "../../components/Loading"
import ActionButton from "../../components/ActionButton"

export enum QuestionType {
  YesNo,
  MultipleChoice,
  RankChoice,
}

export interface IQuestion {
  text: string;
  type: QuestionType;
  choices: string[];
}

export interface IVoteAnswer {
	createdAt: bigint;
	votor: `0x${string}`;
	answers: readonly (readonly bigint[])[];
}

const useStyles = makeStyles((theme:Theme) => ({
	container: {
		paddingLeft: 262,
		[theme.breakpoints.down("sm")]: { paddingLeft: 72 },
	},
	form: {
		// width: 700,
	},
	header: {
		borderBottom: `1px solid ${Color.Border}`,
	},
	progress: {
		height: 10,
	},
}))

const initialState = {
	text: "",
	type: QuestionType.YesNo,
	choices: ["Yes", "No"],
}

const SubmitQuestions: React.FC = () => {
	const classes = useStyles()
	const navigate = useNavigate()
	const alertError = useAlertError()
	const { address } = useAccount()
	
	const { success: alertSuccess } = useAlert()
	const params = useParams<string>()
	const poll = params.poll as Address
	const questionId = params.questionId

	const [curQuestion, setCurQuestion] = useState<IQuestion>(initialState)
	const [orgQuestion, setOrgQuestion] = useState<IQuestion>()
	const [curChoice, setCurChoice] = useState<string>("")
	const [isSubmitting, setBusySubmitting, setFreeSubmitting] = useDoing()
	const [isDeleting, setBusyDeleting, setFreeDeleting] = useDoing()
	const [isFetching, setBusyFetching, setFreeFetching] = useDoing()

	const isBusy = useMemo(
		() => isSubmitting || isDeleting || isFetching,
		[isSubmitting, isDeleting, isFetching]
	)

	const fetchQuestion = useCallback(() => {
		if (poll !== undefined && questionId !== undefined && address) {
			setBusyFetching()
			getQuestionDetails(poll as Address, +questionId)
				.finally(setFreeFetching)
				.then(({ text, kind, choices }) => {
					setOrgQuestion({ text, type: Number(kind), choices:[...choices] })
				})
				.catch(() => {
					setCurQuestion(initialState)
					setOrgQuestion(undefined)
				})
		} 
	}, [poll, questionId, address])

  
	useEffect(() => {
		if (address) {
			fetchQuestion()
		}
	}, [questionId, address])

	useEffect(() => {
		if (orgQuestion) {
			setCurQuestion(orgQuestion)
		}
	}, [orgQuestion])

	const handleSubmit = useCallback<FormEventHandler>(
		async (e) => {
			e.preventDefault()
			if (poll !== undefined && questionId !== undefined && address) {
				setBusySubmitting()
				try {
					if (!orgQuestion) {
						await approveTokensForQuestion(poll)
						await createQuestion(poll, curQuestion)
					} else {
						await updateQuestion(poll, +questionId, curQuestion)
					}
					alertSuccess("Question submitted.")
					navigate(`/manager/submit-questions/${poll}/${+questionId + 1}`)
				} catch (err) {
					console.log(err)
					alertError(err as Error)
				} finally {
					setFreeSubmitting()
				}
			}
		}, 
		[poll, questionId, curQuestion, orgQuestion, address]
	)

	const handleDelete = useCallback(() => {
		if (poll !== undefined && questionId !== undefined && address) {
			setBusyDeleting()
			deleteQuestion(poll, +questionId)
				.finally(setFreeDeleting)
				.then(() => fetchQuestion())
				.catch(alertError)
		} 
	}, [poll, questionId])

	const handleChangeText = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
		({ target: { value: text } }) =>
			setCurQuestion((prev) => ({ ...prev, text })),
		[]
	)

	const handleChangeType = useCallback(({ target: { value } }:any) => {
		setCurQuestion((prev) => (
			{...prev, type: +value, choices:+value === QuestionType.YesNo
				? ["Yes", "No"]
				: prev.type !== QuestionType.YesNo
					? prev.choices
					: [],
			}))
	},[])

	const handleChangeChoiceText = useCallback<(_: number) => ChangeEventHandler<HTMLInputElement>>(
		(index) =>
			({ target: { value } }) =>
				setCurQuestion((prev) => ({
					...prev,
					choices: prev.choices.map((choice, idx) =>
						index === idx ? value : choice
					),
				})),
	[]
	)

	const handleRemoveChoice = useCallback<(_: number) => () => void>(
		(index) => () =>
			setCurQuestion((prev) => ({
				...prev,
				choices: [
					...prev.choices.slice(0, index),
					...prev.choices.slice(index + 1),
				],
			})),
	[]
	)

	const handleChangeCurChoiceText = useCallback(({ target: { value } }:any) => setCurChoice(value), [])

	const handleAddChoice = useCallback<() => void>(() => {
		if (curChoice) {
			setCurQuestion((prev) => ({
				...prev,
				choices: [...prev.choices, curChoice],
			}))
			setCurChoice("")
		}
	}, [curChoice])

	const [touched, setTouched] = useState<{ [k: string]: boolean }>({})

	const handleBlur = useCallback<FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>>(({ target: { name } }) => {
		setTouched((prev) => ({ ...prev, [name]: true }))
	}, [])

	return (
		<Box sx = {{ p:2 }}>
			<form
				className={`${classes.form} form-detail m-auto`}
				onSubmit={handleSubmit}
			>
				<Typography variant="h5" sx = {{ mb:2 }}>Questions</Typography>
				<Divider />
				{isFetching ? (
					<Grid className="mb-3">
						<div className="col-xs-12 mb-1 d-flex justify-content-center">
							<Loading color="gray" />
						</div>
					</Grid>
				) : (
					<Box sx={{ display:"flex", gap:1, flexDirection:"column" }}>
						<Box sx = {{ mt:2 }}>
							<Typography variant="body1"> Question {questionId ? +questionId + 1 : 1} </Typography>
							<TextField
								sx = {{ width:"100%", mt:1 }}
								name="text"
								multiline
								minRows={4}
								placeholder="ex: Do you think bitcoin price will rise tomorrow?"
								value={curQuestion.text}
								onChange={handleChangeText}
								onBlur={handleBlur}
								error={touched.text && !curQuestion.text}
								helperText={"Field is required"}
							/>
						</Box>

						<Grid container>
							<Grid item md = {3}>
								<Typography variant="body1">Question Type</Typography>
							</Grid>
							<Grid item md = {9}>
								<Select
									sx = {{ width:"100%" }}
									value={curQuestion.type}
									onChange={handleChangeType}
								>
									<MenuItem value={QuestionType.YesNo}>Yes/No Question</MenuItem>
									<MenuItem value={QuestionType.MultipleChoice}> Multiple Choice</MenuItem>
									<MenuItem value={QuestionType.RankChoice}>Rank Choice</MenuItem>
								</Select>
							</Grid>
						</Grid>

						{curQuestion.type !== QuestionType.YesNo && (
							<Grid container>
								<Grid item md = {3} >
									<Typography variant="body1">Choices</Typography>
								</Grid>
								<Grid item md = {9}>
									<Box sx = {{ display:"flex", flexDirection:"column", gap:1 }}>
										{curQuestion.choices.map((choice, index) => (
											<MultipleChoiceInput
												key = {index}
												action="minus"
												onAction={handleRemoveChoice(index)}
												value={choice}
												onChange={handleChangeChoiceText(index)}
											/>
										))}
										<MultipleChoiceInput
											action="plus"
											onAction={handleAddChoice}
											value={curChoice}
											onChange={handleChangeCurChoiceText}
										/>
									</Box>
								</Grid>
							</Grid>
						)}
					</Box>
				)}

				<Box sx = {{ display:"flex", justifyContent:"end", gap:1, mt:1 }}>
					{!!orgQuestion && (
						<ActionButton
							color="error"
							disabled={isBusy}
							isBusy={isDeleting}
							onClick={handleDelete}
						> Delete
						</ActionButton>
					)}
					<ActionButton
						type="submit"
						disabled={isBusy}
						isBusy={isSubmitting}
					> Submit
					</ActionButton>
					{questionId !== undefined && +questionId > 0 && (
						<Button
							variant="contained"
							disabled={isBusy}
							onClick={() =>
								navigate(
									`/manager/submit-questions/${poll}/${+questionId - 1}`
								)
							}
						> Prev
						</Button>
					)}
					{!!orgQuestion && (
						<Button
							variant="contained"
							disabled={isBusy}
							onClick={() => {
								if (questionId !== undefined) {
									navigate(
										`/manager/submit-questions/${poll}/${+questionId + 1}`
									)
								}
							}}
						> Next
						</Button>
					)}
					<Button
						variant="contained"
						disabled={isBusy}
						onClick={() => navigate("/manager/view/all")}
					> Finish
					</Button>
				</Box>
			</form>
		</Box>
	)
}

export default SubmitQuestions
