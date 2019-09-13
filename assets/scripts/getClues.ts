class Question {
    cityName: string;
    clue: string;

    constructor(answer: string, clue: string) {
        this.cityName = answer;
        this.clue = clue;
    }
}

var quests;


function buildQuestions(response): Array<Question>{
    let questions = Array<Question>();
    response.forEach(question => {
        let newQuestion = new Question(question.answer, question.question);
        questions.push(newQuestion);
    });
    
    return questions;
}

function getQuestions() {
    let queryURL = "http://jservice.io/api/clues?category=";
    let category = "78";
    queryURL += category;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        quests = buildQuestions(response);
    }).catch((err) => {
        console.error("Problem getting data from jservice:" + err);
    });
}

function parseQuestions(questions: Array<Question>){
    questions.forEach(Question => {
        console.log(Question.clue);
    });
}