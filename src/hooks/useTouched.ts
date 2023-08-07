import { useState, useCallback, FocusEventHandler } from "react"

type Touched = { [k: string]: boolean };

export const useTouched: () => [
  Touched,
  FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
] = () => {
	const [touched, setTouched] = useState<Touched>({})

	const handleBlur = useCallback<FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>>(({ target: { name } }) => {
		setTouched((prev) => ({ ...prev, [name]: true }))
	}, [])

	return [touched, handleBlur]
}
