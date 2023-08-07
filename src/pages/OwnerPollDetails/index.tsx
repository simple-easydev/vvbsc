import React, {
	FormEventHandler,
	useCallback,
	useEffect,
	useState,
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAlert } from "react-alert"
import { Button, Grid, Box, Card, CardContent } from "@mui/material"
import smartTruncate from "smart-truncate"
import moment, { Moment } from "moment"

import { useAlertError, useDoing } from "../../hooks"
import { closePoll, getPollDetails, getUnclosedPolls } from "../../web3"
import { Address } from "viem"
import Loading from "../../components/Loading"
import ActionButton from "../../components/ActionButton"
import CopyToClipboardButton from "../../components/CopyToClipboardButton"

import { useAccount } from "wagmi"

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

	const fetchData = useCallback(() => {
		if (poll !== undefined && address) {
			setBusyFetching()
			getPollDetails(poll)
				.finally(setFreeFetching)
				.then((data) => {
					if(data){
						setTitle(data.title)
						setTokenAddress(data.tokenAddress)
						setDescription(data.description)
						setOpenTime(data.openTime)
						setCloseTime(data.closeTime)
					}
				})
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
