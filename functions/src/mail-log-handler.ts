import {LOG_PATH} from './constants'

/**
 * This function append mail status change log to firebase realtime database.
 */
export async function mailLogHandler(newStatus: boolean, time: Date, database: admin.database.Database) {
  const ref = database.ref(LOG_PATH)
  const message = newStatus ? 'You have got mail' : 'Mail has been retrieved'
  await ref.push().set({
    message,
    time: time.getTime()
  })
}