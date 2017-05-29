const axios = require('axios');
const bz2Stream = require('unbzip2-stream');
const { extract } = require('tar-stream');

const extractor = new extract();
const bzip2 = bz2Stream();

module.exports = function({handler}){
  extractor.on('entry', handler);
  extractor.on('error', err => console.log(err))
  
  return {
    getRemoteResource(url) {
      return axios.get(url, { 
          responseType: 'stream' 
        })
        .then(response => 
          response.data
            .pipe(bzip2)
            .pipe(extractor)
        )
        .catch(err=> console.log(err));
    }
  }
};
