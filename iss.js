// will contain most of the logic for fetching the data from each API endpoint.
const request = require('request');

const fetchIpURL = 'https://api.ipify.org?format=json';
const geoApiUrl = 'https://api.freegeoip.app/json/';
const IssApiUrl = 'https://iss-pass.herokuapp.com/json/?';


 // Makes a single API request to retrieve the user's IP address.
const fetchMyIp = function(callback) {
  // use request to fetch IP address from JSON API
  request.get(fetchIpURL, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const bodyObject = JSON.parse(response.body);
    callback(null, bodyObject.ip);
  });
};


// Request to get geolocation based on the IP fetched above (long and alt)

const fetchCoordsByIP = function(ip, callback) {
  const url = geoApiUrl + ip + '?apikey=bcfde840-55b3-11ec-b5ae-1b3830273205';
  request.get(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body);
    
    callback(null, { latitude, longitude });
  })
};


// Request to get fly over times from ISS API based on coords. we got

const fetchISSFlyOverTimes = function(coordinates, callback) {
  const IssApiUrlwithCoord = IssApiUrl + `lat=${coordinates.latitude}` + `&lon=${coordinates.longitude}`;

  request.get(IssApiUrlwithCoord, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching upcoming ISS fly over times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const IssPasses = JSON.parse(body).response;
    callback(null, IssPasses);
  })
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIp((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = {nextISSTimesForMyLocation};
