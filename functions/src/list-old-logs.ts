import {LOG_MAX_ALIVE_TIME, LOG_MAX_ENTRIES} from './constants'

interface IAliveEntry {
  ref: admin.database.Reference
  time: Date
}

/**
 * List and filter logs that can be removed from realtime database
 */
export async function listOldLogs(database: admin.database.Database): Promise<admin.database.Reference[]> {
  const now = new Date().getTime()
  const logs = await database.ref('/log').once('value')

  const removeLogs: admin.database.Reference[] = []
  const aliveLogs: IAliveEntry[] = []

  logs.forEach(log => {
    const {time} = log.val()
    const delta = now - time
    if (delta > LOG_MAX_ALIVE_TIME) {
      removeLogs.push(log.ref)
    } else {
      aliveLogs.push({
        ref: log.ref,
        time
      })
    }
  })

  if (aliveLogs.length > LOG_MAX_ENTRIES) {
    // Sort, first is oldest and last is latest
    aliveLogs.sort((a, b) => a.time.getTime() - b.time.getTime())
    const excess = aliveLogs.slice(0, aliveLogs.length - LOG_MAX_ENTRIES).map(a => a.ref)
    removeLogs.push(...excess)
  }

  return removeLogs
}
