const axios = require("axios");

async function geocodeLocation(location){

    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params:{
                q:location,
                format:"json",
                limit:1
            },
            headers:{
                "User-Agent":"staysphere"
            }
        }
    );

    const data = response.data[0];

    return {
        lat:data.lat,
        lng:data.lon
    };

}

module.exports = geocodeLocation;