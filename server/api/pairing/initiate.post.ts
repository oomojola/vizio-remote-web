import SmartCast from "vizio-smart-cast";
import { getOrCreateSessionId } from "~/server/utils/tvStore";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { tvIp } = body;

    if (!tvIp) {
      throw createError({
        statusCode: 400,
        message: "TV IP address is required",
      });
    }

    const sessionId = getOrCreateSessionId(event);

    // Create new TV instance
    const tv = new SmartCast(tvIp);

    // Initiate pairing
    await tv.pairing.initiate("VizioRemoteApp");

    // Store TV instance (without auth token yet)
    // We'll update it after pairing completes
    const { setTvInstance } = await import("~/server/utils/tvStore");
    setTvInstance(sessionId, tv, tvIp);

    return {
      success: true,
      message: "Pairing initiated. Please enter the PIN displayed on your TV.",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to initiate pairing",
    });
  }
});
