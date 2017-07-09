import {logMessageMap} from './log-message-map'

export async function messagerHandler(newStatus: string, fcmTokens: string[], messaging: admin.messaging.Messaging) {
  const payload = {
    notification: {
      title: 'Mailbox status changed',
      body: logMessageMap(newStatus),
      clickAction: 'https://jsse-2017.firebaseapp.com/'
    }
  }

  console.log('Will send cloud message to following clients:', fcmTokens)
  await messaging.sendToDevice(fcmTokens, payload)
}