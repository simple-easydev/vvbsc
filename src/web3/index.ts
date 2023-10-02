import { IQuestion } from "../pages/SubmitQuestions"
import { requestSignature } from "../axios/signature"
import addresses from "../contracts/addresses.json"

import voteAbi from "../contracts/RMVoteMain.sol/abi"
import pollAbi from "../contracts/Poll.sol/abi"
import tokenAbi from "../contracts/ERC20.sol/abi"

import { readContract, getAccount, writeContract, waitForTransaction, fetchBalance, getWalletClient, sendTransaction, prepareSendTransaction  } from "wagmi/actions"
import { parseGwei, encodePacked, keccak256, toBytes, Address, parseEther } from "viem"
import moment from "moment"
import { requestUpdatePoll } from "@/axios/poll"
import { CHAIN_ID } from "@/axios/config"
import { SystemFeeType } from "@/pages/FeePanel/SystemFee"
import { UserFeeType } from "@/pages/FeePanel/FeeWhiteList"

const getContractAddress = ():Address => {
	let voteAddrr = null
	if(CHAIN_ID == "97"){
		voteAddrr = addresses.testnet.vote
	}else if(CHAIN_ID == "56"){
		voteAddrr = addresses.main.vote
	}else if(CHAIN_ID == "137"){
		voteAddrr = addresses.polygon.vote
	}
	if(voteAddrr == null) throw new Error("Please connect Wallet, ChainID is not selected")
	return voteAddrr as Address
}

export const isManager = async () => {
	
	let result = false
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	try {
		result = await readContract({
			address: getContractAddress(),
			abi: voteAbi,
			args:[address],
			functionName: "isManager",
		})
		console.log("isManager -->", result)
	}catch(error){
		console.log(error)
	}
	return result
}

export const isOwner = async () => {

	const account = getAccount()

	const owner = await readContract({
		address: getContractAddress(),
		abi: voteAbi,
		functionName: "owner",
	})

	return (account.address == owner)
}

export const registerEMC = async () => {

	const value = await readContract({
		address:getContractAddress(),
		abi:voteAbi,
		functionName:"REGISTER_PRICE"
	})
	const { hash } = await writeContract({
		address:getContractAddress(),
		abi:voteAbi,
		functionName:"registerManager",
		value
	})

	const data = await waitForTransaction({
		hash
	})
}

export const createPoll = async (
	title: string,
	description: string,
	startTime: number,
	endTime: number,
	gasAmount: `${number}`,
	gasWallet: Address,
) => {

	const config = await prepareSendTransaction({to:gasWallet, value:parseEther(gasAmount)})
	const res = await sendTransaction(config)
	await waitForTransaction({ hash: res.hash })

	const pollPrice = await readContract({
		address:getContractAddress(),
		abi:voteAbi,
		functionName:"POLL_PRICE"
	})

	const { hash } = await writeContract({
		address:getContractAddress(),
		abi:voteAbi,
		args:[
			title,
			description,
			BigInt(startTime),
			BigInt(endTime),
			gasWallet,
		],
		functionName:"createPoll",
		value:pollPrice
	})

	const data = await waitForTransaction({
		hash
	})

	console.log("data ==>", data)

	return data.logs[0].address
}

export const updatePoll = async (
	poll: Address,
	title: string,
	description: string,
	openTime: number,
	closeTime: number,
	etherAmount: `${number}`,
) => {

	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const { hash } = await writeContract({
		address:poll,
		abi:pollAbi,
		functionName:"updatePollDetails",
		args:[
			title,
			description,
			BigInt(openTime),
			BigInt(closeTime)
		],
		value:parseGwei(etherAmount)
	})

	const data = await waitForTransaction({
		hash
	})
}

export const getUnclosedPolls = async () => {

	const polls = await readContract({
		address:getContractAddress(),
		abi:voteAbi,
		functionName:"getUnclosedPolls"
	})
	return polls
}

export const closePoll = async (poll: Address) => {

	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")
	try {
		const { data } = await requestSignature(
			{
				poll
			}
		)

		const { hash } = await writeContract({
			address:poll,
			abi:pollAbi,
			args:[ BigInt(data.nonce), data.signature as `0x${string}`],
			functionName:"closePoll"
		})
	
		const receipt = await waitForTransaction({
			hash
		})

		await requestUpdatePoll(poll, { isClosed:true})

	}catch(error:any){
		console.log(error)
		throw new Error(error.message)
	}

}

