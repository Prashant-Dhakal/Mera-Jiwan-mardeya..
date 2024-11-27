import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bgbutton, Input } from "../index.js";
import { useForm } from "react-hook-form";
import {loginUser as loginServices} from "../../services/everyServices.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as reduxLogin } from "../../store/Authentication.js";

const Login = () => {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const login = async (data) => {
    try {
      const loginUser = await loginServices(data);
      if(loginUser){
        dispatch(reduxLogin(loginUser.data))
      }

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
        <div className="w-full">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
            <p className="mt-2 text-gray-500">
              Sign in below to access your account
            </p>
          </div>
          <div className="mt-5">
          {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(login)}>
              <div className="relative mt-6">
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: true,
                    validate: {
                      matchPattern: (value) =>
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                          value
                        ) || "Email address must be a valid address",
                    },
                  })}
                />
              </div>
              <div className="relative mt-6">
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: true,
                  })}
                />
              </div>
              <div className="my-6">
                <Bgbutton textContent="Login" />
              </div>
              <p className="text-center text-sm text-gray-500">
                Don&#x27;t have an account yet?
                <Link
                  to="/register"
                  className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
