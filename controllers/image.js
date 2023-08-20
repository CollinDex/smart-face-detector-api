
// Setup Clarifai AI API Request
const returnClarifaiJSONRequest = (imageUrl)=> {
    const PAT = 'd21bdbf49c9e43df884a8d1202f2aad3';
    const USER_ID = 'coeedex';       
    const APP_ID = 'smart-face-detector';
    const IMAGE_URL = imageUrl;
  
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });
  
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };
  
    return requestOptions;
  }

const handleApiCall = (req, res) => {
    fetch('https://api.clarifai.com/v2/models/face-detection/outputs', returnClarifaiJSONRequest(req.body.input))
    .then(response => response.json())
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body; 
    db('users').where('id','=',id)
      .increment('entries',1)
      .returning('entries')
      .then(entries => {
//        console.log(entries);
          res.json(entries[0].entries);
      })
      .catch(err => res.status(400).json('unable to get entries'))
};

/* module.exports = {
    handleImage : handleImage,
    handleApiCall: handleApiCall
} */

export { handleImage, handleApiCall }
