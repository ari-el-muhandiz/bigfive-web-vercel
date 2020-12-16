const { ObjectId } = require('mongodb')
const validMongoId = require('./lib/valid-mongoid')
const connectToDb = require('./lib/connect-to-db')
const getResult = require('@alheimsins/b5-result-text')
const { getInfo } = require('@alheimsins/b5-result-text')
const calculateScore = require('@alheimsins/bigfive-calculate-score')

const { languages: availableLanguages } = getInfo()

const dbCollection = process.env.MONGODB_COLLECTION

module.exports = async (req, res) => {
  const { query: { id, lang } } = req
  const ipAdd = req.headers['x-real-ip']
  if (!id || !validMongoId(id)) {
    res.status(500).json({ type: 'error', message: 'Not a valid id' })
    return
  }

  try {
    let geoLocations = {}
    if (ipAdd) {
      geoLocations = await fetch(`http://www.geoplugin.net/json.gp?ip=${ipAdd}`);
    }
    const db = await connectToDb()
    const collection = db.collection(dbCollection)
    const data = await collection.findOne({ _id: ObjectId(id) })
    if (!data) {
      res.json({ type: 'notFound', message: 'Record not found', results: [] })
      return
    }
    const scores = calculateScore(data)
    const results = getResult({ scores, lang: lang || data.lang || 'en' })

    res.json({
      timestamp: data.dateStamp,
      language: data.lang,
      availableLanguages: availableLanguages.map(item => ({ value: item.id, ...item })),
      age: '',
      gender: '',
      nationality: '',
      results,
      geoLocations,
      ipAdd
    })
    return
  } catch (error) {
    res.status(500).json({ type: 'error', message: error.message })
  }
}
