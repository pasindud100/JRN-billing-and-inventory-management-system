import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

function SignIn() {
  return (
    <div className="bg-blue-950 lg:bg-black h-screen">
      <div className="flex items-center justify-center h-full text-white relative">
        <div className="w-[500px] h-[600px] bg-blue-950 opacity-70 rounded-lg hidden lg:inline  relative left-20">
          <div className=" flex flex-col justify-between h-full p-8">
            <h1 className="text-3xl font-semibold relative top-2">
              {" "}
              <span className="text-5xl font-bold bg-gradient-to-r from-red-800 via-red-400 to-red-800 bg-clip-text text-transparent">
                JRN{" "}
              </span>
              Roofing..
            </h1>
            <p className=" text-3xl font-thin relative ">
              {" "}
              <span className="text-4xl font-bold ml-2 bg-gradient-to-r from-yellow-500 via-yellow-100 to-yellow-600 bg-clip-text text-transparent">
                Welcome!
              </span>
              <br />
              Log in to streamline your operations. Choose your role to get
              started."{" "}
            </p>
          </div>
        </div>
        <div className=" w-[430px]  text-black bg-white rounded-md opacity-70 lg:opacity-70  relative right-0 lg:right-48  bottom-8 py-4 px-10">
          <h3 className="text-center text-2xl font-bold mb-2">Sign In</h3>
          <form className="flex flex-col gap-4  ">
            <div>
              <Label value="User Name" />
              <TextInput
                type="text"
                placeholder="user name"
                id="email"
                className=""
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="*********"
                id="password"
              />
            </div>
            <Button
              className=" bg-gradient-to-r from-indigo-700 via-indigo-400 to-indigo-700 rounded-lg text-white"
              type="submit"
            >
              Sign In
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-4">
            <span>If you don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
