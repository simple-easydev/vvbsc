import React, {
	useCallback,
	useEffect,
} from "react"
import { useNavigate } from "react-router-dom"
import { Container, Select, MenuItem, Box, Typography, Grid} from "@mui/material"

import useAuth from "@/appRedux/auth/auth.hook"
import { useDoing } from "../../hooks"
import ActionButton from "../../components/ActionButton"
import { UserType } from "@/utils/types"

const Authorization: React.FC = () => {
	const navigate = useNavigate()
	const { auth : { isManager, isOwner, userType }, setUserType } = useAuth()
	const [isBusy, setBusy, setFree] = useDoing()

	const handleNext = useCallback(() => {
		if (userType === UserType.VOTER) {
			navigate("/voter/home")
		} else if (userType === UserType.OWNER) {
			navigate("/owner/home")
		} else {
			if (isManager === undefined) {
				setBusy()
			} else if (isManager) {
				navigate("/manager/home")
			} else {
				navigate("/manager/register")
			}
		}
	}, [userType, isManager])

	useEffect(() => {
		if (isManager !== undefined && isBusy) {
			setFree()
			handleNext()
		}
    
	}, [isManager, isBusy])

	const handleChangeType = (event: any) => setUserType(event.target.value as UserType)
	
	return (
		<Container sx={{ height:"calc(100vh - 72px)"}}>
			<Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100%"} >
				<Grid container width={"100%"}>
					<Grid item xs = {6}>
						<Typography textAlign={"right"} variant="h1" fontSize={48} whiteSpace={"nowrap"} >I am a ...</Typography>
					</Grid>
					<Grid item xs = {6}></Grid>
						
				</Grid>
				<Select
					sx = {{
						width:"270px",
						mt:4,
						mb:4
					}}
					value={userType}
					onChange={handleChangeType}
				>
					{isOwner && <MenuItem value={UserType.OWNER}>Owner</MenuItem>}
					<MenuItem value={UserType.MANAGER}>Poll Creator</MenuItem>
					<MenuItem value={UserType.VOTER}>Voter</MenuItem>
				</Select>
				<ActionButton
					isBusy={isBusy}
					onClick={handleNext}
				>Next
				</ActionButton>
			</Box>
		</Container>
	)
}

export default Authorization
