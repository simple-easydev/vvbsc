import React, { ReactNode, useRef } from "react"
import { IQuestion, IVoteAnswer } from "../SubmitQuestions"
import moment from "moment"
import { Box, Button, IconButton, List, ListItem, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, Typography, useTheme } from "@mui/material"
import _ from "lodash"
import { TablePaginationActionsProps } from "@mui/material/TablePagination/TablePaginationActions"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import LastPageIcon from "@mui/icons-material/LastPage"
import { DownloadTableExcel } from "react-export-table-to-excel"


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



interface Props {
    data:readonly IVoteAnswer[]
	questions:IQuestion[];
}

function TablePaginationActions(props: TablePaginationActionsProps) {
	const theme = useTheme()
	const { count, page, rowsPerPage, onPageChange } = props
  
	const handleFirstPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		onPageChange(event, 0)
	}

	const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, page - 1)
	}

	const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, page + 1)
	}

	const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
	}
  
	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</Box>
	)
}

const VoteResultTable = ({ data, questions }:Props) => {

	const columns:ColumnType[] = [
		{
			label:"",
			width:"5%",
			render:(row, index)=>{
				return page * rowsPerPage + index + 1
			}
		},
		{
			label:"Voter",
			dataIndex:"votor",
			width:"25%"
		},
		{
			label:"Voted At",
			dataIndex:"createdAt",
			render:(row, index)=>{
				return moment(moment.unix(Number(row["createdAt"]))).format("L LT")
			}
		},
		...questions.map((question, qIndex)=>{
			return {
				label:`Q ${qIndex + 1}`,
				dataIndex:"answers",
				render:(row:IVoteAnswer)=>{
					return (
						<div>
							{
								row.answers.map((answer, index)=>(
									qIndex == index && 
									<>
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
			}
		})
	]
	const tableRef = useRef(null)
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

  
	const tableData : IVoteAnswer[] = Array.from(data) 
	return (
		<Box sx= {{ p:2 }}>
			<Box display={"flex"} justifyContent={"space-between"}>
				<Typography> Vote Result </Typography>
				<DownloadTableExcel
					filename="vote-result"
					sheet="voters"
					currentTableRef={tableRef.current}
				>
					<Button
						className="btn-rounded px-4 py-2"
						variant="contained"
						type="button"
					>Export
					</Button>
				</DownloadTableExcel>
			</Box>
			<Table ref={tableRef}>
				<TableHead>
					<TableRow>
						{columns.map((col, index)=>col.hidden ||
                            <TableCell width={col.width} sx={{ textAlign:col.textAlign || "left"}} key = {index}> {col.label} </TableCell>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					{
						tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index)=>
							<CustomTableRow row={row} columns={columns} key={row.votor} index={index} />
						)
					}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
							// colSpan={3}
							count={tableData.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</Box>
	)
}

export default VoteResultTable