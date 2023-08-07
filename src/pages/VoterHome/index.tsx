import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const VoterHome: React.FC = () => {
	const navigate = useNavigate()

  
	useEffect(() => navigate("/voter/view/active"), [])

	return null
}

export default VoterHome
