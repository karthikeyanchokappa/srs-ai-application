import {
  signIn,
  confirmSignIn,
  fetchAuthSession,
  signOut
} from "aws-amplify/auth";

/**
 * STEP 1: Send Email OTP (Passwordless)
 */
export const sendOtp = async (email) => {
  return await signIn({
    username: email,
    options: {
      authFlowType: "USER_AUTH", // ✅ NOT CUSTOM_AUTH
      preferredChallenge: "EMAIL_OTP"
    }
  });
};

/**
 * STEP 2: Verify OTP
 */
export const verifyOtp = async (code) => {
  return await confirmSignIn({
    challengeResponse: code
  });
};

/**
 * GET TOKEN
 */
export const getToken = async () => {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString();
};

/**
 * LOGOUT
 */
export const logout = async () => {
  await signOut();
};
