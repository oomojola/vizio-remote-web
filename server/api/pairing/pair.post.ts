import SmartCast from "vizio-smart-cast";
import {
  getOrCreateSessionId,
  getTvInstance,
  getTvIp,
  setTvInstance,
} from "~/server/utils/tvStore";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { pin } = body;

    if (!pin) {
      throw createError({
        statusCode: 400,
        message: "PIN is required",
      });
    }

    const sessionId = getOrCreateSessionId(event);
    const tv = getTvInstance(sessionId);

    if (!tv) {
      throw createError({
        statusCode: 400,
        message: "No active pairing session. Please initiate pairing first.",
      });
    }

    // Complete pairing with PIN
    const authToken = await tv.pairing.pair(pin);
    const token =
      authToken?.ITEM?.AUTH_TOKEN || authToken?.AUTH_TOKEN || authToken;

    if (!token) {
      throw createError({
        statusCode: 400,
        message: "Invalid response from TV",
      });
    }

    const tokenValue = typeof token === "string" ? token : token.toString();

    // Get TV IP from stored session
    const tvIp = getTvIp(sessionId);

    if (!tvIp) {
      throw createError({
        statusCode: 500,
        message: "Unable to retrieve TV IP address",
      });
    }

    // Reinitialize TV with auth token
    const authenticatedTv = new SmartCast(tvIp, tokenValue);
    setTvInstance(sessionId, authenticatedTv, tvIp);

    return {
      success: true,
      message: "Pairing successful!",
      token: tokenValue, // Return token for client to store if needed
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Pairing failed",
    });
  }
});
