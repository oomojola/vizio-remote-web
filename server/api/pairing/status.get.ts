import { getOrCreateSessionId, getTvInstance } from "~/server/utils/tvStore";

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getOrCreateSessionId(event);
    const tv = getTvInstance(sessionId);

    return {
      isPaired: !!tv,
    };
  } catch (error: any) {
    return {
      isPaired: false,
    };
  }
});
