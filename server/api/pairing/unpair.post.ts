import { getOrCreateSessionId, removeTvInstance } from "~/server/utils/tvStore";

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getOrCreateSessionId(event);
    removeTvInstance(sessionId);

    return {
      success: true,
      message: "Unpaired successfully",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to unpair",
    });
  }
});
