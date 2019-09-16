

var apiKey = "AIzaSyDjkiXSorawjm2A34CuENp-BWDCoubGy8w";
var map ;
var myLatLang = [];
var userLocation = { lat: 0, lng: 0 };

var myMarker={};
//var bigObject={city: ["paris","jerusalem","New Delhi","tokyo"],
//answer:"paris"};
var bigObject1 = { city: [], answer: "" };
var optionsObject = bigObject1.city;
var logic_question = Array();
var markers = {};

/*
function initMap() {
  getLocation();
  var loc = { lat: 0, lng: 0 }
  console.log("in init", userLocation)
  map = new google.maps.Map(document.getElementById('map'), {
   center: { lat: 0, lng: 0 },
    zoom: 2
  });
}
*/

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, function () { console.log("error stuff") }, { timeout: 60000 });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function changeQuestionAndAnswer() {
  bigObject = {
    city: ["cape town", "milan", "new york", "ambala"],
    answer: "milan"
  };

}

function showPosition(position) {

  userLocation.lat = position.coords.latitude;
  userLocation.lng = position.coords.longitude;
  console.log(userLocation);
  console.log("Latitude: " + position.coords.latitude +
    "\nLongitude: " + position.coords.longitude);
}



function getCityLoc(x) {
  var d = $.Deferred();
  my_url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + x + "&key=" + apiKey;
  var sam;
  var ajax1_promise = $.getJSON({
    url: my_url,

  });
  ajax1_promise.done(function (response) {
    result = response.results[0].geometry.location;
    d.resolve(result);
    //console.log(result);

  });
  return d.promise();

}

function playGame() {
  /***** */
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
     zoom: 2
   });
  getQuestions().then(
    function (result) {
      console.log("result is :", result[0]);
      console.log(result.length)
      result.forEach(element => {
        bigObject1.city.push(element.cityName)
        if (element.answer === true) {
          bigObject1.answer = element.cityName;
        }
      });
      console.log(bigObject1);
      return bigObject1;
    }).then(function (bo1) {

      var cityArray = bo1.city;
      
      cityArray.forEach(element => {
        //consuming promise 
        getCityLoc(element).done (
          function (cityLoc) {
            console.log("here is :", cityLoc)
            return cityLoc;
          })
          .then(function (markLoc) {
            city_mark = new google.maps.Marker({
              position: markLoc,
              map: map,
              title: element,
              icon: "./assets/images/mapIcon.png",
            });
            myMarker[element]=city_mark
          })
      });
    })
  }

    /*
    console.log("hellooooo",myMarker)
    myMarker.forEach(element =>{
      myMarker[element].addListener('click', function () {
        if (myMarker[element].title === bigObject1.answer) {
          console.log("correct answer: ", myMarker[element].title)
          //updateScore();
          //callNewQuestionFromMikesFunction();
        }
        else {
          console.log("wrong answer: ", myMarker[element].title)
        }
      });
    })
   */
  /******** */

  /*
  let my_url;
  let option = optionsObject;
  let cityMarker;

  const keys = Object.keys(option);

  //getLocation();
  //console.log("UserLocation : " + userLocation.lat )

  map = new google.maps.Map(document.getElementById('map'), {
    center: userLocation,
    zoom: 2
  });

  for (let key in keys) {

    if (option.hasOwnProperty(keys[key])) {
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

          newMarker.addListener('click', function () {
            if (newMarker.title === bigObject1.answer) {
              console.log("correct answer: ", newMarker.title)
              //updateScore();
              //callNewQuestionFromMikesFunction();
            }
            else {
              console.log("wrong answer: ", newMarker.title)
            }
          });
        }

      });


    } // endIf Option.hasOwnProperty

  } // endFor key in keys

  console.log(currentQuestions);
  
} // endFunction getLatLangGeoCoding

*/
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




