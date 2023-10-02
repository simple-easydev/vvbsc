import React, { ReactNode, useState } from "react"
import { 
	Button, 
	Box, 
	FormControl, 
	Grid, 
	TextField, 
	Theme, 
	Typography, 
	Checkbox, 
	FormControlLabel, 
	Table, 
	TableRow, 
	TableHead,
	TableCell,
	Toolbar,
	TableBody
} from "@mui/material"
import { Address } from "viem"
import { useFeeData } from "./FeedataProvider"
import ActionButton from "@/components/ActionButton"
import { AddOutlined, CancelOutlined, CheckBox, CheckBoxOutlineBlank, CheckOutlined, EditOutlined, PlusOne, PlusOneOutlined, SaveOutlined } from "@mui/icons-material"
import _ from "lodash"
import { useFormik } from "formik"
import * as Yup from "yup"

export type ColumnType = {
    label:string;
    dataIndex?:string;
    hidden?:boolean;
    textAlign?:"left"|"center"|"right"
    width?:string;
    render?:(row:UserFeeType, index:number)=>ReactNode;
}

export type UserFeeType = {

    pollCreator:Address;

    disableFeePollOnState:boolean ;
    disableFeeQuestionOnState:boolean ;
    disableFeeWhiteListOnState:boolean ;

    enableFeePollOffState:boolean ;
    enableFeeQuestionOffState:boolean ;
    enableFeeWhiteListOffState:boolean ;
}

interface CustomTableRowProps {
    row:UserFeeType;
    columns:ColumnType[];
    index:number;
}

const CustomTableRow = ({row, columns, index}:CustomTableRowProps) => {
	return (
		<TableRow>
			{columns.map((col, rIndex)=>col.hidden || (col.render 
				? (<TableCell width={col.width} sx={{ textAlign:col.textAlign || "left"}} key = {rIndex}>{col.render?.(row, index)}</TableCell>)
				: (<TableCell width={col.width} sx={{ textAlign:col.textAlign || "left"}} key = {rIndex}>{_.get(row, col.dataIndex!, "")}</TableCell>))
			)}
		</TableRow>
	)
}


