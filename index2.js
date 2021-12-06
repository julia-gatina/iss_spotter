const {
  nextISSTimesForMyLocation
} = require('./iss_promised');

const displayPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${dateTime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    displayPassTimes(passTimes);
  })
  // .catch((error) => {
  //   console.log('It did not work: ', error.message)
  // });