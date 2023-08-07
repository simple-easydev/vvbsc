import React, {
	ChangeEventHandler,
	MouseEvent,
	useCallback,
	useMemo,
	useState,
} from "react"
import { makeStyles } from "@mui/styles"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Toolbar,
	Typography,
	Paper,
	Checkbox,
	IconButton,
	Tooltip,
	Theme,
	lighten
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import FilterListIcon from "@mui/icons-material/FilterList"
import clsx from "clsx"

type Order = "asc" | "desc";

interface IRow {
  id: string;
  format?: (_: any) => string;
  label: string;
}

type HeadProps = {
  order: Order;
  orderBy: string;
  numSelected: number;
  rowCount: number;
  headRows: IRow[];
  onClickSelectAll: ChangeEventHandler<HTMLInputElement>;
  onRequestSort: (e: MouseEvent, prop: string) => void;
};

const EnhancedTableHead: React.FC<HeadProps> = ({
	order,
	orderBy,
	numSelected,
	rowCount,
	headRows,
	onClickSelectAll: handleClickSelectAll,
	onRequestSort: handleRequestSort,
}) => {
	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={numSelected === rowCount}
						onChange={handleClickSelectAll}
					/>
				</TableCell>
				{headRows.map((row, index) => (
					<TableCell
						key={index}
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
			</TableRow>
		</TableHead>
	)
}

const useToolbarStyles = makeStyles((theme:Theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:{
		color: theme.palette.secondary.main,
		backgroundColor: lighten(theme.palette.secondary.light, 0.85),
	},
	spacer: {
		flex: "1 1 100%",
	},
	actions: {
		color: theme.palette.text.secondary,
	},
	title: {
		flex: "0 0 auto",
	},
}))

type ToolbarProps = {
  title: string;
  numSelected: number;
};

const EnhancedTableToolbar: React.FC<ToolbarProps> = ({
	title,
	numSelected,
}) => {
	const classes = useToolbarStyles()

	return (
		<Toolbar
			className={clsx(classes.root, {
				// [classes.highlight]: numSelected > 0,
			})}
		>
			<div className={classes.title}>
				{numSelected > 0 ? (
					<Typography color="inherit" variant="subtitle1">
						{numSelected} selected
					</Typography>
				) : (
					<Typography variant="h6" id="tableTitle">
						{title}
					</Typography>
				)}
			</div>
			<div className={classes.spacer} />
			<div className={classes.actions}>
				{numSelected > 0 ? (
					<Tooltip title="Delete">
						<IconButton aria-label="Delete">
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title="Filter list">
						<IconButton aria-label="Filter list">
							<FilterListIcon />
						</IconButton>
					</Tooltip>
				)}
			</div>
		</Toolbar>
	)
}

const useStyles = makeStyles((theme:Theme) => ({
	root: {
		width: "100%",
		marginTop: theme.spacing(3),
		whiteSpace: "nowrap",
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2),
		boxShadow: "none",
		border: "1px solid rgb(0 0 0 / 14%)",
		borderRadius: 0,
	},
	table: {
		minWidth: 750,
	},
	tableWrapper: {
		overflowX: "auto",
	},
}))

type Props = {
  title: string;
  data: any[];
  headRows: IRow[];
};

const EnhancedTable: React.FC<Props> = ({ title, data, headRows }) => {
	const classes = useStyles()
	const [order, setOrder] = useState<Order>("desc")
	const [orderBy, setOrderBy] = useState<string>(headRows[0].id)
	const [selected, setSelected] = useState<string[]>([])
	const [page, setPage] = useState<number>(0)
	const [rowsPerPage, setRowsPerPage] = useState<number>(5)

	const handleSelectAllClick: ChangeEventHandler<HTMLInputElement> = ({
		target: { checked },
	}) => {
		setSelected(checked ? data.map(({ id }) => id) : [])
	}

	const handleRequestSort = (e: MouseEvent, prop: string) => {
		setOrder(orderBy === prop && order === "desc" ? "asc" : "desc")
		setOrderBy(prop)
	}

	const handleCheck = (e: MouseEvent, id: string) => {
		const idx = selected.indexOf(id)
		setSelected((prev) =>
			idx < 0 ? [...prev, id] : [...prev.slice(0, idx), ...prev.slice(idx + 1)]
		)
	}

	const emptyRows = useMemo(
		() => rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage),
		[data.length, rowsPerPage, page]
	)

	const cmp = useCallback(
		(a: { [k: string]: any }, b: { [k: string]: any }) =>
			(order === "asc" ? 1 : -1) *
      (a[orderBy] > b[orderBy] ? 1 : a[orderBy] < b[orderBy] ? -1 : 0),
		[order, orderBy]
	)

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar title={title} numSelected={selected.length} />
				<div className={classes.tableWrapper}>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="medium"
					>
						<EnhancedTableHead
							numSelected={selected.length}
							rowCount={data.length}
							headRows={headRows}
							order={order}
							orderBy={orderBy}
							onClickSelectAll={handleSelectAllClick}
							onRequestSort={handleRequestSort}
						/>
						<TableBody>
							{[...data]
								.sort(cmp)
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => (
									<TableRow
										key={index}
										hover
										role="checkbox"
										tabIndex={-1}
										selected={selected.includes(row.id)}
										onClick={(event) => handleCheck(event, row.id)}
									>
										<TableCell padding="checkbox">
											<Checkbox checked={selected.includes(row.id)} />
										</TableCell>
										{headRows.map(({ id, format }, index) => (
											<TableCell key={index}>
												{!format ? row[id] : format(row[id])}
											</TableCell>
										))}
									</TableRow>
								))}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					rowsPerPageOptions={[5, 10]}
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={(e, value) => setPage(value)}
					onRowsPerPageChange={({ target: { value } }) =>
						setRowsPerPage(+value)
					}
				/>
			</Paper>
		</div>
	)
}

export default EnhancedTable
