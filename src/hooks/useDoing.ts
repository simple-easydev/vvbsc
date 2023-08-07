import { useReducer, Reducer } from "react"

enum ActionType {
  SetBusy = "SetBusy",
  SetFree = "SetFree",
}

type Action = {
  type: ActionType;
};

const reducer: Reducer<boolean, Action> = (state, action) => {
	switch (action.type) {
	case ActionType.SetBusy:
		return true

	case ActionType.SetFree:
		return false

	default:
		return state
	}
}

export const useDoing: () => [boolean, () => void, () => void] = () => {
	const [isBusy, dispatch] = useReducer<Reducer<boolean, Action>>(
		reducer,
		false
	)

	return [
		isBusy,
		() => dispatch({ type: ActionType.SetBusy }),
		() => dispatch({ type: ActionType.SetFree }),
	]
}
