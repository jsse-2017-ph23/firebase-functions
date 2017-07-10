const bucketName = 'jsse-2017.appspot.com'

export interface ImageMeta {
  creationTime?: number
}

function getTime(metadata: ImageMeta | null): number {
  if (metadata && metadata.creationTime) {
    return metadata.creationTime
  }
  return new Date().getTime()
}

export async function imageCreateHandler(name: string, metadata: ImageMeta | null, database: admin.database.Database, storage: any) {
  if (!metadata || !metadata.creationTime) {
    console.warn('Creation time does not exist in metadata. Assuming creation time is time time this function run.')
  }
  const time = getTime(metadata)
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(name)
  const urls = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  })

  await database.ref('/footage').push({
    path: name,
    time,
    url: urls[0]
  })
}