export const approveTokensForWhitelist = async (
	poll: Address,
	whitelistSize: number,
) => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const pollDetail = await getPollDetails(poll)

	if(!pollDetail) throw new Error("Error in fetching poll detail")


	const MAX_NUMBER_OF_VOTERS = await readContract({
		address:getContractAddress(),
		abi:voteAbi,
		functionName:"MAX_NUMBER_OF_VOTERS"
	})

	const newSize = whitelistSize < 0
		? MAX_NUMBER_OF_VOTERS
		: whitelistSize

	const amount = await readContract({
		address:poll,
		args:[BigInt(newSize)],
		abi:pollAbi,
		functionName:"estimateApproveTokenAmountForWhitelist",
		account:address
	})

	if(amount > 0){
		const { hash } = await writeContract({
			address:pollDetail.tokenAddress,
			args:[poll, amount],
			functionName:"approve",
			abi:tokenAbi,
		})

		const receipt = await waitForTransaction({
			hash
		})
		
	}

	return newSize
}

export const updateWhitelist = async (
	poll: Address,
	isCommunityVote: boolean,
	whitelistSize: number,
) => {

	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const { hash } = await writeContract({
		address:poll,
		abi:pollAbi,
		args:[isCommunityVote, BigInt(whitelistSize)],
		functionName:"updateWhitelist",
	})

	const reciept = await waitForTransaction({ hash })

	if (!address) throw new Error("Please connect Wallet")

}

export const approveTokensForQuestion = async (poll: Address) => {

	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const pollDetail = await getPollDetails(poll)
	const ABI = [
		"function approve(address _spender, uint256 _value) public returns (bool success)",
	] as const

	if(!pollDetail) throw new Error("Error in fetching poll detail")

	const amount = await readContract({
		address:getContractAddress(),
		abi:voteAbi,
		functionName:"TOKEN_AMOUNT_PER_QUESTION"
	})

	const { hash } = await writeContract({
		address:pollDetail.tokenAddress,
		abi:tokenAbi,
		args:[poll, amount],
		functionName:"approve"
	})

	const receipt = await waitForTransaction({ hash })
}

export const createQuestion = async (
	poll: Address,
	question: IQuestion,
) => {

	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const { hash } = await writeContract({
		address:poll,
		abi:pollAbi,
		args:[
			question.text,
			BigInt(question.type),
			question.choices		
		],
		functionName:"createQuestion"
	})

	const receipt = await waitForTransaction({ hash })
}

export const updateQuestion = async (
	poll: Address,
	questionId: number,
	question: IQuestion
) => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const { hash } = await writeContract({
		address:poll,
		abi:pollAbi,
		args:[
			BigInt(questionId),
			question.text,
			BigInt(question.type),
			question.choices		
		],
		functionName:"updateQuestion"
	})

	const receipt = await waitForTransaction({ hash })
}

export const deleteQuestion = async (
	poll: Address,
	questionId: number,
	
) => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const { hash } = await writeContract({
		address:poll,
		abi:pollAbi,
		functionName:"deleteQuestion",
		args:[BigInt(questionId)]
	})

	const receipt = await waitForTransaction({ hash })
}

export const getPollsByManager = async () => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const polls = await readContract({
		address:getContractAddress(),
		abi:voteAbi,
		functionName:"getPollsByManager",
		account:address
	})
	return polls
}

export const getActivePollsByManager = async () => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")
	const polls = await readContract({
		address:getContractAddress(),
		abi:voteAbi,
		functionName:"getActivePollsByManager",
		account:address
		
	})

	return polls
}

export const getFinishedPollsByManager = async () => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const polls = await readContract({
		address:getContractAddress(),
		abi:voteAbi,
		functionName:"getFinishedPollsByManager",
		account:address
	})
	return polls
}

export const getActivePollsByVoter = async (polls: string[], ) => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	return []
}

export const getComingPollsByVoter = async (ids: number[], ) => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")
	return []
}

export const getPollDetails = async (poll: Address) => {

	try {
		const data =  await readContract({
			address:poll,
			abi:pollAbi,
			functionName:"getPollDetail"
		})
	
		return {
			title: data[0],
			description: data[1],
			manager: data[2],
			gasWallet: data[3],
			tokenAddress: data[4],
			openTime: moment.unix(Number(data[5])),
			closeTime: moment.unix(Number(data[6])),
			isCommunityVote: data[7],
			sizeOfWhitelist: data[8],
			etherBalance: data[9],
			tokenBalance: data[10],
			numOfQuestions:data[11]
		}
	}catch(error){
		console.log(error)
	}

	return null


}

