import getDistanceFromLatLonInKm from '../../common/util/calculateDistance';

let spectValues = [
  {
    lat1: 51.5074,
    lon1: 0.17678,
    lat2: 48.8566,
    lon2: 2.3522,
    distance: '332.94',
  },
  {
    lat1: 51.5074,
    lon1: 0.1278,
    lat2: 51.5074,
    lon2: 0.1278,
    distance: '0.00',
  },
  {
    lat1: -20.87575391,
    lon1: 10.966757336,
    lat2: -16.975576,
    lon2: 12.967575783,
    distance: '482.02',
  },
];

describe('getDistanceFromLatLonInKm', () => {
  spectValues.forEach((value) => {
    it(`should return ${value.distance} km`, () => {
      expect(
        getDistanceFromLatLonInKm(
          value.lat1,
          value.lon1,
          value.lat2,
          value.lon2,
        ),
      ).toBe(value.distance);
    });
  });
});
