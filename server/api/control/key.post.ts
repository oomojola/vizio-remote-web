import { getOrCreateSessionId, getTvInstance } from "~/server/utils/tvStore";

// Get the TV instance type from the return type of getTvInstance
type TvInstance = NonNullable<ReturnType<typeof getTvInstance>>;

// Map string key names to functions that call the appropriate method on the TV instance
// Based on vizio-smart-cast library: https://github.com/heathbar/vizio-smart-cast
function getKeyHandler(key: string): ((tv: TvInstance) => Promise<any>) | null {
  const keyMap: Record<string, (tv: TvInstance) => Promise<any>> = {
    // Navigation keys
    UP: (tv) => tv.control.navigate.up(),
    DOWN: (tv) => tv.control.navigate.down(),
    LEFT: (tv) => tv.control.navigate.left(),
    RIGHT: (tv) => tv.control.navigate.right(),
    ENTER: (tv) => tv.control.navigate.ok(),
    RETURN: (tv) => tv.control.media.seek.back(),
    // Volume keys
    VOL_UP: (tv) => tv.control.volume.up(),
    VOL_DOWN: (tv) => tv.control.volume.down(),
    // Channel keys
    CH_UP: (tv) => tv.control.channel.up(),
    CH_DOWN: (tv) => tv.control.channel.down(),
  };

  return keyMap[key] || null;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { key } = body;

    if (!key) {
      throw createError({
        statusCode: 400,
        message: "Key command is required",
      });
    }

    const sessionId = getOrCreateSessionId(event);
    const tv = getTvInstance(sessionId);

    if (!tv) {
      throw createError({
        statusCode: 401,
        message: "Not paired with TV. Please pair first.",
      });
    }

    // Get the handler function for the key
    const keyHandler = getKeyHandler(key);
    if (!keyHandler) {
      throw createError({
        statusCode: 400,
        message: `Unknown key command: ${key}`,
      });
    }

    // Call the handler function with the TV instance
    await keyHandler(tv);

    return {
      success: true,
      message: `Key command '${key}' sent successfully`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to send key command",
    });
  }
});
