class Question {
    cityName: string;
    clue: string;
    answer: boolean;

    constructor(answer: string, clue: string) {
        this.cityName = answer;
        this.clue = clue;
        this.answer = false;
    }
}

var quests;
var usedCitys = Array<string>();
var currentQuestions = Array<Question>();

function buildQuestions(response): Array<Question> {
    let questions = Array<Question>();
    response.forEach(question => {
        let newQuestion = new Question(question.answer, question.question);
        questions.push(newQuestion);
    });

    return questions;
}

function shuffleArray(array: Array<Question>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
        test();
        return currentQuestions;

    }).catch((err) => {
        console.error("Problem getting data from jservice:" + err);
    });
}

function parseQuestions(questions: Array<Question>) {
    //redeclare the array to empty it out for new use;
    currentQuestions = Array<Question>();
    shuffleArray(questions);
    while (currentQuestions.length < 4) {
        for (let index = 0; index < 4; index++) {
            const element = questions[index];
            if (usedCitys.indexOf(element.cityName) === -1) {
                currentQuestions.push(element);
            }
        }
    }
}

function getAnswer() {
    currentQuestions = shuffleArray(currentQuestions);
    currentQuestions[0].answer = true;
    usedCitys.push(currentQuestions[0].cityName);
}

function test() {
    parseQuestions(quests);
    getAnswer();
}