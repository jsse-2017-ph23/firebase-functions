import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {logWriterHandler} from './log-writer-handler'

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
export const logWriter = functions.database.ref('/status').onWrite(event => {
  const now = new Date()
  const newStatus = event.data.val()
  return logWriterHandler(newStatus, now, admin.database())
})

/**
 * This function is responsible to monitor status change in realtime database
 * and push notification to all clients.
 */
export const messager = functions.database.ref('/status').onWrite(event => {

})

/**
 * This function will be triggered hourly and remove old images from
 * Firebase storage.
 */
export const imagesPurger = functions.pubsub.topic('hourly-tick').onPublish(event => {

})
