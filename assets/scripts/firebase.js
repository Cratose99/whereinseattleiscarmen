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
//Set up global variables for use in firebase
var displayName = "";
var email;
var uid;
var currentScore;
var previousScore;
var userScores = [];
var testSnapshot;

function signOut() {
    console.log("Inside sign out");
    firebase.auth().signOut().then(() => {
        console.log("signed out!")
        displayName = "";
        email = "";
        uid = "";
        currentScore = "";
        previousScore = "";
    }).catch(function (error) {
        // An error happened.
    });
}

function writeUserDataForLoggedInUser(currentScore) {
    console.log("Writing user data...")
    firebase.database().ref('users/' + uid).set({
        username: displayName,
        email: email,
        score: currentScore
    });
}

function updateHighScoreForLoggedInUser(currentScore) {
    console.log("current:" + currentScore)
    console.log("previous score:" + previousScore)
    if (currentScore > previousScore) {
        writeUserDataForLoggedInUser(currentScore);
    }
}

function signin(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(cred => {
        console.log("Signed in with creds: " + cred);
        window.location.assign("./map.html");
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}

function createEntryForNewUser(displayName, email, uid) {
    console.log("Writing new user data for user" + uid)
    previousScore = 0;
    firebase.database().ref('users/' + uid).set({
        username: displayName,
        email: email,
        score: previousScore
    }).then(() => {
        window.location.assign("./map.html");
    });
}
var credobj;

function createAuthProfile(newusername, email, password) {
    displayName = newusername;
    console.log("Display name in createauth: " + newusername);
    firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
        credobj = cred;
        console.log("Creating entry with" + newusername + " " + email + "creds" + cred)
        createEntryForNewUser(newusername, email, cred.user.uid)
    });

}
var currentuser;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentuser = user;
        console.log("Auth state changed...")
        email = user.email;
        emailVerified = user.emailVerified;
        photoURL = user.photoURL;
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        providerData = user.providerData;
        //TODO: Get previous score for this user, if it's available
        firebase.database().ref('/users/' + uid).once('value').then(function (snapshot) {

            if (snapshot.exists()) {
                console.log("getting values from snapshot for a previous user")
                displayName = snapshot.val().username;
                previousScore = snapshot.val().score;
            }
        });

        // ...
    } else {
        // User is signed out.
        // ...
    }
});

function sortScores(scores) {
    scores = scores.sort((a, b) => (a.score < b.score) ? 1 : -1);
    return scores;
}

function topTenScores(scores) {
    scores = scores.slice(0, 9);
    return scores;
}

database.ref().on("value", function (snapshot) {
    console.log(snapshot.val())
    var currentSnapshot = snapshot.val();

    for (let key in currentSnapshot) {
        console.log(key)
        for (innerKey in currentSnapshot[key]) {
            var userObj = currentSnapshot[key][innerKey];
            userScores.push(userObj);
            if (innerKey === uid) {
                console.log("here!");
                //displayName = userObj.username;
                // = userObj.score;
            }
        }
    }
    displayScores(userScores);
    userScores = [];
});

function displayScores(scores) {
    scores = sortScores(scores);
    scores = topTenScores(scores);
    var leaderBoardDiv = $('#leaderboard');
    leaderBoardDiv.empty();
    var table = $('<table>');
    table.attr("class", "striped")
    table.attr("class", "responsive-table");
    table.attr("id", "leaderboardTable");
    var thead = $('<thead>');
    var nameHeader = $('<th>').text("Name");
    var scoreHeader = $('<th>').text("Score");
    thead.append(nameHeader);
    thead.append(scoreHeader);
    table.append(thead);

    scores.forEach(score => {
        var row = $('<tr>')
        var nameData = $('<td>').text(score.username);
        var scoreData = $('<td>').text(score.score);
        row.append(nameData, scoreData);
        table.append(row);
    });
    table.append('<tbody>');
    leaderBoardDiv.append(table);
}

$('#signUp').on("click", function (event) {
    var pWord = $('#password').val();
    displayName = $('#first_name').val();
    email = $('#email').val();

    createAuthProfile(displayName, email, pWord);
    console.log("Authorized new user");

})

$('#signIn').on("click", function (event) {
    email = $('#email').val();
    var pWord = $('#password').val();

    signin(email, pWord);
    console.log("Logged in via sign in button: " + displayName);
})