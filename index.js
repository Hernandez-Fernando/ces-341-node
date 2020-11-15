const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

app.get('/getRate', getData)


function getData(req, res) {
  const weight = req.query.weight
  let type = req.query.type
  let alert = ""

  // If weight is greater than 3.5 oz then user must use a large envelope service if not selected or select First Class Service
  if (weight > 3.5 && type != 'firstClass') {
    type = 'flats'
    alert = "Your package is too heavy for use the service you selected. Your shipping type was changed to Large Envelope."
  }



  const rate = calculateRate(weight, type)
  const params = { weight: weight, type: type, rate: rate, alert: alert }

  res.render('pages/rates', params)

}

function calculateRate(weight, type) {
  let result;

  switch (type) {


    case 'stamped':
      if (weight <= 1) result = .55
      if (weight > 1 && weight <= 2) result = .70
      if (weight > 2 && weight <= 3) result = .85
      if (weight > 3 && weight <= 3.5) result = 1

      break;

    case 'metered':
      if (weight > 4 && weight <= 1) result = .50
      if (weight > 1 && weight <= 2) result = .65
      if (weight > 3 && weight <= 3) result = .80
      if (weight <= 3.5) result = .95

      break;

    case 'flats':
      if (weight <= 1) result = 1
      if (weight > 1) {
        let roundWeight = Math.round(weight)
        let tempWeight = roundWeight - 1;

        result = tempWeight * .20 + 1
      }
      break;

    case 'firstClass':
      if (weight <= 4) result = 3.8
      if (weight > 4 && weight <= 8) result = 4.6
      if (weight > 8 && weight <= 12) result = 5.3
      if (weight > 13) result = 5.9
      break;
  }

  return result;
}