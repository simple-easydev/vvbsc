import React, { MouseEventHandler, useCallback, useState } from "react"
import { Tooltip } from "@mui/material"
import { makeStyles } from "@mui/styles"
import copy from "clipboard-copy"

const useStyles = makeStyles(() => ({
	ki: {
		color: "#b5b5c3",
		"&:hover": {
			transition: "all 0.15s ease",
			color: "#3699ff",
		},
	},
}))

type Props = {
  text: string;
  [k: string]: any;
};

const CopyToClipboardButton: React.FC<Props> = ({ text, ...props }) => {
	const classes = useStyles()

	const [isCopied, setIsCopied] = useState<boolean>(false)

	const copyText = useCallback<MouseEventHandler<HTMLSpanElement>>(
		(e) => {
			e.stopPropagation()
			copy(text).then(() => {
				setIsCopied(true)
				setTimeout(() => setIsCopied(false), 2000)
			})
		},
		[text]
	)

	return (
		<Tooltip title="Click to copy text" {...props}>
			<span
				className={`ki ${classes.ki} ${isCopied ? "ki-check" : "ki-copy"}`}
				onClick={copyText}
			/>
		</Tooltip>
	)
}

export default CopyToClipboardButton
