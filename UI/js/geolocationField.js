const LocationField = document.getElementById('location');
const LatitudeSpan = document.getElementById('location-latitude');
const LongitudeSpan = document.getElementById('location-longitude');
let Lng = "";
let Lat = "";

function enableGooglePlaceApiSearch() {
  let autocomplete = new google.maps.places.Autocomplete(LocationField);
  google.maps.event.addListener(autocomplete,'place_changed', function() {
    let place = autocomplete.getPlace();
    Lng = String(place.geometry.location.lng());
    Lat = String(place.geometry.location.lat());
    updateGeolocationDataOnScreen();
  })
};

const updateGeolocationDataOnScreen = () => {
    LatitudeSpan.textContent = Lat;
    LongitudeSpan.textContent = Lng;
}

LocationField.addEventListener('change', () => {
    if(LocationField.value.trim() === ""){
        Lng = "";
        Lat = "";
        updateGeolocationDataOnScreen();
    }
})