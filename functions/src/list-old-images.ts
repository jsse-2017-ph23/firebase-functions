// At least keep images for 12 hours
const maxAliveTime = 12 * 3600 * 1000

/**
 * List webcam images from firebase database and filter the list.
 * Only files exceed maximum alive time will be returned.
 */
export async function listOldImages(database: admin.database.Database): Promise<string[]> {
  const now = new Date().getTime()
  const footages = await database.ref('/footage').once('value')

  const result: string[] = []
  footages.forEach(footage => {
    const {time, path} = footage.val()
    const delta = now - time
    if (delta > maxAliveTime) {
      result.push(path)
    }
  })
  return result
}
