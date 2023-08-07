import React, {
	ChangeEventHandler,
	useCallback,
	useEffect,
	useState,
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAlert } from "react-alert"
import { Button, Theme, Box, Typography, Divider, Checkbox, IconButton, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useAccount } from "wagmi"
import SVG from "react-inlinesvg"
import openFileDialog from "file-dialog"

import { approveTokensForWhitelist, updateWhitelist } from "../../web3"
import { requestUpdatePoll } from "../../axios/poll"
import { useAlertError, useDoing } from "../../hooks"
import { Address, parseEther } from "viem"
import { Color } from "../../color"
import ActionButton from "../../components/ActionButton"
import { getTokenHolderList } from "@/axios/account"
import { useFormik } from "formik"
import * as Yup from "yup"


const useStyles = makeStyles((theme:Theme) => ({
	container: {
		paddingLeft: 262,
		[theme.breakpoints.down("sm")]: { paddingLeft: 72 },
	},
	header: {
		borderBottom: `1px solid ${Color.Border}`,
	},
	progress: {
		height: 10,
	},
	trash: {
		width: 18,
		height: 18,
	},
}))

type Props = {
  initialUpload?: boolean;
};

interface CommunityFormType {
	token:Address;
	minumAmount?: number;
}

const SubmitWhitelist: React.FC<Props> = ({ initialUpload }) => {
	const classes = useStyles()
	const navigate = useNavigate()
	const alertError = useAlertError()
	const { success: alertSuccess } = useAlert()
	const { poll } = useParams<{ poll:Address }>()
	const { address } = useAccount()
	
	const [isCommunityVote, setCommunityVote] = useState<boolean>(false)
	const [whitelistFile, setWhitelistFile] = useState<File>()
	const [whitelist, setWhitelist] = useState<Address[]>([])
	const [isCheckingFile, setBusyCheckingFile, setFreeCheckingFile] = useDoing()
	const [isSubmitting, setBusySubmitting, setFreeSubmitting] = useDoing()

	const communityForm = useFormik({
		initialValues:{
			token:"0x00",
			minumAmount:0,
		},
		validationSchema:Yup.object({
			token: Yup.mixed<Address>().required("Required"),
			minumAmount: Yup.number().notRequired(),
		}),
		onSubmit:async (values:CommunityFormType, { setSubmitting }) => {
			setSubmitting(true)
			const res = await getTokenHolderList(values.token)
			const fArr = res.data.filter((ele:any)=>ele.balance > parseEther(`${values.minumAmount || 0}`)).map((ele:any)=>ele.address)
			setWhitelist(fArr)
		}
	})


	useEffect(() => {
		if (whitelistFile) {
			setBusyCheckingFile()
			const reader = new FileReader()
			reader.addEventListener("load", function () {
				const newWhitelist =(this.result
					?.toString()
					.split("\r\n")
					.filter((addr) => !!addr) || []) as Address[]
				setWhitelist(newWhitelist)
				setFreeCheckingFile()
			})
			reader.readAsText(whitelistFile)
		} else {
			setWhitelist([])
		} 
	}, [whitelistFile])

	const handleSubmit = useCallback<any>(
		async (e:any) => {
			e.preventDefault()
			setBusySubmitting()
			if (address) {
				try {
					if (poll !== undefined) {
						const whitelistSize = await approveTokensForWhitelist(
							poll,
							whitelist.length,
						)
						await updateWhitelist(poll, !isCommunityVote, Number(whitelistSize))
						await requestUpdatePoll(
							poll,
							{ whitelist },
						)
						alertSuccess("Whitelist submitted.")
						navigate(`/manager/submit-questions/${poll}/0`)
					}
				} catch (err) {
					console.log(err)
					const { name, response } = err as any
					if (name === "AxiosError" && (response as any)?.status === 422) {
						try {
							await requestUpdatePoll(poll!, isCommunityVote ? { whitelist } : { whitelist:[] })
							alertSuccess("Whitelist submitted.")
							navigate(`/manager/submit-questions/${poll}/0`)
						} catch (err) {
							alertError(err as Error)
						}
					} else {
						alertError(err as Error)
					}
				}
				setFreeSubmitting()
			}
		}, 
		[poll, isCommunityVote, whitelist.length, address]
	)

	const handleChangeisCommunityVote = useCallback<ChangeEventHandler<HTMLInputElement>>(({ target: { checked } }) => {
		setCommunityVote(checked)
	}, [])

	const handleOpenFileDialog = useCallback(() => {
		openFileDialog({ multiple: false, accept: ".csv" }).then((files) =>
			setWhitelistFile(files[0])
		)
	}, [])

	return (
		<Box sx = {{ p:2 }}>
			<Box>
				<Typography variant="h5" sx = {{ mb:1 }}>Whitelist</Typography>
				<Divider />
				<Box sx = {{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", mt:2, gap:4 }}>
					<Box display="flex" alignItems={"center"}>
						<Button component={"label"} sx={{ textTransform:"none"}}>
							<Checkbox
								name="gasProvided"
								defaultChecked = {false}
								value={!isCommunityVote}
								onChange={handleChangeisCommunityVote}
							/>
							Enable Community Vote?
						</Button>
					</Box>

					{
						isCommunityVote && 
						<Box sx = {{ flex:1, gap:2, alignItems:"center" }}>
							<TextField
								fullWidth
								margin="dense"
								name="token"
								label="Token Address"
								onChange={communityForm.handleChange}
								error={communityForm.touched.token && Boolean(communityForm.errors.token)}
								helperText={communityForm.touched.token && communityForm.errors.token}
							/>
							<TextField 
								fullWidth
								margin="dense"
								name="minumAmount"
								label="Minimum Balance"
								onChange={communityForm.handleChange}
								error={communityForm.touched.minumAmount && Boolean(communityForm.errors.minumAmount)}
								helperText={communityForm.touched.minumAmount && communityForm.errors.minumAmount}
							/>
							<ActionButton isBusy = {communityForm.isSubmitting} size="small" onClick={()=>communityForm.submitForm()}>Confirm Token</ActionButton>
							<Typography>Whitelist: {whitelist.length}</Typography>
						</Box>
					}

					{!isCommunityVote && (
						<Box sx = {{ display:"flex", gap:2, alignItems:"center" }}>
							{whitelistFile && (whitelist && whitelist.length > 0 ? (
								<Box>
									<Typography component="span">{whitelistFile.name}</Typography>
									<IconButton onClick={() => setWhitelistFile(undefined)}>
										<SVG
											className={classes.trash}
											src="/media/svg/trash.svg"
										/>
									</IconButton>
								</Box>
							) : (
								<Typography>No valid address.</Typography>
							))}
							<ActionButton
								disabled={isCheckingFile || !!isSubmitting}
								isBusy={isCheckingFile}
								onClick={handleOpenFileDialog}
							> Upload Voter List </ActionButton>
							<a className="text-primary" href="/media/doc/whitelist.csv" download>Get Template</a>
						</Box>
					)}
				</Box>
				
				<Box sx = {{ display:"flex", justifyContent:"end", gap:1, mt:3 }}>
					<ActionButton
						isBusy={communityForm.isSubmitting || isSubmitting}
						disabled={!!isSubmitting || isCheckingFile || !whitelist.length}
						onClick={handleSubmit}
					>Next</ActionButton>
					{!initialUpload && (
						<Button
							variant="contained"
							type="submit"
							disabled={!!isSubmitting}
							onClick={() => navigate(`/manager/submit-questions/${poll}/0`)}
						> Skip
						</Button>
					)}
				</Box>

			</Box>
		</Box>
	)
}

export default SubmitWhitelist
