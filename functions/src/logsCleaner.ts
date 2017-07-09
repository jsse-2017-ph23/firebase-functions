export async function logsCleaner(logs: admin.database.Reference[]) {
  const promises = logs.map(log => (
    log.set(null)
  ))
  await Promise.all(promises)
}