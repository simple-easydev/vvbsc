import React from "react"
import { useNavigate } from "react-router-dom"
import { Button, Container, useMediaQuery, Theme } from "@mui/material"
import { makeStyles } from "@mui/styles"
import YouTube from "react-youtube"

import { Color } from "../../color"

const useStyle = makeStyles((theme:Theme) => ({
	container: {},
	welcomeText: {
		fontSize: 56,
		borderBottom: "2px solid " + Color.Border,
		[theme.breakpoints.down("sm")]: {
			fontSize: 36,
		},
	},
}))

const WelcomeManager: React.FC = () => {
	const classes = useStyle()
	const navigate = useNavigate()
	const matches = useMediaQuery("(min-width: 768px)")

	return (
		<Container
			className={
				classes.container +
        " d-flex flex-column align-items-center justify-content-center py-5"
			}
		>
			<h1 className={classes.welcomeText + " px-5 mb-4"}>Welcome!</h1>
			<YouTube
				className="mb-3"
				videoId="5-0sjTYVl6I"
				opts={
					matches
						? { width: "640px", height: "360px" }
						: { width: "320px", height: "180px" }
				}
			/>
			<Button
				className="px-3 text-uppercase mb-5"
				onClick={() => navigate("/manager/home")}
			>
        Go Home
			</Button>
		</Container>
	)
}

export default WelcomeManager
