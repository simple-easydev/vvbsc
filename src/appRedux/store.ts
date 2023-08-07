import { useMemo } from "react"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import layoutReducer from "./layout/layout.reducer"
import authReducer from "./auth/auth.reducer"
import walletReducer from "./gasWallet/gasWallet.reducer"

const rootReducer = combineReducers({
	layoutReducer,
	authReducer,
	walletReducer,
})

const store = configureStore(
	{
		reducer: rootReducer,
	}
)

export type RootState = ReturnType<typeof rootReducer>

export default store