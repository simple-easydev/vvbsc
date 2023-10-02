import _ from "lodash"
import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"
import { SystemFeeType } from "./SystemFee"
import { UserFeeType } from "./FeeWhiteList"
import { useNetwork } from "wagmi"
import * as web3API from "@/web3"
import * as RestAPI from "@/axios/fee"
import { useAlertError } from "@/hooks"


export type FeeDataContextTypes = {
    isRequesting: boolean;
    systemFee: SystemFeeType;
    feeWhiteList: UserFeeType[];
    loadSystemFee: ()=>void;
    updateSystemFee: (values:SystemFeeType)=>void;
    createUserFee: (values:UserFeeType)=>void;
    updateUserFee: (values:UserFeeType)=>void;
    loadAllFeeWhiteList: ()=>void;
    setIsRequesting: (flag:boolean)=>void;
};

export const FeeDataContext = createContext<FeeDataContextTypes>({
	systemFee: {
		feePollOnOff: false,
		feeQuestionOnOff: false,
		feeWhitelistOnOff: false
	},
	feeWhiteList: [],
	loadSystemFee: function (): void {
		throw new Error("Function not implemented.")
	},
	loadAllFeeWhiteList: function (): void {
		throw new Error("Function not implemented.")
	},
	setIsRequesting: function (): void {
		throw new Error("Function not implemented.")
	},
	isRequesting: false,
	updateSystemFee: function (): void {
		throw new Error("Function not implemented.")
	},
	createUserFee: function (): void {
		throw new Error("Function not implemented.")
	},
	updateUserFee: function (): void {
		throw new Error("Function not implemented.")
	}
})

interface Props {
    children:ReactNode
}

export const FeeDataProvider = (props:Props) => {

	const [systemFee, setSystemFee] = useState<SystemFeeType>({
		feePollOnOff: false,
		feeQuestionOnOff: false,
		feeWhitelistOnOff: false
	})
	const [feeWhiteList, setFeeWhitelist] = useState<UserFeeType[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isRequesting, setIsRequesting] = useState(false)
	const { chain } = useNetwork()
	const alertError = useAlertError()
    
	useEffect(() => {
		if(chain?.id){
			loadSystemFee()
			loadAllFeeWhiteList()
		}
	}, [chain])

	const loadSystemFee = () => {
		web3API.getSystemFee().then(data=>{
			setSystemFee(data)
		}).catch((error)=>{
			console.log("----error----")
			console.log(error)
		})
	}
    

	const loadAllFeeWhiteList = () => {
		RestAPI.getAllFeeList().then((res)=>{
			setFeeWhitelist(res.data)
		})
	}

	const updateSystemFee = async (sysFee:SystemFeeType) => {
		setIsRequesting(true)
		let isErr = false
		try {
			await web3API.updateSystemFee(sysFee)
		}catch(error){
			isErr = true
			console.log(error)
			alertError(error)
		}
		if(!isErr){
			setSystemFee(sysFee)
		}
	}
	const updateUserFee = async (userFee:UserFeeType) => {
		setIsRequesting(true)
		let isErr = false
		try {
			await web3API.updateUserFee(userFee)
		}catch(error){
			console.log(error)
			isErr = true
			alertError(error)
		}

		// update sever
		if(!isErr){
			try {
				await RestAPI.requestUpdateFeeWhitelist(userFee)
			}catch(error){
				console.log(error)
				isErr = true
				alertError(error)
			}
		}

		setIsRequesting(false)

		if(!isErr){
			const index = _.findIndex(feeWhiteList, (ele)=>ele.pollCreator == userFee.pollCreator)
			const newArr = _.update(feeWhiteList, index, ()=>userFee)
			setFeeWhitelist(newArr)
			loadAllFeeWhiteList()
		}
		
	}

	const createUserFee = async (userFee:UserFeeType) => {
		setIsRequesting(true)
		let isErr = false
		try {
			await web3API.updateUserFee(userFee)
		}catch(error){
			console.log(error)
			isErr = true
			alertError(error)
		}

		// update sever
		if(!isErr){
			try {
				await RestAPI.requestCreateFeeWhitelist(userFee)
			}catch(error){
				console.log(error)
				isErr = true
				alertError(error)
			}
		}

		setIsRequesting(false)

		if(!isErr){
			setFeeWhitelist([userFee, ...feeWhiteList])
			loadAllFeeWhiteList()
		}

	}

	return (
		<FeeDataContext.Provider
			value={{
				systemFee,
				feeWhiteList,
				isRequesting,
				loadSystemFee,
				updateSystemFee,
				createUserFee,
				updateUserFee,
				loadAllFeeWhiteList,
				setIsRequesting
			}}
		>
			{props.children}
		</FeeDataContext.Provider>
	)
}

export const useFeeData = () => useContext(FeeDataContext)
