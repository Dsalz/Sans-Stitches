const mapDiv = document.getElementById('map');
const locationAddress = document.getElementById('location');

function addMapToScreen(lat = 6.5, lng = 3.3) {
  let position = {lat, lng};
  let map = new google.maps.Map(mapDiv, {zoom: 10, center: position});
  let marker = new google.maps.Marker({ position, map });
  if(lat !== 6.5 && lng !== 3.3 && lat && lng){
    showAddress(lat, lng);
  }
}

const showAddress = (lat, lng) => {
  let position = {lat, lng};
  let geocoder = new google.maps.Geocoder;
  geocoder.geocode({location: position}, function(results, status){
    locationAddress.textContent = results[0].formatted_address;
  });
}

const noMap = () => {
  mapDiv.textContent = 'No location data provided';
};
