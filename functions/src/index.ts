import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as storage from '@google-cloud/storage'
import {logWriterHandler} from './log-writer-handler'
import {selectFcmTokens} from './select-fcm-tokens'
import {messagerHandler} from './messager-handler'
import {imageDeleteHandler} from './image-delete-handler'
import {imageCreateHandler} from './image-create-handler'
import {listOldImages} from './list-old-images'
import {storageCleaner} from "./storage-cleaner"
import {listOldLogs} from './list-old-logs'
import {logsCleaner} from './logs-cleaner'

admin.initializeApp({
  ...functions.config().firebase,
  databaseAuthVariableOverride: {
    uid: 'fb-functions'
  }
})

/**
 * This function is responsible to monitor status change in realtime database
 * and append appropriate log to realtime database.
 */
export const logWriter = functions.database.ref('/status').onWrite(async event => {
  const now = new Date()
  const newStatus = event.data.val()
  await logWriterHandler(newStatus, now, admin.database())
})

/**
 * This function is responsible to monitor status change in realtime database
 * and push notification to all clients.
 */
export const messager = functions.database.ref('/status').onWrite(async event => {
  const tokens = await selectFcmTokens(admin.database())
  const newStatus = event.data.val()
  await messagerHandler(newStatus, tokens, admin.messaging())
})

/**
 * Sync cloud storage images path to Firebase realtime database.
 * Because there is no way to list files in cloud storage in client.
 * This synchronization is one way. From cloud storage to realtime database.
 * Because there is no way (by permission system) to change entry in database.
 * Sync includes deletion and addition of object.
 */
export const imageSyncer = functions.storage.object().onChange(async event => {
  const {metadata, resourceState, name} = event.data
  if (!name.startsWith('webcam-images/')) {
    // Not inside of webcam-images path. Ignore the file.
    return
  }

  if (resourceState === 'not_exists') {
    await imageDeleteHandler(name, admin.database())
  } else {
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
