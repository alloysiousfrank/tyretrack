// Retries a send function once after a short delay if it throws. Built for
// the PDF-upload sends (email/WhatsApp) specifically, because Render's free
// tier spins the server down after inactivity and the first request after
// a cold start can take 50+ seconds to wake it — long enough for the
// browser to abort a large multipart upload mid-flight ("Request aborted"
// on the server side). A short delay + one retry gives the server time to
// finish waking up before trying again, without leaving the admin stuck
// waiting indefinitely.

export async function sendWithRetry<T>(
  sendFn: () => Promise<T>,
  retries: number = 1,
  delayMs: number = 3000
): Promise<T> {

  try {

    return await sendFn()

  } catch (err) {

    if (retries <= 0) {
      throw err
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs))

    return sendWithRetry(sendFn, retries - 1, delayMs)

  }

}
