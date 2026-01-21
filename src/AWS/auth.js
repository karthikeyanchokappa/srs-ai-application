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
 * GET ID TOKEN (USE FOR API GW JWT)
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
 * GET ACCESS TOKEN (OPTIONAL)
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
 * GET USER PROFILE
 * ============================
 */
export const getUserProfile = async () => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

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
 * LOGOUT (🔥 FIXED)
 * ============================
 */
export const logout = async () => {
  try {
    await signOut({ global: true }); // ✅ ONLY REQUIRED CHANGE
  } catch (err) {
    console.error("logout failed", err);
  }
};
