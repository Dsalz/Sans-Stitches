const mapDiv = document.getElementById('map');

function addMapToScreen(lat = 6.5352330000000001, lng = 3.3489670999999817) {
    let position = {lat, lng};
    let map = new google.maps.Map(mapDiv , {zoom: 10, center: position});
    let marker = new google.maps.Marker({ position , map });
  }