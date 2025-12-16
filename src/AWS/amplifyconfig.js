import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-south-1_idPb2CQ3Z",
      userPoolClientId: "5q8m5kgvagaq73l178ms7ccj3s",
      loginWith: {
        email: true
      }
    }
  }
});
