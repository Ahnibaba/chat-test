/* eslint-disable react/prop-types */
import { createContext, useCallback, useEffect, useState } from "react";
import { postRequest, baseUrl } from "../utils/services";

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [registerError, setRegisterError] = useState(null)
    const [registerSuccess, setRegisterSuccess] = useState(null)
    const [isRegisterLoading, setIsRegisterLoading] = useState(false)
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: ""
    })
    
    const [loginError, setloginError] = useState(null)
    const [loginSuccess, setLoginSuccess] = useState(null)
    const [isLoginLoading, setIsLoginLoading] = useState(false)
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    })
   

    useEffect(() => {
      const user = localStorage.getItem("User")

      setUser(JSON.parse(user))
    }, [])



    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])
    
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)
    }, [])

    const registerUser = useCallback(async (e) => {
        e.preventDefault()
        setIsRegisterLoading(true)
        setRegisterError(null)
        const response = await postRequest(`${baseUrl}/register`, registerInfo)
        setIsRegisterLoading(false)
        if (response.success) {
            setRegisterSuccess(response.message)
        }


        if (response.error) {
            return setRegisterError(response)
        }

        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    }, [registerInfo])

    const timeOut = () => {
        setRegisterError(false)
    }
    const successTimeOut = () => {
        setRegisterSuccess(false)
    }

    const logoutUser = useCallback(() => {
      localStorage.removeItem("User")
      setUser(null)
    }, [])

    const loginUser = useCallback(async(e) => {
        e.preventDefault()
        setIsLoginLoading(true)
        setloginError(null)
        const response = await postRequest(`${baseUrl}/login`, loginInfo)
        
        setIsLoginLoading(false)

        if(response.success) {
            setLoginSuccess(response.message)
        }

        if(response.error){
            return setloginError(response)
        }

        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    }, [loginInfo])


    const authValues = {
        user,
        registerInfo,
        setRegisterInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        timeOut,
        registerSuccess,
        successTimeOut,
        logoutUser,
        loginUser,
        loginError,
        loginSuccess,
        updateLoginInfo,
        isLoginLoading,
        loginInfo
    }
    return (
        <AuthContext.Provider value={authValues}>
            {children}
        </AuthContext.Provider>
    )
}