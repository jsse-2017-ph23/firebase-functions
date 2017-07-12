export interface ImageMeta {
  creationTime?: number
}

function getTime(metadata: ImageMeta | null): number {
  if (metadata && metadata.creationTime) {
    return metadata.creationTime
  }
  return new Date().getTime()
}

export async function imageCreateHandler(name: string, metadata: ImageMeta | null, database: admin.database.Database) {
  if (!metadata || !metadata.creationTime) {
    console.warn('Creation time does not exist in metadata. Assuming creation time is time time this function run.')
  }
  const time = getTime(metadata)

  // Check for redundant write
  const repeated = await database.ref('/footage').orderByChild('path').equalTo(name).once('value')

  if (repeated.val()) {
    console.warn('Footage already in database. Aborting writing')
  } else {
    await database.ref('/footage').push({
      path: name,
      time: +time,
    })
  }
}
