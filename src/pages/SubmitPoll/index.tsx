import React, {
	useCallback,
	useEffect,
	useState,
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAlert } from "react-alert"
import { Box, Button, MenuItem, TextField, Divider, Typography } from "@mui/material"
import { useAccount, useWalletClient } from "wagmi"

import { useAlertError, useDoing } from "../../hooks"
import { createPoll, getPollDetails, updatePoll } from "../../web3"
import { Address } from "viem"
import { IQuestion } from "../SubmitQuestions"
import Loading from "../../components/Loading"
import ActionButton from "../../components/ActionButton"

import { getGasWalletLists } from "../../axios/account"
import { useFormik } from "formik"
import * as Yup from "yup"
import moment, { Moment } from "moment"
import { DateTimePicker } from "@mui/x-date-pickers"
import { requestCreatePoll, requestUpdatePoll } from "../../axios/poll"
import { T_SYMBOL } from "@/axios/config"

export interface IPoll {
	creator:Address;
	title: string;
	tokenAddress?: Address;
	gasWallet: Address;
	description: string;
	openTime: Moment;
	closeTime: Moment;
	gasAmount?: number;
	questions?: IQuestion[];
	isVoted?:boolean;
}

export interface IExPoll extends IPoll {
  address: Address;
  
}

export interface IPollState {
  polls?: IExPoll[];
}

