import React from "react"
import { makeStyles } from "@mui/styles"
import { AlertTemplateProps } from "react-alert"
import SVG from "react-inlinesvg"

const useStyles = makeStyles(() => ({
	alert: {
		backgroundColor: "#151515",
		color: "white",
		marginTop: "10px !important",
		padding: "10px",
		textTransform: "uppercase",
		borderRadius: "3px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.03)",
		fontFamily: "Arial",
		width: "250px",
		boxSizing: "border-box",
		":first-child > &": {
			marginTop: "80px !important",
		},
	},
	message: {
		flex: 2,
		marginLeft: "0.5rem",
		textTransform: "none",
		color: "white",
	},
	button: {
		marginLeft: "20px",
		border: "none",
		backgroundColor: "transparent",
		cursor: "pointer",
		color: "#FFFFFF",
	},
}))

const AlertTemplate: React.FC<AlertTemplateProps> = ({
	message,
	options,
	style,
	close,
}) => {
	const classes = useStyles()

	return (
		<div className={classes.alert} style={style}>
			<SVG src={`/media/svg/alert-${options.type}.svg`} />
			<span className={classes.message}>{message}</span>
			<button className={classes.button} onClick={close}>
				<SVG src={"/media/svg/alert-close.svg"} />
			</button>
		</div>
	)
}

export default AlertTemplate
