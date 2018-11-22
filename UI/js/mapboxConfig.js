    const mapDiv = document.getElementById('map');
     
    
    if(mapboxgl.supported()){
        mapboxgl.accessToken = 'pk.eyJ1IjoiZHNhbHoiLCJhIjoiY2ptbGE4a3ZuMDVybzN4cjhqa2pxOHYzcSJ9.TBoXxD-887HzwD2-ZDoKQg';
        var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10'
        });
    }
    else{
        mapDiv.textContent = "Your Browser does not support mapbox"
        mapDiv.style.height = '80px';
    }


