import { useState, useCallback } from "react"

export const useTimeRange: () => [
  Date,
  (date: Date | null) => void,
  Date,
  (date: Date | null) => void
] = () => {
	const [startTime, setStartTime] = useState<Date>(new Date(Date.now()))
	const [endTime, setEndTime] = useState<Date>(new Date(Date.now()))

	const handleChangeStartTime = useCallback(
		(date: Date | null) => {
			if (!!date && date > new Date()) {
				setStartTime(date)
				if (date > endTime) {
					setEndTime(new Date(Number(date)))
				}
			}
		},
		[endTime]
	)

	const handleChangeEndTime = useCallback(
		(date: Date | null) => {
			if (!!date && date > new Date()) {
				setEndTime(date)
				if (date < startTime) {
					setStartTime(new Date(Number(date)))
				}
			}
		},
		[startTime]
	)

	return [startTime, handleChangeStartTime, endTime, handleChangeEndTime]
}
