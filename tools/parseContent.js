const { loadSheet } = require('./fetchSheet.js')
const fs = require('fs')

async function fetchContent() {
  return new Promise(resolve => {
    loadSheet('1dXTwoOHhy6DtoRRV2X45sQ-_ocHJUcqvkQsqL59Y_tk', 'content', (err, res) => {
        let rows = res.data.values

        if (rows) {

          const THEME_COL = 6
          const MODEL_COL = 7
          const DESC_COL = 8

          const copy = {}
          rows = rows.slice(6)

          const header = rows.shift()

          const THEME = header[THEME_COL]
          const MODEL = header[MODEL_COL]
          const DESCRIPTION = header[DESC_COL]

          const content = []

          rows.forEach((row, i) => {

            let obj = {}
            obj[THEME] = row[THEME_COL]
            obj[DESCRIPTION] = row[DESC_COL]
            obj[MODEL] = row[MODEL_COL]

            content.push(obj)

          })

          resolve(content)
        }
      }
    )

  })
}

function fetchCopy() {

  fetchContent().then(content => {

    const copy = {
      content
    }

    fs.writeFile('./static/copy.json', JSON.stringify(copy), (err) => {
      if (err) throw err
      console.log('Data written to file')
    })
  })

}
function fetchFresquesCopy(){
  loadSheet('1dXTwoOHhy6DtoRRV2X45sQ-_ocHJUcqvkQsqL59Y_tk', 'fresques', (err, res) => {

    const rows = res.data.values

    if (rows) {

      const content = []
      const copyF = {content}
      rows.splice(0, 7);
      const KEY_INDEX = 1;
      const ENTRY_INDEX = 6;
      rows.forEach(row => {
        content.push(row[ENTRY_INDEX])
      })

      fs.writeFile('./static/fresque.json', JSON.stringify(copyF), (err) => {
        if (err) throw err
        console.log('Data written to file')
      })
    }

  })
}



fetchCopy()
fetchFresquesCopy()
