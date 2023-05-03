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
import React, { useContext, useRef,useState } from "react";
import axios from 'axios';
import LoginContext from "@/context/loginContext";
import _ from 'lodash';


export function SignIn() {

  const email = useRef(null)
  const password = useRef(null)
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const  [formErrors, updateFormErrors] = useState({});
  const validateEmail = (email) => email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const signin = () => {
    const emailValue = email.current.getElementsByTagName('input')[0].value
    const passwordValue = password.current.getElementsByTagName('input')[0].value
    let errors = {};

    // if (_.isEmpty(formData.email) || !Globals.validateEmail(formData.email)) errors = { ...errors, email: 'Your email is reqiured' };
    if (_.isEmpty(passwordValue)) errors = { ...errors, password: 'Your password is required' };
    if ((_.isEmpty(emailValue)) || !validateEmail(emailValue)) errors = { ...errors, email: 'Invalid email' };



    updateFormErrors(errors);

    if (!_.isEmpty(errors)) return; 
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
  const displayError = (key) => {
    if (!_.isEmpty(formErrors[key])) return <div className="text-red-700">{formErrors[key]}</div>
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
            {displayError('email')}

            <Input type="password" label="Password" size="lg" ref={password} />
            {displayError('password')}

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