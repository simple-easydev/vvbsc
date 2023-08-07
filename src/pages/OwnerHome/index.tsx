import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const OwnerHome: React.FC = () => {
	const navigate = useNavigate()

  
	useEffect(() => navigate("/owner/view/unclosed"), [])

	return null
}

export default OwnerHome
