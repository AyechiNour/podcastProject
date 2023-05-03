import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import React, { useContext, useRef } from "react";
import axios from 'axios';
import LoginContext from "@/context/loginContext";

export function SignIn() {

  const email = useRef(null)
  const password = useRef(null)
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);

  const signin = () => {
    const emailValue = email.current.getElementsByTagName('input')[0].value
    const passwordValue = password.current.getElementsByTagName('input')[0].value
    const user = axios.post('http://localhost:3000/user/signIn', { email: emailValue, password: passwordValue })
    user.then((result) => {
      if (result.data.status) {
        localStorage.setItem('token', result.data.token)
        setIsLoggedIn(true)
        navigate('/dashboard/profile');
      }

    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <div>
      {/* <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      /> */}
      <div className="absolute inset-0 z-0 h-full w-full" style={{ backgroundColor: "rgb(240 249 255)" }} />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input type="email" label="Email" size="lg" ref={email} />
            <Input type="password" label="Password" size="lg" ref={password} />
            <div className="-ml-2.5">
              <Checkbox label="Remember Me" />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={() => { signin() }}>
              Sign In
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Don't have an account?
              <Link to="/auth/sign-up">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default SignIn;