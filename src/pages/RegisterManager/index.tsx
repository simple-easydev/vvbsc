import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Checkbox, Box, Typography } from "@mui/material"
import { useAccount } from "wagmi"

import useAuth from "@/appRedux/auth/auth.hook"
import { registerEMC } from "../../web3"
import { useAlertError, useDoing } from "../../hooks"
import ActionButton from "../../components/ActionButton"
import { T_SYMBOL } from "@/axios/config"

const RegisterManager: React.FC = () => {
	const navigate = useNavigate()
	const alertError = useAlertError()
	const { setManager } = useAuth()
	const { address } = useAccount()
	
	const [isBusy, setBusy, setFree] = useDoing()
	const [agreed, setAgreed] = useState<boolean>(false)

	const handleRegister = useCallback(() => {
		if (address) {
			setBusy()
			registerEMC()
				.finally(setFree)
				.then(() => {
					setManager(true)
					navigate("/manager/welcome")
				})
				.catch(alertError)
		}
    
	}, [address])

	return (
		<Container
			className="d-flex flex-column align-items-center justify-content-center px-2 px-md-5 py-4"
		>
			<h1 className="text-center mb-5">Poll Manager Registration</h1>
			<div className="d-flex flex-column align-items-center mb-1">
				<h5 className="fw-bold mb-3">
          Terms and Conditions – Rematic Voting Platform
				</h5>
				<div>
					<p>
					By using any web site function (“Sites”) or by using any services of Rematic and or its subsidies (“Rematic”), you are agreeing to be bound by the following terms and conditions (“Terms of Service”). Rematic reserves the right to update and change the Terms of Service from time to time without notice. You can review the most current version of the Terms of Service at any time at:{" "}
						<a href="https://vvbsc.vercel.app/manager/register" target="_blank" rel="noreferrer">
						https://vvbsc.vercel.app/manager/register
						</a>
					</p>
					<div>
						<span className="fw-bold">Account Terms</span>
						<ul>
							<li>
								You must be a human. Accounts registered by “bots” or other automated methods are not permitted.
							</li>
							<li>You are responsible for maintaining the security of your account and password. Rematic cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</li>
							<li>You are responsible for all activity that occurs under your account.</li>
							<li>You may not use the Service for any illegal or unauthorized purpose. In the use of the Service, you must not violate any laws in your jurisdiction.</li>
							<li>You are not authorized to use our service to send unsolicited (“spam”) mail.</li>
						</ul>
					</div>
					<p>Violation of any of these agreements may result in the termination of your Account.</p>
					<div>
						<span className="fw-bold">Payment Terms</span>
						<ul>
							<li>A valid wallet containing RMTX and BNB tokens are required to activate elections. You are not required to provide a credit card number or any other payment information.
							</li>
							<li>Your web3 address information is stored by Rematic, but is not associated with any PII. RMTX does not sent out or distribute information externally, to any party, for any reason.
							</li>
							<li>No Refunds.</li>
							<li>All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities, and you shall be responsible for payment of all such taxes, levies, or duties if applicable.
							</li>
						</ul>
					</div>
					<div>
						<span className="fw-bold">Cancellation and Termination</span>
						<ul>
							<li>Rematic, in its sole discretion, has the right to suspend or terminate your account and refuse any or all current or future use of the Service, or any other Rematic service, for any reason at any time.
							</li>
						</ul>
					</div>
					<div>
						<span className="fw-bold">
              Modifications to the Service and Prices
						</span>
						<ul>
							<li>Rematic reserves the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
							</li>
							<li>Prices of all Services are subject to change without notice.
							</li>
							<li>Rematic shall not be liable to you or to any third party for any modification, price change, suspension or discontinuance of the Service.
							</li>
						</ul>
					</div>
					<div>
						<span className="fw-bold">Copyright and Content Ownership</span>
						<ul>
							<li>We claim no intellectual property rights over the material you provide to the Service. Your profile and materials uploaded remain yours, however, elections, related information, and election results, are publicly viewable via Blockchain.
							</li>
							<li>The Smart contract code deployed on the Binance Smart Chain Contract Number 0x46C8E62520dc11aA93C20C1fDEB755Bcb4b5470c or anywhere else, may not be used by anyone without written permission from Rematic. Use of any Rematic service or code without written permission from Rematic is strictly prohibited.
							</li>
						</ul>
					</div>
					<div>
						<span className="fw-bold">Availability</span>
						<ul>
							<li>Any performance times stated by Rematic are calculated from uptime and maintenance schedules provided by 3rd party suppliers. You are responsible for requesting this information from Rematic.</li>
							<li>
								Rematic cannot be held responsible for any downtime prior to, during, or after any specific election. You are responsible for determining your comfort level of holding an election without any guaranteed uptime KPIs.
							</li>
							<li>
								Rematic Voting platform relies on AWS, Vercel, WIX, Binance Smart Chain, Polygon Chain and other 3rd party services for operability. Any issues resulting from any 3rd party are not the responsibility of Rematic.
							</li>
						</ul>
					</div>
					<div>
						<span className="fw-bold">Links to Other Sites</span>
						<ul>
							<li>
								The information provided on this site is free of charge and for informational purposes only and does not create a business or professional services relationship between you and Rematic. Links on this site may lead to services or sites not operated by Rematic. No judgment or warranty is made with respect to such other services or sites and Rematic takes no responsibility for such other sites or services.
							</li>
							<li>
								A link to another site or service is not an endorsement of that site or service. Any use you make of the information provided on this site, or any site or service linked to by this site, is at your own risk.
							</li>
						</ul>
					</div>
					<div>
						<span className="fw-bold">General Conditions</span>
						<ul>
							<li>Your use of the Service is at your sole risk. The service is provided on an “as is” and “as available” basis.</li>
							<li>You must not modify, adapt, alter or hack the Service or modify another website so as to falsely imply that it is associated with the Service, Rematic, or any other Rematic Entity.</li>
							<li>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, computer code that powers the Service, or access to the Service without the express written permission by Rematic.</li>
							<li>Rematic does not warrant that (i) the service will meet your specific requirements, (ii) the service will be uninterrupted, timely, secure, or error-free, (iii) the results that may be obtained from the use of the service will be accurate or reliable, (iv) the quality of any products, services, information, or other material purchased or obtained by you through the service will meet your expectations, and (v) any errors in the Service will be corrected.</li>
							<li>You expressly understand and agree that Rematic shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if Rematic has been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the service; (ii) the cost of procurement of substitute goods and services resulting from any goods, data, information or services purchased or obtained or messages received or transactions entered into through or from the service; (iii) unauthorized access to or alteration of your transmissions or data; (iv) statements or conduct of any third party on the service; or (v) any other matter relating to the service.</li>
							<li>The failure of Rematic to exercise or enforce any right or provision of the Terms of Service shall not constitute a waiver of such right or provision. The Terms of Service constitutes the entire agreement between you and Rematic and govern your use of the Service, superseding any prior agreements between you and Rematic (including, but not limited to, any prior versions of the Terms of Service).</li>
							<li>You understand and agree that as an administrator, you will share certain information about your voters in order to facilitate the voting process, namely sending notices, recording the vote, tallying the winners, sharing the results and confirming the validity of the vote. Rematic warrants that it will undertake commercially reasonable efforts to safeguard voter information and will not share voter information with any external third party without written authorization from the election manager.</li>
							<li>Questions about these terms should be sent to:{" "}
								{/* eslint-disable-next-line react/jsx-no-target-blank */}
								<a href="https://info@rematictokens.com" target="_blank">
								info@rematictokens.com
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<Box display={"flex"} justifyContent={"end"}>
				<Box display={"flex"} flexDirection={"column"} alignItems={"center"} mb={4}>
					<Box display="flex" alignItems={"center"}>
						<Checkbox
							name="agree"
							onChange={({ target: { checked } }: any) => setAgreed(checked)}
						/>
						<Typography>I agree.</Typography>
					</Box>

					<ActionButton
						className="px-3 text-uppercase mb-5"
						disabled={!agreed}
						isBusy={isBusy}
						onClick={handleRegister}
					>Next
					</ActionButton>
				</Box>

			</Box>
		</Container>
	)
}

export default RegisterManager
