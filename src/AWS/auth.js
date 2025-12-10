import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { poolData } from "./cognitoconfig";

const UserPool = new CognitoUserPool(poolData);

// SIGN UP
export function signUp(email, password) {
  const attributes = [
    new CognitoUserAttribute({
      Name: "email",
      Value: email,
    }),
  ];

  return new Promise((resolve, reject) => {
    UserPool.signUp(email, password, attributes, null, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// CONFIRM OTP
export function confirmSignUp(email, code) {
  const user = new CognitoUser({ Username: email, Pool: UserPool });

  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// LOGIN
export function login(email, password) {
  const user = new CognitoUser({ Username: email, Pool: UserPool });
  const auth = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(auth, {
      onSuccess: resolve,
      onFailure: reject,
    });
  });
}



// STEP 1: Request password reset (send OTP)
export function forgotPassword(email) {
  const user = new CognitoUser({
    Username: email,
    Pool: UserPool,
  });

  return new Promise((resolve, reject) => {
    user.forgotPassword({
      onSuccess: resolve,
      onFailure: reject,
    });
  });
}

// STEP 2: Submit OTP + new password
export function confirmForgotPassword(email, code, newPassword) {
  const user = new CognitoUser({
    Username: email,
    Pool: UserPool,
  });

  return new Promise((resolve, reject) => {
    user.confirmPassword(code, newPassword, {
      onSuccess: resolve,
      onFailure: reject,
    });
  });
}
