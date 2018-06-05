import maxmind from 'maxmind';

export const CityLookup = maxmind.openSync(__dirname + '/../../../../config/GeoDB/GeoLite2-City.mmdb', {
    cache: {
      max: 10000, // max items in cache
      maxAge: 1000 * 60 * 60 // life time in milliseconds
    }
  });

export const ASNLookup = maxmind.openSync(__dirname + '/../../../../config/GeoDB/GeoLite2-ASN.mmdb' , {
    cache: {
      max: 10000, // max items in cache
      maxAge: 1000 * 60 * 60 // life time in milliseconds
    }
  });