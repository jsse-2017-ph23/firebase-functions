export async function imageDeleteHandler(name: string, database: admin.database.Database) {
  const dbEntries = await database.ref('/footage').orderByChild('path').equalTo(name).once('value')

  if (dbEntries.numChildren() > 1) {
    console.warn(`More than 1 database entry pointing to ${name} was found.`)
  } else if (dbEntries.numChildren() === 0) {
    console.warn(`No database entry points to ${name}.`)
    return
  }

  const removePrmoises: Array<Promise<any>> = []
  dbEntries.forEach(entry => {
    removePrmoises.push(entry.ref.remove())
  })
  await Promise.all(removePrmoises)
}
