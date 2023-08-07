import React from "react"
import { CircularProgress } from "@mui/material"

type Props = {
  color?: string;
};

const Loading: React.FC<Props> = () => {
	return (
		<>
			<CircularProgress size="sm" sx={{ width:"16px" }}/>
		</>
	)
}

export default Loading
