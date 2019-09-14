

var apiKey = "AIzaSyDjkiXSorawjm2A34CuENp-BWDCoubGy8w";
var map;
var myLatLang=[];
var userLocation={lat: 0, lng: 0};
var markers = {}

var bigObject={city: ["paris","jerusalem","New Delhi","tokyo"],
answer:"paris"};

var optionsObject = bigObject.city;


function initMap() {
  getLocation();
  var loc = { lat:0, lng: 0 }
  console.log("in init", userLocation)
  /*map = new google.maps.Map(document.getElementById('map'), {
   center: loc,
    zoom: 2
  });*/

   
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, function() {console.log("error stuff")}, {timeout:60000});
  } else { 
    alert("Geolocation is not supported by this browser.");
  }
}

function changeQuestionAndAnswer()
{
  bigObject={ city: ["cape town","milan","new york","ambala"],
answer:"milan"};

}

function showPosition(position) {
    
  userLocation.lat = position.coords.latitude;
  userLocation.lng = position.coords.longitude;
  console.log(userLocation);
  console.log("Latitude: " + position.coords.latitude + 
  "\nLongitude: " + position.coords.longitude);
}

function playGame() {
    
  let my_url;
  let option = optionsObject;
  let cityMarker;
  const keys = Object.keys(option);
  getLocation();
  console.log("UserLocation : " + userLocation.lat )

  map = new google.maps.Map(document.getElementById('map'), {
    center: userLocation,
     zoom: 2
   });

  for (let key in keys) {
    
    if ( option.hasOwnProperty(keys[key]) ) {
      let city = option[keys[key]] 
      console.log("city is : ", city)
      my_url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=" + apiKey;
      
      $.getJSON({
        url: my_url,
        success: function (data) {
          let latlng = data.results[0].geometry.location;
          myLatLang.push(latlng);          
          cityMarker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: city,
            icon: "./assets/images/mapIcon.png",
        });

        markers[city] = cityMarker;
        let newMarker = markers[city]
        
        newMarker.addListener('click', function() {
          if(newMarker.title===bigObject.answer){
            console.log("correct answer: ",newMarker.title)
            changeQuestionAndAnswer();
            //updateScore();
            //callNewQuestionFromMikesFunction();
          }
          else{
              console.log("wrong answer")
          }
        });
        }

      });
      
      
    } // endIf Option.hasOwnProperty
    
  } // endFor key in keys

} // endFunction getLatLangGeoCoding


// ---- Script ---- 



document.addEventListener('DOMContentLoaded', function () {

  let lang = "";
  if (document.querySelectorAll('#map').length > 0) {
    if (document.querySelector('html').lang)
      lang = document.querySelector('html').lang;
    else
      lang = 'en';
    
    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.async = true;
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDFN4M1LYq8xp9YJOc_S3dP_aRJpaUh_AI&callback=playGame&language=' + lang;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  
  }
}); 




