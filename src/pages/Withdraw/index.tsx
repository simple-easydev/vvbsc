import React, {
	ChangeEventHandler,
	FormEventHandler,
	useCallback,
	useEffect,
	useState,
} from "react"
import { Button, Box, FormControl, Grid, TextField, Theme } from "@mui/material"
import { makeStyles } from "@mui/styles"

import { useAlertError, useDoing } from "../../hooks"
import {
	withdraw,
} from "../../web3"
import { Color } from "../../color"
import ActionButton from "../../components/ActionButton"

import { useAccount } from "wagmi"
import { T_SYMBOL } from "@/axios/config"

const useStyles = makeStyles((theme:Theme) => ({
	container: {
		paddingLeft: 274,
		paddingRight: 24,
		[theme.breakpoints.down("sm")]: {
			paddingLeft: 84,
		},
	},
	maxBtn: {
		borderColor: Color.Primary,
		color: Color.Primary,
		fontSize: 13,
		borderRadius: 11,
		"&:hover": {
			backgroundColor: Color.Primary,
			borderColor: Color.Primary,
		},
	},
	maxBtnLess: {
		borderColor: Color.Primary,
		color: Color.Primary,
	},
	maxBtnEqual: {
		backgroundColor: Color.Primary,
		borderColor: Color.Primary,
		color: "white",
	},
	input: {
		maxWidth: 100,
	},
}))

const Withdraw: React.FC = () => {
	const classes = useStyles()
	const alertError = useAlertError()
	const { address } = useAccount()
	
	const [totalBalance, setTotalBalance] = useState<number>(0)
	const [withdrawableAmount, setWithdrawableAmount] = useState<number>(0)
	const [withdrawAmount, setWithdrawAmount] = useState<number>(0)
	const [isWithdrawing, setBusyWithdrawing, setFreeWithdrawing] = useDoing()

	const fetchData = useCallback(
		() => {
			// if (address) {
			// 	getContractBalance().then(setTotalBalance).catch(alertError)
			// 	getWithdrawableAmount()
			// 		.then(setWithdrawableAmount)
			// 		.catch(alertError)
			// }
		}, 
		[address]
	)

	
	useEffect(() => {
		if (address) {
			fetchData()
		}
	}, [address])

	const handleChangeWithdrawAmount = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(({ target: { value } }) => setWithdrawAmount(+value), [])

	const handleClickMax = useCallback(() => {
		setWithdrawAmount(withdrawableAmount)
	}, [withdrawableAmount])

	const handleSubmit = useCallback<FormEventHandler>(
		(e) => {
			if(address){
				e.preventDefault()
				setBusyWithdrawing()
				withdraw(withdrawAmount)
					.finally(setFreeWithdrawing)
					.then(() => {
						fetchData()
						setWithdrawAmount(0)
					})
					.catch(alertError)
			}
		}, 
		[withdrawAmount, address]
	)

	return (
		<Box sx = {{ p:2 }}>
			<form className="m-auto" onSubmit={handleSubmit}>
				<h4>Widthdraw {T_SYMBOL}</h4>
				<Box display={"flex"} flexDirection={"column"} gap={2}>
					<Grid container>
						<Grid item xs = {6}>
							<label>Total Balance:</label>
						</Grid>
						<Grid item xs = {6}>
							<div>{totalBalance} {T_SYMBOL}</div>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item>
							<label>Withdrawable Amount:</label>
						</Grid>
						<Grid item>
							<div>{withdrawableAmount} {T_SYMBOL}</div>
						</Grid>
					</Grid>
					<Grid container alignItems={"center"}>
						<Grid item xs = {6}>
							<label>
            Withdraw Amount:{" "}
								<Button 
									className={`${classes.maxBtn} ${withdrawableAmount === withdrawAmount? classes.maxBtnEqual: classes.maxBtnLess}`}
									sx = {{ ml:2 }}
									size="small"
									variant="contained"
									onClick={handleClickMax}
								>
              Max
								</Button>
							</label>
						</Grid>
						<Grid item xs = {6}>
							<div className="col-sm-6">
								<TextField
									className={`${classes.input} py-1`}
									type="number"
									// min={0.1}
									// max={withdrawableAmount}
									// step={0.1}
									value={withdrawAmount}
									onChange={handleChangeWithdrawAmount}
								/>
							</div>
						</Grid>
					</Grid>
					<Box display={"flex"} justifyContent={"center"} sx = {{ mt:2 }}>
						<ActionButton
							size="large"
							type="submit"
							isBusy={isWithdrawing}
							disabled={
								isWithdrawing ||
                withdrawAmount === 0 ||
                withdrawAmount > withdrawableAmount
							}
						>
              Withdraw
						</ActionButton>
					</Box>
				</Box>
			</form>
		</Box>
	)
}

export default Withdraw
