import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as storage from '@google-cloud/storage'
import {logWriterHandler} from './log-writer-handler'
import {selectFcmTokens} from './select-fcm-tokens'
import {sendCloudMessage} from './send-cloud-message'
import {imageDeleteHandler} from './image-delete-handler'
import {imageCreateHandler} from './image-create-handler'
import {listOldImages} from './list-old-images'
import {storageCleaner} from './storage-cleaner'
import {listOldLogs} from './list-old-logs'
import {logsCleaner} from './logs-cleaner'
import {logMessageMap} from './log-message-map'
import {WEBCAM_BUCKET, WEBCAM_FOLDER} from './constants'
import {mailLogHandler} from './mail-log-handler'

admin.initializeApp({
  ...functions.config().firebase,
  databaseAuthVariableOverride: {
    uid: 'fb-functions'
  }
})

/**
 * This function is responsible to monitor status change in realtime database
 * and append appropriate log to realtime database.
 * This does NOT handle have mail status change.
 */
export const logWriter = functions.database.ref('/status').onWrite(async event => {
  const now = new Date()
  const newStatus = event.data.val()
  await logWriterHandler(newStatus, now, admin.database())
})

/**
 * This function handles haveMail path change from realtime database
 * and append change log to realtime database.
 */
export const mailLogWriter = functions.database.ref('/haveMail').onWrite(async event => {
  const now = new Date()
  const newStatus: boolean = event.data.val()
  await mailLogHandler(newStatus, now, admin.database())
})

/**
 * This function is responsible to monitor status change in realtime database
 * and push notification to all clients.
 */
export const statusMessager = functions.database.ref('/status').onWrite(async event => {
  const tokens = await selectFcmTokens(admin.database())
  const newStatus = event.data.val()
  const title = 'Mailbox status changed'
  const body = logMessageMap(newStatus)
  await sendCloudMessage(title, body, tokens, admin.messaging())
})

/**
 * This function is responsible to monitor mail count change in realtime database
 * and push notification to all clients
 */
export const mailCountMessager = functions.database.ref('/haveMail').onWrite(async event => {
  const tokens = await selectFcmTokens(admin.database())
  const mailCount: boolean = event.data.val()

  const title = 'Mail status has updated'
  const body = mailCount ? 'You have got mail' : 'Your mail have been retrieved'
  await sendCloudMessage(title, body, tokens, admin.messaging()))
})

/**
 * Sync cloud storage images path to Firebase realtime database.
 * Because there is no way to list files in cloud storage in client.
 * This synchronization is one way. From cloud storage to realtime database.
 * Because there is no way (by permission system) to change entry in database.
 * Sync includes deletion and addition of object.
 */
export const imageSyncer = functions.storage.bucket(WEBCAM_BUCKET).object().onChange(async event => {
  const {metadata, resourceState, name, metageneration} = event.data
  if (!name.startsWith(WEBCAM_FOLDER)) {
    console.log('New object is not in observing path, ignoring.', name)
    return
  }

  if (resourceState === 'exists' && metageneration > 1) {
    // This is a metadata change event.
    return
  }

  if (resourceState === 'not_exists') {
    console.log('Image deleted. Name:', name)
    await imageDeleteHandler(name, admin.database())
  } else {
    console.log('New image created. Name:', name)
    await imageCreateHandler(name, metadata, admin.database())
  }
})

/**
 * This function will be triggered hourly and remove old images from
 * Firebase storage.
 */
export const imagesPurger = functions.pubsub.topic('hourly-tick').onPublish(async event => {
  const files = await listOldImages(admin.database())
  console.log('Going to remove following files:', files)
  await storageCleaner(files, storage())
})

/**
 * This function will be triggered hourly and remove old logs from Firebase realtime database
 */
export const logsPurger = functions.pubsub.topic('hourly-tick').onPublish(async event => {
  const logs = await listOldLogs(admin.database())
  await logsCleaner(logs)
})
