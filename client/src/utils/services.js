import axios from "axios"
//export const baseUrl = "http://localhost:5000/api"
export const baseUrl ="https://chat-test-3k2v.onrender.com"

export const postRequest = async (url, body) => {



    try {
        const response = await axios.post(url, body)
    
        const { data } = response
   
        return data
    } catch (error) {
        console.log(error);
        
       let message
       if(error.response && error.response.data) {
        message = error.response.data.message || "An error occurred"
       } else {
         message = error.message || "Network error"
       }
       console.log("Error Response " + error.response);
       console.log("Error Message " + message);

       return { error: true, message }
       
       
    }


    // const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(body)
    // })



    // const data = await response.json()

    // console.log(data);


    // if(!response.ok){
    //     let message

    //     if(data?.message) {
    //         message = data.message
    //     } else {
    //         message = data
    //     }

    //     return { error: true, message }

    // }

    // return data


}


export const getRequest = async(url) => {

    // const response = await fetch(url)
    // const data = await response.json()

    // if(!response?.ok) {
    //     let message = "An error ocurred... "

    //     if(data?.message) {
    //         message = data.message
    //     }

    //     return { error: true, message }
    // }

    // return data

    try {
        const response = await axios.get(url)
        const { data } = response

        return data

    } catch (error) {
        let message
      if(error.response && error.response.data) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      return { error: true, message }
    }
}




