import React, { MouseEvent, useCallback, useState } from "react"
import { makeStyles } from "@mui/styles"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableSortLabel,
	Theme,
	Box
} from "@mui/material"

import CopyToClipboardButton from "../CopyToClipboardButton"
import Loading from "../Loading"

type Order = "asc" | "desc";

interface IRow {
  id: string;
  label: string;
  textAlign?: "center"|"left"|"right"|any;
  hasCopyToClipboard?: boolean;
  format?: (_: any, row?:any) => any;
}

type HeadProps = {
  order: Order;
  orderBy: string;
  headRows: IRow[];
  hasActions?: boolean;
  onRequestSort: (e: MouseEvent, prop: string) => void;
};

const SimpleTableHead: React.FC<HeadProps> = ({
	order,
	orderBy,
	headRows,
	hasActions,
	onRequestSort: handleRequestSort,
}) => {
	return (
		<TableHead>
			<TableRow>
				<TableCell>#</TableCell>
				{headRows.map((row, index) => (
					<TableCell
						key={index}
						className="px-1"
						sx={{
							textAlign:row.textAlign
						}}
						sortDirection={orderBy === row.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === row.id}
							direction={order}
							onClick={(e) => handleRequestSort(e, row.id)}
						>
							{row.label}
						</TableSortLabel>
					</TableCell>
				))}
				{!!hasActions && <TableCell className="px-1">Actions</TableCell>}
			</TableRow>
		</TableHead>
	)
}

const useStyles = makeStyles((theme:Theme) => ({
	root: {
		width: "100%",
		whiteSpace: "nowrap",
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2),
		boxShadow: "none",
		borderRadius: 0,
	},
	table: {
		// minWidth: 750,
		boxShadow:"none"
	},
	tableWrapper: {
		overflowX: "auto",
	},
}))

type Props = {
  data?: any[];
  headRows: IRow[];
  primaryKey: string;
  onClick?: (_: any) => void;
  icon?: JSX.Element;
};

const SimpleTable: React.FC<Props> = ({
	data,
	headRows,
	primaryKey,
	onClick: handleClick,
	icon,
}) => {
	const classes = useStyles()
	const [order, setOrder] = useState<Order>("desc")
	const [orderBy, setOrderBy] = useState<string>(headRows[0].id)

	const handleRequestSort = useCallback(
		(e: MouseEvent, prop: string) => {
			setOrder(orderBy === prop && order === "desc" ? "asc" : "desc")
			setOrderBy(prop)
		},
		[orderBy, order]
	)

	const cmp = useCallback(
		(a: { [k: string]: any }, b: { [k: string]: any }) =>
			(order === "asc" ? 1 : -1) *
      (a[orderBy] > b[orderBy] ? 1 : a[orderBy] < b[orderBy] ? -1 : 0),
		[order, orderBy]
	)
	return (
		<div className={classes.root}>
			<div className={classes.tableWrapper}>
				<Table
					className={classes.table}
					aria-labelledby="tableTitle"
					size="medium"
				>
					<SimpleTableHead
						headRows={headRows}
						order={order}
						orderBy={orderBy}
						hasActions
						onRequestSort={handleRequestSort}
					/>
					<TableBody>
						{data === undefined ? (
							<TableRow>
								<TableCell
									className="px-1"
									colSpan={headRows.length + (handleClick ? 1 : 0) + 1}
								>
									<Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
										<Loading color="gray" />
									</Box>
								</TableCell>
							</TableRow>
						) : data.length > 0 ? (
							[...data].sort(cmp).map((row, index) => (
								<TableRow key={index} hover tabIndex={-1}>
									<TableCell className="px-1">{index + 1}</TableCell>
									{headRows.map(
										({ id, hasCopyToClipboard, textAlign, format }, index) => (
											<TableCell className="px-1" key={index}>
												<Box display={"flex"} alignItems={"center"} gap={1}>
													<Box sx = {{ width:textAlign?"100%":"max-content" }} textAlign={ textAlign || "left"}>
														{!format ? row[id] : format(row[id], row)}
													</Box>
													{hasCopyToClipboard && (
														<CopyToClipboardButton text={row[id]} />
													)}
												</Box>
											</TableCell>
										)
									)}
									<TableCell
										className="px-0"
										onClick={() =>
											!!handleClick && handleClick(row[primaryKey])
										}
										role="button"
									>
										{icon}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow hover>
								<TableCell
									sx={{ textAlign:"center"}}
									colSpan={headRows.length + 2}
								>No Records</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default SimpleTable
