const Clarifai = require("clarifai");

const app = new Clarifai.App({
    apiKey: '713b9aceeba0424e85061d2360cb4899'
   });
const handleAPIcall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data.outputs[0].data.regions[0].region_info.bounding_box);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err =>  res.status(404).json("unable to get entries"))
}

module.exports = {handleImage, handleAPIcall}