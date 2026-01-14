import {
  signIn,
  confirmSignIn,
  fetchAuthSession,
  signOut,
} from "aws-amplify/auth";

/**
 * ============================
 * STEP 1: SEND EMAIL OTP
 * ============================
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
 * ============================
 * STEP 2: VERIFY OTP
 * ============================
 */
export const verifyOtp = async (code) => {
  return confirmSignIn({
    challengeResponse: code,
  });
};

/**
 * ============================
 * GET ID TOKEN (✅ USE THIS FOR API GATEWAY JWT AUTH)
 * ============================
 */
export const getIdToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch (err) {
    console.error("getIdToken failed", err);
    return null;
  }
};

/**
 * ============================
 * GET ACCESS TOKEN (OPTIONAL – DO NOT USE FOR API GW)
 * ============================
 */
export const getAccessToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() || null;
  } catch (err) {
    console.error("getAccessToken failed", err);
    return null;
  }
};

/**
 * ============================
 * GET USER PROFILE (FROM ID TOKEN)
 * ============================
 */
export const getUserProfile = async () => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    // const idToken = session.tokens?.accessToken?.toString();

    if (!idToken) return null;

    const payload = JSON.parse(atob(idToken.split(".")[1]));

    return {
      email: payload.email,
      name: payload.name || payload.email,
      initial: (payload.name || payload.email)[0].toUpperCase(),
      sub: payload.sub,
    };
  } catch (err) {
    console.error("getUserProfile failed", err);
    return null;
  }
};

/**
 * ============================
 * LOGOUT
 * ============================
 */
export const logout = async () => {
  try {
    await signOut();
  } catch (err) {
    console.error("logout failed", err);
  }
};
