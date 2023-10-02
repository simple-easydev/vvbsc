import React, {
	useEffect,
} from "react"
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNetwork } from "wagmi"
import ActionButton from "@/components/ActionButton"
import { useFeeData } from "./FeedataProvider"
import { SaveOutlined } from "@mui/icons-material"

export type SystemFeeType = {
    feePollOnOff:boolean;
    feeQuestionOnOff:boolean;
    feeWhitelistOnOff:boolean;
}

const SystemFee: React.FC = () => {

	const { systemFee, isRequesting, updateSystemFee } = useFeeData()

	const formik = useFormik({
		initialValues:systemFee,
		validationSchema:Yup.object({
			feePollOnOff: Yup.bool(),
			feeQuestionOnOff: Yup.bool(),
			feeWhitelistOnOff: Yup.bool(),
		}),
		onSubmit:async (values: SystemFeeType, { setSubmitting }) => {
			setSubmitting(false)
			updateSystemFee(values)
		}
	})

	useEffect(()=>{
		formik.setValues(systemFee)
	}, [systemFee])
	
	return (
		<Box sx = {{ p:2 }}>
			<Typography>System</Typography>
			<Box component={"form"} onSubmit={formik.handleSubmit}>
				<FormControlLabel
					label="Poll"
					name="feePollOnOff"
					control={
						<Checkbox 
							checked = {formik.values.feePollOnOff}
							onChange={formik.handleChange}
						/>
					}
				/>
				<FormControlLabel
					label="Question"
					name="feeQuestionOnOff"
					control={
						<Checkbox 
							checked = {formik.values.feeQuestionOnOff}
							onChange={formik.handleChange}
						/>
					}
				/>
				<FormControlLabel
					label="Whitelist"
					name="feeWhitelistOnOff"
					control={
						<Checkbox 
							checked = {formik.values.feeWhitelistOnOff}
							onChange={formik.handleChange}
						/>}
				/>
				<ActionButton type="submit" startIcon = {<SaveOutlined />}>Save</ActionButton>
			</Box>
		</Box>
	)
}

export default SystemFee