const FeeWhiteList = () => {

	const { systemFee, feeWhiteList, updateUserFee, createUserFee } = useFeeData()
	const [editAccount, setEditAccount ] = useState("")

	const emptyRow:UserFeeType = {
		pollCreator:"0x",
		disableFeePollOnState:false ,
		disableFeeQuestionOnState:false ,
		disableFeeWhiteListOnState:false ,
		enableFeePollOffState:false ,
		enableFeeQuestionOffState:false ,
		enableFeeWhiteListOffState:false ,
	}

	const newFormik = useFormik<UserFeeType>({
		initialValues:{
			pollCreator:"0x00",
			disableFeePollOnState:false,
			disableFeeQuestionOnState:false,
			disableFeeWhiteListOnState:false,

			enableFeePollOffState:false,
			enableFeeQuestionOffState:false,
			enableFeeWhiteListOffState:false,
		},
		validationSchema:Yup.object().shape({
			pollCreator: Yup.mixed<Address>().required("Required"),
			disableFeePollOnState: Yup.bool(),
			disableFeeQuestionOnState: Yup.bool(),
			disableFeeWhiteListOnState: Yup.bool(),
			enableFeePollOffState: Yup.bool(),
			enableFeeQuestionOffState: Yup.bool(),
			enableFeeWhiteListOffState: Yup.bool(),
		}),
		onSubmit:async (values, { setSubmitting }) => {
			console.log("values ===>", values)
			setSubmitting(false)
			createUserFee(values)
		}
	})


	const editFormik = useFormik<UserFeeType>({
		initialValues:{
			pollCreator:"0x00",
			disableFeePollOnState:false,
			disableFeeQuestionOnState:false,
			disableFeeWhiteListOnState:false,
			enableFeePollOffState:false,
			enableFeeQuestionOffState:false,
			enableFeeWhiteListOffState:false,
		},
		validationSchema:Yup.object().shape({
			pollCreator: Yup.mixed<Address>().required("Required"),
			disableFeePollOnState: Yup.bool(),
			disableFeeQuestionOnState: Yup.bool(),
			disableFeeWhiteListOnState: Yup.bool(),
			enableFeePollOffState: Yup.bool(),
			enableFeeQuestionOffState: Yup.bool(),
			enableFeeWhiteListOffState: Yup.bool(),
		}),
		onSubmit:async (values:UserFeeType, { setSubmitting }) => {
			setSubmitting(false)
			updateUserFee(values)
		}
	})


	const columns:ColumnType[] = [
		{
			label:"",
			width:"5%",
			render:(row:UserFeeType, index:number)=>{
				if(row.pollCreator == "0x") return "New"
				return index + 1
			}
		},
		{
			label:"Account",
			dataIndex:"account",
			width:"40%",
			render:(row:UserFeeType, index:number)=>{
				if(row.pollCreator == editAccount) 
					return  (
						<TextField 
							type="text"
							size="small" 
							name="pollCreator"
							fullWidth
							value={editFormik.values.pollCreator} 
							onChange={editFormik.handleChange}
						/>
					)
				if(row.pollCreator == "0x") return  (
					<TextField 
						size="small" 
						name="pollCreator" 
						fullWidth
						value={newFormik.values.pollCreator} 
						onChange={newFormik.handleChange}
					/>
				)
				return <Typography>{row.pollCreator}</Typography>
			}
		},
		{
			label:"Disabled Poll Fee",
			dataIndex:"disableFeePollOnState",
			hidden:!systemFee.feePollOnOff,
			textAlign:"center",
			render:(row:UserFeeType, index:number)=>{
				if(row.pollCreator == editAccount) 
					return (
						<Checkbox 
							color="primary" 
							name="disableFeePollOnState"
							checked = {editFormik.values.disableFeePollOnState} 
							onChange={editFormik.handleChange} 
						/>
					)
				if(row.pollCreator == "0x") 
					return (
						<Checkbox 
							color="primary" 
							name="disableFeePollOnState"
							checked = {newFormik.values.disableFeePollOnState} 
							onChange={newFormik.handleChange} 
						/>
					)
				if(row.disableFeePollOnState) return <CheckOutlined color="primary"/>
				return ""
			}
		},
		{
			label:"Enabled Poll Fee",
			dataIndex:"enableFeePollOffState",
			hidden:systemFee.feePollOnOff,
			textAlign:"center",
			width:"11%",
			render:(row:UserFeeType, index:number )=>{
				if(row.pollCreator == editAccount) 
					return (
						<Checkbox 
							color="primary" 
							name="enableFeePollOffState"
							checked = {editFormik.values.enableFeePollOffState} 
							onChange={editFormik.handleChange} 
						/>
					)
				if(row.pollCreator == "0x") 
					return (
						<Checkbox 
							color="primary" 
							name="enableFeePollOffState"
							checked = {newFormik.values.enableFeePollOffState} 
							onChange={newFormik.handleChange} 
						/>
					)
				if(row.enableFeePollOffState) return <CheckOutlined color="primary"/>
				return ""
			}
		},
		{
			label:"Disabled Question Fee",
			dataIndex:"disableFeeQuestionOnState",
			hidden:!systemFee.feeQuestionOnOff,
			textAlign:"center",
			width:"11%",
			render:(row:UserFeeType, index:number )=>{
				if(row.pollCreator == editAccount) 
					return (
						<Checkbox 
							color="primary" 
							name="disableFeeQuestionOnState"
							checked = {editFormik.values.disableFeeQuestionOnState} 
							onChange={editFormik.handleChange} 
						/>
					)
				if(row.pollCreator == "0x") 
					return (
						<Checkbox 
							color="primary" 
							name="disableFeeQuestionOnState"
							checked = {newFormik.values.disableFeeQuestionOnState} 
							onChange={newFormik.handleChange} 
						/>
					)
				if(row.disableFeeQuestionOnState) return <CheckOutlined color="primary"/>
				return ""
			}
		},
		
		{
			label:"Enabled Question Fee",
			dataIndex:"enableFeeQuestionOffState",
			hidden:systemFee.feeQuestionOnOff,
			textAlign:"center",
			width:"11%",
			render:(row:UserFeeType, index:number )=>{
				if(row.pollCreator == editAccount) 
					return (
						<Checkbox 
							color="primary" 
							name="enableFeeQuestionOffState"
							checked = {editFormik.values.enableFeeQuestionOffState} 
							onChange={editFormik.handleChange} 
						/>
					)
				if(row.pollCreator == "0x") 
					return (
						<Checkbox 
							color="primary" 
							name="enableFeeQuestionOffState"
							checked = {newFormik.values.enableFeeQuestionOffState} 
							onChange={newFormik.handleChange} 
						/>
					)
				if(row.enableFeeQuestionOffState) return <CheckOutlined color="primary"/>
				return ""
			}
		},
		{
			label:"Disabled Whitelist Fee",
			dataIndex:"disableFeeWhiteListOnState",
			hidden:!systemFee.feeWhitelistOnOff,
			textAlign:"center",
			width:"11%",
			render:(row:UserFeeType, index:number )=>{
				if(row.pollCreator == editAccount) 
					return (
						<Checkbox 
							color="primary" 
							name="disableFeeWhiteListOnState"
							checked = {editFormik.values.disableFeeWhiteListOnState} 
							onChange={editFormik.handleChange} 
						/>
					)
				if(row.pollCreator == "0x") 
					return (
						<Checkbox 
							color="primary" 
							name="disableFeeWhiteListOnState"
							checked = {newFormik.values.disableFeeWhiteListOnState} 
							onChange={newFormik.handleChange} 
						/>
					)
				if(row.disableFeeWhiteListOnState) return <CheckOutlined color="primary"/>
				return ""
			}
		},
		{
			label:"Enabled Whitelist Fee",
			dataIndex:"enableFeeWhiteListOffState",
			hidden:systemFee.feeWhitelistOnOff,
			textAlign:"center",
			width:"11%",
			render:(row:UserFeeType, index:number )=>{
				if(row.pollCreator == editAccount) 
					return (
						<Checkbox 
							color="primary" 
							name="enableFeeWhiteListOffState"
							checked = {editFormik.values.enableFeeWhiteListOffState} 
							onChange={editFormik.handleChange} 
						/>
					)
				if(row.pollCreator == "0x") 
					return (
						<Checkbox 
							color="primary" 
							name="enableFeeWhiteListOffState"
							checked = {newFormik.values.enableFeeWhiteListOffState} 
							onChange={newFormik.handleChange} 
						/>
					)
				if(row.enableFeeWhiteListOffState) return <CheckOutlined color="primary"/>
				return ""
			}
		},
		{
			label:"Action",
			width:"20%",
			render:(row:UserFeeType, index:number)=>{
				if(row.pollCreator == "0x"){
					return <ActionButton onClick={()=>newFormik.submitForm()}><AddOutlined /></ActionButton>    
				}
				if(row.pollCreator == editAccount){
					return (
						<Box display={"flex"} gap={2}>
							<ActionButton onClick={()=>editFormik.submitForm()}><SaveOutlined /></ActionButton>
							<ActionButton onClick={()=>setEditAccount("")}><CancelOutlined /></ActionButton>
						</Box>
					)
				}
				return <ActionButton onClick={()=>{
					editFormik.setValues(row)
					setEditAccount(row.pollCreator)
				}}><EditOutlined /></ActionButton>
			}
		},
	]

	return (
		<Box sx= {{ p:2 }}>
			<Box display={"flex"} justifyContent={"space-between"}>
				<Typography>
                Fee White List
				</Typography>
			</Box>
			<Table>
				<TableHead>
					<TableRow>
						{columns.map((col, index)=>col.hidden ||
                            <TableCell width={col.width} sx={{ textAlign:col.textAlign || "left"}} key = {index}> {col.label} </TableCell>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					<CustomTableRow row={emptyRow} columns={columns} key={0} index={0} />
					{
						feeWhiteList.map((row, index)=>
							<CustomTableRow row={row} columns={columns} key={row.pollCreator} index={index} />
						)
					}
				</TableBody>
			</Table>
		</Box>
	)
}

export default FeeWhiteList