

var apiKey = "AIzaSyDjkiXSorawjm2A34CuENp-BWDCoubGy8w";
var map;
//var myLatLang = [];
var userLocation = { lat: 0, lng: 0 };
var myMarker = {};
var bigObject1 = { city: [], answer: "" };
//var optionsObject = bigObject1.city;
var correctAnswer = 0;
//var logic_question = Array();
var markers = [];
var mark;
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
$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});


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
function stopGame() {
  console.log("hello stop")
 var divid=  $("#map");
 divid.text("you win");
  //var divMap = document.getElementById("map");
  //divMap.innerHTML("<p>hello you win</p>");

}


function playGame() {


  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 2
  });

  bigObject1.city = [];
  bigObject1.answer = "";

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
        getCityLoc(element).done(
          function (cityLoc) {
            console.log("here is :", cityLoc)
            return cityLoc;
          })
          .then(function (markLoc) {

            var city_mark = new google.maps.Marker({
              position: markLoc,
              map: map,
              title: element,
              icon: "./assets/images/mapIcon.png",
            });
            // myMarker[element] = city_mark;
            // let newMarker = myMarker[element];
            // markers.push(city_mark);
            city_mark.addListener("click", function () {
              if (city_mark.title === bigObject1.answer) {
                console.log("correct answer: ", city_mark.title)

                correctAnswer++;
                console.log("correctAnswer:", correctAnswer);
                if (correctAnswer < 2) {

                  playGame();
                  //updateScore();
                } else {
                  stopGame();
                }
              }
              else {
                console.log("wrong answer: ", newMarker.title)
              }
            });

          })
      });
      //console.log("myMarker is :",myMarker);

      // return myMarker;

    })
  }
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




