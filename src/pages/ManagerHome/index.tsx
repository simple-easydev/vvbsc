import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const ManagerHome: React.FC = () => {
	const navigate = useNavigate()

  
	useEffect(() => navigate("/manager/view/active"), [])

	return null
}

export default ManagerHome
