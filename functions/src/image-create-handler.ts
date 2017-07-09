export interface ImageMeta {
  creationTime?: number
}

function getTime(metadata: ImageMeta | null): number {
  if (metadata && metadata.creationTime) {
    return metadata.creationTime
  }
  return new Date().getTime()
}

export async function imageCreateHandler(fileName: string, metadata: ImageMeta | null, database: admin.database.Database) {
  if (!metadata || !metadata.creationTime) {
    console.warn('Creation time does not exist in metadata. Assuming creation time is time time this function run.')
  }
  const time = getTime(metadata)

  await database.ref('/footage').push({
    time,
    path: fileName
  })
}