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
var displayName;
var email;
var emailVerified;
var photoURL;
var isAnonymous;
var uid;
var providerData;


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

function updateLeaderboard(scores) {
    scores.forEach(score => {
        console.log(score.user);
    });
}

function testSignin(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}


function testCreate(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}



firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        displayName = user.displayName;
        email = user.email;
        emailVerified = user.emailVerified;
        photoURL = user.photoURL;
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        providerData = user.providerData;
        // ...
    } else {
        // User is signed out.
        // ...
    }
});

var scoresTest = [
    user1 = {
        name: "Mike",
        score: "30"
    },
    user1= {
        name: "Bill",
        score: "20"
    },
    user1 = {
        name: "Joe",
        score: "15"
    },
    user1 = {
        name: "Mary",
        score: "19"
    },
    user1 = {
        name: "Daria",
        score: "21"
    },
    user1 = {
        name: "Chelsea",
        score: "14"
    }
]

function displayScores(scores) {
    var leaderBoardDiv = $('#leaderboard');
    var table = $('<table>');
    var thread = $('<thread>');
    var nameHeader = $('<th>').text("Name");
    var scoreHeader = $('<th>').text("Score");
    thread.append(nameHeader);
    thread.append(scoreHeader);
    table.append(thread);

    scores.forEach(score => {
        var row = $('<tr>')
        var nameData = $('<td>').text(score.name);
        var scoreData = $('<td>').text(score.score);
        row.append(nameData, scoreData);
        table.append(row);
    });
    table.append('<tbody>');
    leaderBoardDiv.append(table);
}