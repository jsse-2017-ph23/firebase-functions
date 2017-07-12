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
    case 'online':
      return 'Mail box went online.'
    default:
      return `Unknown status: ${status}`
  }
}
