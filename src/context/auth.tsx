import React from "react";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "../aws-exportsc";

Amplify.configure(awsconfig);

type AuthProps = {
  isAuthenticated: boolean;
  authenticate: Function;
  signout: Function;
};

export const AuthContext = React.createContext({} as AuthProps);

const isValidToken = () => {
  const token = localStorage.getItem("pickbazar_token");
  // JWT decode & check token validity & expiration.
  if (token) return true;
  return false;
};

const AuthProvider = (props: any) => {
  const [isAuthenticated, makeAuthenticated] = React.useState(isValidToken());
  async function authenticate({ username, password }, cb) {
    console.log(username, password);
    let response = await Auth.signIn(username, password);
    // console.log(response);
    makeAuthenticated(true);
    localStorage.setItem("pickbazar_token", `${username}.${password}`);
    setTimeout(cb, 100); // fake async
  }
  async function signout(cb) {
    await Auth.signOut();
    makeAuthenticated(false);
    localStorage.removeItem("pickbazar_token");
    setTimeout(cb, 100);
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authenticate,
        signout
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
