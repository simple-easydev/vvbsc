import React from "react"
import { Button, ButtonProps } from "@mui/material"

import Loading from "../Loading"

type Props = {
  isBusy?: boolean;
  disabled?: boolean;
  children: JSX.Element | JSX.Element[] | React.ReactNode;
  [k: string]: any;
} & ButtonProps

const ActionButton: React.FC<Props> = ({
	isBusy,
	disabled,
	children,
	...props
}) => {
	return (
		<Button variant="contained" disabled={isBusy || disabled} {...props}>
			{children}
			{isBusy && <Loading />}
		</Button>
	)
}

export default ActionButton
