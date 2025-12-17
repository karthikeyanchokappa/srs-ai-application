import {
  signIn,
  confirmSignIn,
  fetchAuthSession,
  signOut,
} from "aws-amplify/auth";

/**
 * STEP 1: Send Email OTP (Passwordless)
 */
export const sendOtp = async (email) => {
  return await signIn({
    username: email,
    options: {
      authFlowType: "USER_AUTH",
      preferredChallenge: "EMAIL_OTP",
    },
  });
};

/**
 * STEP 2: Verify OTP
 */
export const verifyOtp = async (code) => {
  return await confirmSignIn({
    challengeResponse: code,
  });
};

/**
 * GET ACCESS TOKEN (JWT)
 */
export const getToken = async () => {
  try {
    const session = await fetchAuthSession();

    const accessToken =
      session.tokens?.accessToken?.toString();

    return accessToken || null;
  } catch (err) {
    console.warn("No auth session found");
    return null;
  }
};

/**
 * LOGOUT
 */
export const logout = async () => {
  await signOut();
};