const SubmitPoll: React.FC = () => {
	const navigate = useNavigate()
	const alertError = useAlertError()
	const { success: alertSuccess } = useAlert()
	const { poll } = useParams<{ poll: Address }>()
	const [gasWallets, setGasWallets] = useState<any[]>([])
	const [isBusy, setBusy, setFree] = useDoing()
	const [isFetching, setBusyFetching, setFreeFetching] = useDoing()
	const { address } = useAccount()
	const { data: walletClient, isError, isLoading } = useWalletClient()
	
	
	const formik = useFormik({
		initialValues:{
			creator:"0x00",
			address:"0x00",
			title: "",
			description: "",
			openTime: moment(),
			closeTime: moment(),
			gasWallet: "0x00",
			gasAmount:0,
		},
		validationSchema:Yup.object({
			title: Yup.string().required("Required"),
			description: Yup.string().required("Required"),
			openTime: Yup.date().required("Required"),
			closeTime: Yup.date().required("Required"),
			gasProvided: Yup.boolean().oneOf([true, false], "Message"),
			gasWallet: Yup.mixed<Address>().required("Required"),
			gasAmount: Yup.number().notRequired(),
		}),
		onSubmit:async (values:IExPoll, { setSubmitting }) => {

			setSubmitting(false)
			setBusy()
			try {
				if (!poll) {
					const newPollAddr = await createPoll(
						values.title,
						values.description,
						values.openTime.unix(),
						values.closeTime.unix(),
						`${values.gasAmount || 0}`,
						values.gasWallet as Address
					)
					const pollDetail:IExPoll = {
						...values,
						gasWallet:values.gasWallet,
						address:newPollAddr,
						creator:address!,
						openTime: values.openTime,
						closeTime: values.closeTime
					}
					
					await requestCreatePoll(pollDetail)

					alertSuccess("Poll submitted.")
					navigate(`/manager/submit-whitelist/${newPollAddr}`)
					
				} else {
					await updatePoll(
						poll,
						values.title,
						values.description,
						values.openTime.unix(),	
						values.closeTime.unix(),
						`${values.gasAmount || 0}`,
					)
					alertSuccess("Updates submitted.")
					navigate(`/manager/submit-whitelist/${poll}`)
					
					await requestUpdatePoll(poll, values)
				}
			} catch (err) {
				console.log(err)
				alertError(err as Error)
			} finally {
				setFree()
			}
		}

	})
	

	const fetchPollData = useCallback(() => {
		if (poll !== undefined && address) {
			setBusyFetching()
			getPollDetails(poll)
				.finally(setFreeFetching)
				.then((data) => {
					if(data){
						const formData:IExPoll = {
							creator:address,
							address:poll,
							title:data.title,
							description:data.description,
							openTime:data.openTime,
							closeTime:data.closeTime,
							gasAmount:0,
							gasWallet:data.gasWallet
						}
						formik.setValues(formData)
					}
				})
				.catch(alertError)
		}
	}, [poll])

	useEffect(()=>{
		console.log("---client is updated---", isLoading)
	}, [isLoading])

	useEffect(() => {
		if (address) {
			fetchPollData()
			fetchGasWallets()
		}
	}, [poll, address, isLoading])

	const fetchGasWallets = useCallback(() => {
		getGasWalletLists().then((res:any)=>{
			setGasWallets(res.data)
		})
	}, [address])

	return (
		<Box sx={{ p:2 }}>
			<h4 className={"position-relative mb-4 py-2"}>
				<span className="d-block mb-1">Poll Details</span>
			</h4>
			<Divider />
			{isFetching ? (
				<Box display={"flex"} justifyContent={"center"} m={2}>
					<Loading color="gray" />
				</Box>
			) : (
				<>
					<Box 
						component="form" 
						onSubmit={formik.handleSubmit} 
						sx={{ display:"flex", flexDirection:"column" }}
						gap={2}
					>
						<TextField
							fullWidth
							margin="dense"
							id="title"
							name="title"
							label="Poll Name"
							value={formik.values.title}
							onChange={formik.handleChange}
							error={formik.touched.title && Boolean(formik.errors.title)}
							helperText={formik.touched.title && formik.errors.title}
						/>

						<TextField
							fullWidth
							margin="dense"
							id="description"
							multiline
							minRows={4}
							name="description"
							label="Description"
							value={formik.values.description}
							onChange={formik.handleChange}
							error={formik.touched.description && Boolean(formik.errors.description)}
							helperText={formik.touched.description && formik.errors.description}
						/>

						<Box>
							<DateTimePicker 
								label = "Poll Open"
								ampm  = {false}
								value={formik.values.openTime}
								onChange={(value)=>{
									formik.setFieldValue("openTime", value, true)
								}}
								slotProps={{ 
									textField: {
										name:"openTime",
										// onChange:formik.handleChange,
										error:formik.touched.openTime && Boolean(formik.errors.openTime),
										helperText: formik.touched.openTime && Boolean(formik.errors.openTime) ? <>{formik.errors.openTime}</> : null,
										InputLabelProps:{
											shrink: true,
										}
									} 
								}}
							/>
						</Box>

						<Box>

							<DateTimePicker 
								label = "Poll Close"
								value={formik.values.closeTime}
								onChange={(value)=>{
									formik.setFieldValue("closeTime", value, true)
								}}
								ampm  = {false}
								slotProps={{ 
									textField: {
										name:"closeTime",
										// onChange:formik.handleChange,
										error:formik.touched.closeTime && Boolean(formik.errors.closeTime),
										helperText: formik.touched.closeTime && Boolean(formik.errors.closeTime) ? <>{formik.errors.closeTime}</> : null,
										InputLabelProps:{
											shrink: true,
										}
									} 
								}}
							/>
						</Box>

						{(poll === undefined) && (
							<Box display="flex" alignItems={"end"} sx={{ py: 2 }}>
								<Box>
									<TextField
										name="gasAmount"
										sx={{ mr:2 }}
										inputProps={{
											type:"number",
											min:Math.max(0.01),
											step: "0.01"
										}}
										value={formik.values.gasAmount}
										onChange={formik.handleChange}
										error={formik.touched.gasAmount && Boolean(formik.errors.gasAmount)}
										// helperText={"Minimum of 0.01 Matic"}
										// value={gasAmount}
										// onChange={handleChangeGasAmount}
									/>

									<TextField
										select
										disabled
										value={T_SYMBOL}
										// onChange={() => {}}
									>
										<MenuItem value={T_SYMBOL}>{T_SYMBOL}</MenuItem>
									</TextField>
								</Box>
								<Box sx={{ ml:1 }}>
									<Typography>Minimum of 0.01 {T_SYMBOL}</Typography>
								</Box>
							</Box>
						)}

						<Box>
							<TextField 
								sx={{ width:"100%"}}
								select 
								label="Gas Wallet"
								name="gasWallet"
								value={formik.values.gasWallet}
								onChange={formik.handleChange}
								error={formik.touched.gasWallet && Boolean(formik.errors.gasWallet)}
								helperText={formik.touched.gasWallet && formik.errors.gasWallet}
							>
								{
									gasWallets.map((ele,key)=>
										ele.address && <MenuItem key = {key} value={ele.address}>{ele.address}</MenuItem>)
								}

							</TextField>
						</Box>

						<Box display={"flex"} gap={2} justifyContent={"end"}>
							<ActionButton
								type="submit"
								isBusy={isBusy}
							>Next</ActionButton>
							{poll !== undefined && (
								<Button
									variant="contained"
									type="submit"
									disabled={!!isBusy}
									onClick={() => navigate(`/manager/submit-whitelist/${poll}`)}
								>Skip</Button>
							)}
						</Box>
					</Box>
				</>
			)}

			
		</Box>
	)
}

export default SubmitPoll
