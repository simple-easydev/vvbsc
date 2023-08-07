import React from "react"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import { useNavigate } from "react-router-dom"

export interface AppMenuItemComponentProps {
  children?: string | JSX.Element | JSX.Element[]
  link?: string | null // because the InferProps props allows alows null value
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const AppMenuItemComponent: React.FC<AppMenuItemComponentProps> = props => {
	const { onClick, link, children } = props
	const navigate = useNavigate()

	// If link is not set return the orinary ListItem
	if (!link || typeof link !== "string") {
		return (
			<ListItem
				onClick={onClick}
				disablePadding
			>
				<ListItemButton>
					{children}
				</ListItemButton>
			</ListItem>
		)
	}

	return (
		<ListItem disablePadding>
			<ListItemButton onClick={()=>{
				navigate(link)
			}}>
				{children}
			</ListItemButton>
		</ListItem>
	)
}

export default AppMenuItemComponent
