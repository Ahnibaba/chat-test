import { useContext, useEffect, useState } from "react"
import { ChatContext } from "../context/chatContext"
import { getRequest } from "../utils/services"
import { baseUrl } from "../utils/services"

export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext)
    const [latestMessage, setLatestMessage] = useState(null)

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`)

            if(response.error) {
                return ("Error getting messages...", response.error);
                
            }

            const responseMessages = response.messages
            
            const lastMessage = responseMessages[responseMessages?.length - 1]
            console.log("lastMessage", lastMessage);
            

            setLatestMessage(lastMessage)
        }
        getMessages()
    }, [newMessage, notifications])

    return { latestMessage }
}