import {
  signIn,
  confirmSignIn,
  fetchAuthSession,
  signOut,
} from "aws-amplify/auth";

/**
 * STEP 1: Send Email OTP
 */
export const sendOtp = async (email) => {
  return signIn({
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
  return confirmSignIn({
    challengeResponse: code,
  });
};

/**
 * GET ACCESS TOKEN (optional)
 */
export const getAccessToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() || null;
  } catch {
    return null;
  }
};

/**
 * ✅ GET ID TOKEN (USED BY BACKEND API)
 */
export const getIdToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch {
    return null;
  }
};

/**
 * GET USER PROFILE (FROM ID TOKEN)
 */
export const getUserProfile = async () => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    if (!idToken) return null;

    const payload = JSON.parse(atob(idToken.split(".")[1]));
    const email = payload.email;

    return {
      email,
      name: payload.name || email,
      initial: (payload.name || email)[0].toUpperCase(),
    };
  } catch (err) {
    console.error("getUserProfile failed", err);
    return null;
  }
};

/**
 * LOGOUT
 */
export const logout = async () => {
  await signOut();
};
