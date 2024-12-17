import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";
//import { ChatContext } from "../context/chatContext";

export const useFetchRecipient = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null) 
    const [error, setError] = useState(null)

    const recipientId = chat?.members.find((id) => id !== user?.userData?._id)

    useEffect(() => {
      const getUser = async () => {
        if(!recipientId) return null

        const response  = await getRequest(`${baseUrl}/users/${recipientId}`)

        if(response.error){
            setError(response.message)
        }

        setRecipientUser(response.user)
      }

      getUser()
    }, [recipientId])

    return { recipientUser, error }
}