import {logMessageMap} from './log-message-map'
import {LOG_PATH} from './constants'

/**
 * This function append status changed log to firebase realtime database.
 */
export async function logWriterHandler(newStatus: string, time: Date, database: admin.database.Database) {
  const ref = database.ref(LOG_PATH)
  await ref.push().set({
    message: logMessageMap(newStatus),
    time: time.getTime()
  })
}
