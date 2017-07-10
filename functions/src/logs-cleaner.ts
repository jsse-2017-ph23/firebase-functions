/**
 * Set all content to null (delete them) for give array of Firebase database reference pointer.
 */
export async function logsCleaner(logs: admin.database.Reference[]) {
  const promises = logs.map(log => (
    log.set(null)
  ))
  await Promise.all(promises)
}
