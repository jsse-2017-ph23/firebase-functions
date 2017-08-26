import {WEBCAM_BUCKET} from './constants'

/**
 * Remove blobs from cloud storage by given paths.
 */
export async function storageCleaner(paths: string[], storage: any) {
  const bucket = storage.bucket(WEBCAM_BUCKET)

  const deletePromises = paths.map(path => (
    bucket.file(path).delete()
  ))
  const res = await Promise.all(deletePromises)
  console.log('All given images removed from cloud storage. Result:', res)
}
