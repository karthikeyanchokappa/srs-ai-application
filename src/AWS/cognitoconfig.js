import { CognitoUserPool } from "amazon-cognito-identity-js";

export const poolData = {
  UserPoolId: "ap-south-1_XXXXXXX",
  ClientId: "XXXXXXXXXXXXXXX",
};

export default new CognitoUserPool(poolData);
