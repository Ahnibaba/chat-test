/* eslint-disable react/prop-types */
import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services.js"
import io from "socket.io-client"


export const ChatContext = createContext()


export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null)
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
  const [userChatsError, setUserChatsError] = useState(null)
  const [potentialChats, setPotentialChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState(null)
  const [isMessagesLoading, setIsMessagesLoading] = useState(false)
  const [messagesError, setMessagesError] = useState(null)
  //const [sendTextMessageError, setTextMessageError] = useState(null)
  const [newMessage, setNewMessage] = useState(null)
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [notifications, setNotifications] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [textMessage, setTextMessage] = useState("")
  const [typing, setTyping] = useState("")





  

  const activityName = user?.userData?.name
  const recipientId = currentChat?.members.find((id) => id !== user?.userData?._id)
 
  


  
  

 
  useEffect(() => {
    const newSocket = io("https://chat-test-1-v51y.onrender.com/")
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [user])

  

  // add online users
  useEffect(() => {
    if(socket === null) return
    socket.emit("addNewUser", user?.userData?._id)
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res)
    })
    
    return () => {
      socket.off("getOnlineUsers")
    }
  }, [socket])

  

 


  // send message
  useEffect(() => {
    if(socket === null) return
    const recipientId = currentChat?.members.find((id) => id !== user?.userData?._id)
    socket.emit("sendMessage", { ...newMessage, recipientId })
    
    
  }, [newMessage])


 
  
 // Typing activity
  useEffect(() => {
    if (socket === null) return
    let activityTimer
    socket.on("activity", (name) => {
      setTyping(`${name} is typing...`)

      //clear after 2 seconds
      clearTimeout(activityTimer)
      activityTimer = setTimeout(() => {
        setTyping("")
      }, 2000);

    })
  }, [textMessage])

const handleChange = (text) => {
  setTextMessage(text)
  socket.emit("activity", { activityName, recipientId })
  
}

  // receive message and notification
  useEffect(() => {
    if(socket === null) return

    socket.on("getMessage", (res) => {
      if(currentChat?._id !== res.chatId) return
      setTyping("")
      setMessages((prev) => [...prev, res])
    })

    socket.on("getNotifications", async (res) => {
      console.log(res);
      
      const isChatOpen = currentChat?.members.some(id => id === res.senderId)

      if(isChatOpen) {
        setNotifications(prev => [{ ...res, isRead: true }, ...prev])
       
        await postRequest(`${baseUrl}/notifications/read`, { senderId: res.senderId, isRead: true })
      }
      else {
        setNotifications(prev => [res, ...prev])

        
     
      }
    })

    return () => {
      socket.off("getMessage")
      socket.off("getNotifications")
    }
    
  }, [socket, currentChat])




  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`)

      if (response.error) {
        console.log("Error fetching users", response);
        return
      }

      const pChats = response.users.filter((u) => {
        let isChatCreated = false

        if (user?.userData?._id === u._id) return false

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id
          })
        }

        return !isChatCreated
        


      })

      setPotentialChats(pChats)
      setAllUsers(response.users)

    }

    getUsers()
  }, [userChats])

  useEffect(() => {
    const getUserChats = async () => {
      if (user?.userData?._id) {
        setIsUserChatsLoading(true)
        setUserChatsError(null)

        const response = await getRequest(`${baseUrl}/chats/${user?.userData?._id}`)
        setIsUserChatsLoading(false)

        if (response.error) {
          return setUserChatsError(response)
        }

        setUserChats(response.chats)
        

      }


    }
    getUserChats()
  }, [user, notifications])

  //get messages
  useEffect(() => {
    const getMessages = async () => {

      setIsMessagesLoading(true)
      setMessagesError(null)

      const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)
      setIsMessagesLoading(false)

      if (response.error) {
        return setMessagesError(response)
      }

      setMessages(response.messages)




    }
    getMessages()
  }, [currentChat])

  //getNotifications
  useEffect(() => {
    const getNotifications = async() => {
      const response = await postRequest(`${baseUrl}/notifications`, { user: user?.userData?._id })

      if (response.error) {
        return console.log("Notification Error =>", response.error);
        
      }

      

      setNotifications(response?.notifications)
    }

    getNotifications()
  }, [socket, newMessage])






  const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
    if (!textMessage) return console.log("You must type something...")
    const messageBody = {
      chatId: currentChatId,
      senderId: sender._id,
      text: textMessage

    }
    
    const response = await postRequest(`${baseUrl}/messages`, messageBody)

    if (response.error) {
      return setMessagesError(response)
    }

    setNewMessage(response.newMessage )
    setMessages((prev) => [...prev, response.newMessage])
    setTextMessage("")

  
  }, [])

  const createNotification = useCallback(async (sender) => {
         
    const response = await postRequest(`${baseUrl}/notifications/new`, { senderId: sender._id, isRead: false })


    if (response.error) {
      console.log("Notification Error => ", response.error);
      
    }
  }, [])



  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat)
  }, [])


  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(`${baseUrl}/chats`, { firstId, secondId })

    if (response.error) {
      console.log("Error creating chat", response);
      return

    }



    setUserChats((prev) => [...prev, response.chat])
  }, [])


  const markAllNotificationsAsRead = useCallback(() => {
    
     const mNotifications = notifications.map(n => (
       {...n, isRead: true}
     ))

     setNotifications(mNotifications)
  }, [])

  const markNotificationAsRead = useCallback((n, userChats, user, notifications) => {
    
    //find chat to open
    const desiredChat = userChats.find(chat => {
      const chatMembers = [user?.userData?._id, n.senderId]
      const isDesiredChat = chat?.members.every((member) => {
        return chatMembers.includes(member)
      })

    
      

      return isDesiredChat
    })

    //mark notification as read
    const mNotifications = notifications.map(el => {
       if(n.senderId === el.senderId) {
        return  { ...n, isRead:true }
       }else {
        return el
       }
    })

    updateCurrentChat(desiredChat)
    setNotifications(mNotifications)
  }, [])

  const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications)=>{
    //mark notifications as read
    const mNotifications = notifications.map(el => {
      let notification

      thisUserNotifications.forEach(n => {
        if(n.senderId === el.senderId) {
          notification = { ...n, isRead: true }
        } else {
          notification = el
        }
    })
     return notification
    })

    setNotifications(mNotifications)
  }, [])


  const chatValues = {
    userChats,
    isUserChatsLoading,
    userChatsError,
    potentialChats,
    createChat,
    updateCurrentChat,
    messages,
    isMessagesLoading,
    messagesError,
    currentChat,
    sendTextMessage,
    createNotification,
    onlineUsers,
    notifications,
    allUsers,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    markThisUserNotificationsAsRead,
    textMessage,
    setTextMessage,
    handleChange,
    typing,
   


    
 
    
  
  }

  return (
    <ChatContext.Provider value={chatValues}>
      {children}
    </ChatContext.Provider>
  )
}