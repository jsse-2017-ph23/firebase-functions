import {WEBPAGE_URL} from './constants'

export async function sendCloudMessage(title: string, body: string, fcmTokens: string[], messaging: admin.messaging.Messaging) {
  const payload = {
    notification: {
      body,
      clickAction: WEBPAGE_URL,
      title
    }
  }

  console.log('Will send cloud message to following clients:', fcmTokens)
  await messaging.sendToDevice(fcmTokens, payload)
}
