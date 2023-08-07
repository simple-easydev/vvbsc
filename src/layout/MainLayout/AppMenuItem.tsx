import React from "react"
import PropTypes from "prop-types"
import List from "@mui/material/List"

import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import Collapse from "@mui/material/Collapse"

import IconExpandLess from "@mui/icons-material/ExpandLess"
import IconExpandMore from "@mui/icons-material/ExpandMore"

import AppMenuItemComponent from "./AppMenuItemComponent"

// React runtime PropTypes
export const AppMenuItemPropTypes = {
	name: PropTypes.string.isRequired,
	link: PropTypes.string,
	Icon: PropTypes.elementType,
	items: PropTypes.array,
}

type AppMenuItemPropTypes = PropTypes.InferProps<typeof AppMenuItemPropTypes>
type AppMenuItemPropsWithoutItems = Omit<AppMenuItemPropTypes, "items">

// Improve child items declaration
export type AppMenuItemProps = AppMenuItemPropsWithoutItems & {
  items?: AppMenuItemProps[]
}

const AppMenuItem: React.FC<AppMenuItemProps> = props => {
	const { name, link, Icon, items = [] } = props

	const isExpandable = items && items.length > 0
	const [open, setOpen] = React.useState(false)

	function handleClick() {
		setOpen(!open)
	}

	const MenuItemRoot = (
		<AppMenuItemComponent link={link} onClick={handleClick}>
			<>
				{!!Icon && (
					<ListItemIcon>
						<Icon />
					</ListItemIcon>
				)}
				<ListItemText primary={name} inset={!Icon} />
				{/* Display the expand menu if the item has children */}
				{isExpandable && !open && <IconExpandMore />}
				{isExpandable && open && <IconExpandLess />}
			</>
		</AppMenuItemComponent>
	)

	const MenuItemChildren = isExpandable ? (
		<Collapse in={open} timeout="auto" unmountOnExit>
			<Divider />
			<List>
				{items.map((item, index) => (
					<AppMenuItem {...item} key={index} />
				))}
			</List>
		</Collapse>
	) : null

	return (
		<>
			{MenuItemRoot}
			{MenuItemChildren}
		</>
	)
}

export default AppMenuItem
