import React, {
	ChangeEventHandler,
	FormEventHandler,
	useCallback,
	useEffect,
	useState,
} from "react"
import { Button, Box, FormControl, Grid, TextField, Theme, Typography } from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import SystemFee from "./SystemFee"
import { getAllFeeList } from "@/axios/fee"
import FeeWhiteList from "./FeeWhiteList"
import { FeeDataProvider } from "./FeedataProvider"

const FeePanel: React.FC = () => {
	return (
		<FeeDataProvider>
			<Box sx = {{ p:2 }}>
				<h4>
                Fee Panel
				</h4>
				<SystemFee />
				<FeeWhiteList />
			</Box>
		</FeeDataProvider>
	)
}

export default FeePanel
