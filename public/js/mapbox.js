/*eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic2lqdWFkZSIsImEiOiJjanp2MmkzeDMwOTZvM2JtcnRrZ2xxaTZuIn0.XWX0FUAaJwx6sBUJkfpk1A';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sijuade/ck59watuc0kta1cs0gds37jf5',
    scrollZoom: false
    //   center: [3.3792, 6.5244],
    //   interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(location => {
    //Create Marker
    const elem = document.createElement('div');
    elem.className = 'marker';

    //Add Marker
    new mapboxgl.Marker({
      element: elem,
      anchor: 'bottom'
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    //Extend map boundary
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 }
  });
};
