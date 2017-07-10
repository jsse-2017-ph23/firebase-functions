const bucketName = 'jsse-2017.appspot.com'

/**
 * Remove blobs from cloud storage by given paths.
 */
export async function storageCleaner(paths: string[], storage: any) {
  const bucket = storage.bucket(bucketName)

  const deletePromises = paths.map(path => (
    bucket.file(path).delete
  ))
  await Promise.all(deletePromises)
}
