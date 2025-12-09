import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "ap-south-1",
    userPoolId: "YOUR_POOL",
    userPoolWebClientId: "YOUR_CLIENT",
  }
});