export const isVoted = async (poll: Address) => {

	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")
	try {
		const data =  await readContract({
			address:poll,
			abi:pollAbi,
			args:[address],
			functionName:"isVoted"
		})
	
		return data
	}catch(error){
		console.log(error)
	}

	return false


}

export const getQuestions = async (poll: Address, ) => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const questions = await readContract({
		address:poll,
		abi:pollAbi,
		functionName:"getQuestions"
	})
	return questions
}

export const getQuestionDetails = async (
	poll: Address,
	questionId: number,
	
) => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")


	const questions = await readContract({
		address:poll,
		abi:pollAbi,
		args:[BigInt(questionId)],
		functionName:"getQuestionDetails"
	})
	return questions

}

export const voteQuestions = async (
	poll: Address,
	answers: number[][],
	
) => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")
}

export const getVoteResult = async (
	poll: Address	
) => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const result = await readContract({
		address:poll,
		abi:pollAbi,
		functionName:"getVoteResult",
		account:address
	})

	return result
}

export const getContractBalance = async () => {
	const balance = await fetchBalance({ address: getContractAddress(), formatUnits:"ether" })
	return balance
}

export const getWithdrawableAmount = async () => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const balance = await fetchBalance({ address: getContractAddress(), formatUnits:"ether" })
	return balance
}

export const withdraw = async (amount: number, ) => {
	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")

	const { hash } = await writeContract({
		address:getContractAddress(),
		abi:voteAbi,
		args:[ address, BigInt(amount)],
		functionName:"withdraw"
	})

	const receipt = await waitForTransaction({ hash })

}


export const signVoteApi = async (poll:Address) => {

	const { address } = getAccount()
	if (!address) throw new Error("Please connect Wallet")
	const nonce = Date.now()
	const messageHash = keccak256(encodePacked(["address","uint256", "uint256"], [poll, BigInt(0), BigInt(nonce)]))
	const messageHashBytes = toBytes(messageHash)
	const client = await getWalletClient()
	const vote_signature = await client?.signMessage({ message: { raw: messageHashBytes} })
	return { 
		vote_signature, 
		nonce,
		amount:0
	}

}

export const sendValue =async (to:Address, value:bigint) => {
	const account = getAccount()
	if (!account.address) throw new Error("Please connect Wallet")
	console.log("value ==>", value)
	const res = await sendTransaction({ to, value })
	console.log("res ==>", res)
}

export const getSystemFee = async () => {
	const account = getAccount()
	if (!account.address) throw new Error("Please connect Wallet")
	try {
		const fee = await readContract({
			address:getContractAddress(),
			abi:voteAbi,
			functionName:"systemFeePolicy"
		})
		return {
			feePollOnOff:fee[0],
			feeQuestionOnOff:fee[1],
			feeWhitelistOnOff:fee[2],
		}
	}catch(error){
		console.log(error)
	}

	return {
		feePollOnOff:false,
		feeQuestionOnOff:false,
		feeWhitelistOnOff:false,
	}
}

export const updateSystemFee = async (data:SystemFeeType) => {
	const account = getAccount()
	if (!account.address) throw new Error("Please connect Wallet")
	try {
		const { hash } = await writeContract({
			address:getContractAddress(),
			abi:voteAbi,
			args:[ data.feePollOnOff, data.feeQuestionOnOff, data.feeWhitelistOnOff],
			functionName:"updateSystemFeePolicy"
		})
	
		const receipt = await waitForTransaction({ hash })
		
	}catch(error){
		console.log(error)
	}
}

export const updateUserFee = async (data:UserFeeType) => {
	const account = getAccount()
	if (!account.address) throw new Error("Please connect Wallet")
	try {
		const { hash } = await writeContract({
			address:getContractAddress(),
			abi:voteAbi,
			args:[ 
				data.pollCreator, 
				data.disableFeePollOnState, 
				data.disableFeeQuestionOnState,
				data.disableFeeWhiteListOnState,
				data.enableFeePollOffState,
				data.enableFeeQuestionOffState,
				data.enableFeeWhiteListOffState,
			],
			functionName:"updateFeePolicy"
		})
	
		const receipt = await waitForTransaction({ hash })
		
	}catch(error){
		console.log(error)
	}
}