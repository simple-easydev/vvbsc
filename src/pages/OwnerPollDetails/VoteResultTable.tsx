import React, { ReactNode, useCallback } from "react"
import { IVoteAnswer } from "../SubmitQuestions"
import SimpleTable from "@/components/SimpleTable"
import moment from "moment"
import { Box, List, ListItem, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import _ from "lodash"


export type ColumnType = {
    label:string;
    dataIndex?:string;
    hidden?:boolean;
    textAlign?:"left"|"center"|"right"
    width?:string;
    render?:(row:IVoteAnswer, index:number)=>ReactNode;
}

interface CustomTableRowProps {
    row:IVoteAnswer;
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

const columns:ColumnType[] = [
	{
		label:"",
		width:"5%",
	},
	{
		label:"Voter",
		dataIndex:"votor",
		width:"40%"
	},
	{
		label:"Voted At",
		dataIndex:"createdAt",
		render:(row, index)=>{
			console.log("row ===>", row)
			return moment(moment.unix(Number(row["createdAt"]))).format("L LT")
		}
	},
	{
		label:"Answers",
		dataIndex:"answers",
		render:(row, index)=>{
			return (
				<div>
					{
						row.answers.map((answer, index)=>(
							<>
								<Typography key = {index}>Q {index + 1}</Typography>
								<List sx = {{ listStyleType: "disc", ml:4 }}>
									{answer.map((choice, idx) => (
										<ListItem
											disablePadding
											sx = {{ display:"list-item"}}
											key={idx}
										>
											{Number(choice)}
										</ListItem>
									))}
								</List>
							</>
						))
					}
				</div>
			)
		}
	},
]

interface Props {
    data:readonly IVoteAnswer[]
}

const VoteResultTable = ({ data }:Props) => {
	const tableData : IVoteAnswer[] = Array.from(data) 
	return (
		<Box sx= {{ p:2 }}>
			<Box display={"flex"} justifyContent={"space-between"}>
				<Typography>
                Vote Result
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
					{
						tableData.map((row, index)=>
							<CustomTableRow row={row} columns={columns} key={row.votor} index={index} />
						)
					}
				</TableBody>
			</Table>
		</Box>
	)
}

export default VoteResultTable