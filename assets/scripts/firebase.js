// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBLk3mtxqYgoS0DT0iHT-NSsqBSiizpf4g",
    authDomain: "whereintheworld-df6df.firebaseapp.com",
    databaseURL: "https://whereintheworld-df6df.firebaseio.com",
    projectId: "whereintheworld-df6df",
    storageBucket: "",
    messagingSenderId: "537579770542",
    appId: "1:537579770542:web:c6200290332d27abe3933f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();



function pushUserScore(name, score) {
    var scoreObj = {
        user: name,
        score: score
    };

    database.ref("/scores").push(
        scoreObj
    );
}

var scores = [];

var testSnapshot;
database.ref("/scores").on("value", function (snapshot) {
    
    testSnapshot = snapshot;
    // snapshot.node.children.forEach(child => {
    //     scores.push(child);
    // });

    updateLeaderboard(scores);
}), function (errorObject) {
    console.error(errorObject);
}

function updateLeaderboard(scores){
    scores.forEach(score => {
        console.log(score.user);
    });
}