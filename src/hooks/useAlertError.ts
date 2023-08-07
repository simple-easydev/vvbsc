import { useAlert } from "react-alert"

export const useAlertError = () => {
	const { error } = useAlert()
	return (err: any) => {
		if(err.response){
			if(err.response.data){
				error(err.response.data.message)
			}
		}else{
			error(err.reason || err.message)
		}
	}
}

export const useResponseError =() => {
	const { error } = useAlert()
	return (err: any) => {
		if(err.response){
			if(err.response.data){
				error(err.response.data.message)
			}
		}
	}
}
