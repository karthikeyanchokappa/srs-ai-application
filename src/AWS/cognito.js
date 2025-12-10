import {
  CognitoUserPool,
  CognitoUser,
} from "amazon-cognito-identity-js";

import { awsConfig } from "./config";

// Create Cognito User Pool
const userPool = new CognitoUserPool({
  UserPoolId: awsConfig.userPoolId,
  ClientId: awsConfig.clientId,
});

// STEP 1: Send OTP (SignUp or Resend)
export const sendOTP = (username) => {
  return new Promise((resolve, reject) => {
    userPool.signUp(
      username,
      Math.random().toString(36).slice(2), // dummy password
      [],
      null,
      (err, result) => {
        if (err) {
          if (err.message.includes("already exists")) {
            // If user exists, resend OTP
            resendOTP(username)
              .then(resolve)
              .catch(reject);
          } else {
            reject(err);
          }
        } else {
          resolve(result);
        }
      }
    );
  });
};

// STEP 2: Resend OTP for existing users
export const resendOTP = (username) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    user.resendConfirmationCode((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// STEP 3: Verify OTP → Login User
export const verifyOTP = (username, code) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    user.confirmRegistration(code, true, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
