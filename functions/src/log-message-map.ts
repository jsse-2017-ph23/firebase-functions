/**
 * Maps new status to log message
 */
export function logMessageMap(status?: string) {
  switch (status) {
    case null:
    case undefined:
      return 'Status has been deleted. This should not happen!'
    case 'offline':
      return 'Mail box went offline.'
    case 'boot':
      return 'Mail box is booting.'
    case 'noMail':
      return 'Mail has been retrieved.'
    case 'gotMail':
      return 'New mail was deposited.'
    default:
      return `Unknown status: ${status}`
  }
}
