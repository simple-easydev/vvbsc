import React from "react"
import { Button, TextField, Box } from "@mui/material"

type Props = {
  action: "plus" | "minus";
  onAction: () => void;
  [k: string]: any;
};

const MultipleChoiceInput: React.FC<Props> = ({
	action,
	onAction: handleAction,
	...props
}) => {
	return (
		<Box sx = {{ width:"100%", position:"relative" }}>
			<TextField {...props} sx = {{ width:"100%" }} />
			<Button 
				onClick={handleAction} 
				sx = {{ position:"absolute", right:"4px", top:"4px", bottom:"4px", minWidth:"50px" }} 
				variant="contained">
				{action === "plus" ? "+" : "-"}
			</Button>
		</Box>
	)
}

export default MultipleChoiceInput
