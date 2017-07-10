export async function imageDeleteHandler(downloadLink: string, database: admin.database.Database) {
  const dbEntries = await database.ref('/footage').orderByChild('path').equalTo(downloadLink).once('value')

  if (dbEntries.numChildren() > 1) {
    console.warn(`More than 1 database entry pointing to ${downloadLink} was found.`)
  } else if (dbEntries.numChildren() === 0) {
    console.warn(`No database entry points to ${downloadLink}.`)
    return
  }

  const removePrmoises: Array<Promise<any>> = []
  dbEntries.forEach(entry => {
    removePrmoises.push(entry.ref.remove())
  })
  await Promise.all(removePrmoises)
}
