import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogActions, TextField, Box, Button } from "@mui/material"
import useGasWallet from "@/appRedux/gasWallet/gasWallet.hook"
import { Formik, Form, Field, useFormik } from "formik"
import * as Yup from "yup"
import { Address, parseEther } from "viem"
import { useWaitForTransaction } from "wagmi"
import ActionButton from "../ActionButton"
import { prepareSendTransaction, sendTransaction } from "@wagmi/core"
import { T_SYMBOL } from "@/axios/config"

const DepositDialog = () => {
	const { wallet: { depositDialogOpen, to }, setDepositDialogOpen} = useGasWallet()
	const [hash, setHash] = useState<Address>()
	const { isLoading, isSuccess } = useWaitForTransaction({
		hash,
	})

	const formik = useFormik({
		initialValues:{
			gasAmount:0,
		},
		validationSchema:Yup.object({
			gasAmount: Yup.number().required("Gas aomount is required"),
		}),
		onSubmit:async (values: { gasAmount: number }, { setSubmitting }) => {
			setSubmitting(false)
			const config = await prepareSendTransaction({to, value:parseEther(`${values.gasAmount}`)})
			const res = await sendTransaction(config)
			setHash(res.hash)
			// await waitForTransaction({ hash: res.hash })
		}
	})

	if(isSuccess) {
		setHash(undefined)
		setDepositDialogOpen(false, "0x00")
		formik.resetForm()
	}

	return (
		<Dialog open = {depositDialogOpen} onClose={()=>setDepositDialogOpen(false, "0x00")}>
			<DialogTitle>
                Deposit {T_SYMBOL}
			</DialogTitle>
			<DialogContent>
				<Box 
					component="form" 
					sx = {{ py:2 }}
					onSubmit={formik.handleSubmit} 
				>
					<TextField
						label="Gas Amount"
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
						helperText={formik.touched.gasAmount && formik.errors.gasAmount}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={()=>setDepositDialogOpen(false, "0x00")}>Cancel</Button>
				<ActionButton isBusy={isLoading} onClick={()=>formik.handleSubmit()}>Ok</ActionButton>
			</DialogActions>
		</Dialog>
	)

}

export default DepositDialog