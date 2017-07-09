export async function imageDeleteHandler(fileName: string, database: admin.database.Database) {
  const dbEntries = await database.ref('/footage').orderByChild('path').equalTo(fileName).once('value')

  if (dbEntries.numChildren() > 1) {
    console.warn(`More than 1 database entry pointing to ${fileName} was found.`)
  } else if (dbEntries.numChildren() === 0) {
    console.warn(`No database entry points to ${fileName}.`)
    return
  }

  const removePrmoises: Promise<any>[] = []
  dbEntries.forEach(entry => {
    removePrmoises.push(entry.ref.remove())
  })
  await Promise.all(removePrmoises)
}