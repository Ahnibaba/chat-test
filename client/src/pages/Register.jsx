import { useContext, useEffect } from "react"
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap"
import { AuthContext } from "../context/AuthContext"

const Register = () => {
    const { 
      updateRegisterInfo,
      registerInfo, 
      setRegisterInfo,
      registerUser,
      registerError,
      registerSuccess, 
      isRegisterLoading,
      timeOut,
      successTimeOut
    } = useContext(AuthContext)


    setTimeout(timeOut, 7000);
    setTimeout(successTimeOut, 7000);

    useEffect(() => {
      if(registerSuccess) {
        setRegisterInfo( prev => ({ ...prev,
          name: "",
          email: "",
          password: ""
      }))
      }
    }, [registerSuccess, setRegisterInfo])

    
 
  
  
    
  return (

    <>
        <Form onSubmit={registerUser}>
            <Row style={{ 
                height: "100vh",
                justifyContent:"center",
                paddingTop: "10%"

             }}>
                <Col xs={6}>
                    <Stack gap={3}>
                       <h2>Register</h2>
              

                       <Form.Control 
                         type="text"
                         placeholder="Name"
                         value={registerInfo.name}
                         onChange={(e) => 
                          updateRegisterInfo({ ...registerInfo, name: e.target.value })
                         }

                        />
                       <Form.Control 
                         type="email"
                         placeholder="Email"
                         value={registerInfo.email}
                         onChange={(e) =>
                          updateRegisterInfo({ ...registerInfo, email: e.target.value })
                         }
                       />
                       <Form.Control  
                          type="password"
                          placeholder="Password"
                          value={registerInfo.password}
                          onChange={(e) => 
                            updateRegisterInfo({ ...registerInfo, password: e.target.value })
                          }
                         />
                       <Button variant="primary" type="submit">
                         { isRegisterLoading ? "Creating your account" : "Register" }
                       </Button>

                       {registerError?.error && (
                        <Alert variant="danger">
                        <p>{registerError?.message}</p>
                       </Alert>
                       )}
                       {registerSuccess && (
                        <Alert variant="success">
                        <p>{registerSuccess}</p>
                       </Alert>
                       )}
                       

                    </Stack>
                </Col>
            </Row>
        </Form>
    </>
  )
}

export default Register