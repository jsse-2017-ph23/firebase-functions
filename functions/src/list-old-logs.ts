// At most keep logs for 12 hours
const maxAliveTime = 12 * 3600 * 1000

/**
 * List and filter logs that can be removed from realtime database
 */
export async function listOldLogs(database: admin.database.Database): Promise<admin.database.Reference[]> {
  const now = new Date().getTime()
  const logs = await database.ref('/log').once('value')

  const result: admin.database.Reference[] = []
  logs.forEach(log => {
    const {time} = log.val()
    const delta = now - time
    if (delta > maxAliveTime) {
      result.push(log.ref)
    }
  })
  return result
}
