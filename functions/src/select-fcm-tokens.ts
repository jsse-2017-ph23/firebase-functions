import {User} from './interfaces'

/**
 * This function select all fcm tokens from Firebase
 * Realtime database and return as an array
 */
export async function selectFcmTokens(database: admin.database.Database): Promise<string[]> {
  const users: admin.database.DataSnapshot = await database.ref('/users').once('value')
  const result = []
  users.forEach(user_ => {
    const user: User = user_.val()
    if (user.fcmToken) {
      result.push(user.fcmToken)
    }
    return false // TS definition requires boolean to be returned.
  })
  return result
}