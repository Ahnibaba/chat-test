import { useContext } from "react"
import { ChatContext } from "../../context/chatContext"
import { AuthContext } from "../../context/AuthContext"


const PotentialChats = () => {
    const { user } = useContext(AuthContext)
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext)

    //console.log(potentialChats);
    //console.log(onlineUsers);
    
    
    
  return (
    <>
      <div className="all-users">
        {potentialChats && (
            potentialChats.map((u, index) =>(
                <div className="single-user" key={index} onClick={() => createChat(user.userData._id, u._id)}>
                    {u.name}
                    <span className={
                      onlineUsers?.some((user) => user?.userId === u?._id) ? "user-online" : ""
                    }>

                    </span>
                </div>
            ))
        )}
      </div>
    </>
  )
}

export default PotentialChats