// ----------------------------------
// 1. DAILY GOALS AND PROGRESS
// ----------------------------------

const checkboxes = document.querySelectorAll(".goal-checkbox");
const goalCount = document.getElementById("goalCount");
const progressNumber = document.getElementById("progressNumber");
const progressFill = document.getElementById("progressFill");
const progressCaption = document.getElementById("progressCaption");

const today = new Date().toDateString();
const storageKey = "studymate-goals-" + today;

let savedGoals = [];

try {
    savedGoals = JSON.parse(localStorage.getItem(storageKey)) || [];
} catch (error) {
    savedGoals = [];
}

checkboxes.forEach(function (checkbox, index) {
    checkbox.checked = savedGoals.includes(index);
});

function updateProgress() {
    let completed = 0;
    const completedGoals = [];

    checkboxes.forEach(function (checkbox, index) {
        if (checkbox.checked) {
            completed++;
            completedGoals.push(index);
        }
    });

    const total = checkboxes.length;
    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    goalCount.textContent = completed + "/" + total;
    progressNumber.textContent = percentage + "%";
    progressFill.style.width = percentage + "%";

    progressCaption.textContent =
        "You have completed " + completed +
        " out of " + total + " goals.";

    localStorage.setItem(storageKey, JSON.stringify(completedGoals));
}

checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateProgress);
});

updateProgress();


// ----------------------------------
// 2. LESSON CONTENT
// ----------------------------------

const lessons = {
    "C Programming": {
        heading: "Lesson 1: Your First C Program",
        explanation:
            "C is a programming language. We use it to give instructions to a computer. In this example, printf() displays a message on the screen.",
        code:
            '#include <stdio.h>\n\nint main() {\n    printf("Hello, Student!");\n    return 0;\n}',
        note:
            "Remember: #include <stdio.h> gives access to printf(). " +
            "The main() function is where this program starts.",
        question:
            "Which function displays text in this C example?",
        options: ["scanf()", "printf()", "main()", "return"],
        answer: 1,
        explanationAnswer:
            "printf() displays text on the screen."
    },

    "C++ Programming": {
        heading: "Lesson 1: Class and Object",
        explanation:
            "A class is a blueprint that describes data and behaviour. An object is an instance created from that class.",
        code:
            '#include <iostream>\nusing namespace std;\n\nclass Student {\npublic:\n    string name = "Anmol";\n};\n\nint main() {\n    Student s1;\n    cout << s1.name;\n    return 0;\n}',
        note:
            "Remember: Student is the class. s1 is an object. " +
            "The dot operator (.) accesses the object's member.",
        question:
            "In this example, what is s1?",
        options: [
            "A function",
            "A class",
            "An object of Student",
            "A header file"
        ],
        answer: 2,
        explanationAnswer:
            "s1 is an object created from the Student class."
    },

    "JavaScript": {
        heading: "Lesson 1: Your First JavaScript Program",
        explanation:
            "JavaScript makes webpages interactive. The console.log() method prints a message in the browser's developer console.",
        code:
            'let student = "Anmol";\nconsole.log("Hello, " + student + "!");',
        note:
            "Remember: let creates a variable. Open browser Developer Tools " +
            "with F12 and choose Console to see the output.",
        question:
            "Which method prints a message in the console?",
        options: [
            "console.log()",
            "document.title",
            "style.color",
            "alert only"
        ],
        answer: 0,
        explanationAnswer:
            "console.log() prints a message in the developer console."
    }
};


// ----------------------------------
// 3. OPEN A SUBJECT LESSON
// ----------------------------------

const subjectButtons = document.querySelectorAll(".subject-button");
const lessonPanel = document.getElementById("lessonPanel");
const lessonTitle = document.getElementById("lessonTitle");
const lessonHeading = document.getElementById("lessonHeading");
const lessonExplanation = document.getElementById("lessonExplanation");
const lessonCode = document.getElementById("lessonCode");
const lessonNote = document.getElementById("lessonNote");

const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const quizScore = document.getElementById("quizScore");
const checkAnswer = document.getElementById("checkAnswer");
const nextQuestion = document.getElementById("nextQuestion");
const backButton = document.getElementById("backButton");

let currentLesson = null;
let selectedAnswer = null;
let answered = false;
let score = 0;
let questionsAnswered = 0;

subjectButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const subject = button.dataset.subject;
        currentLesson = lessons[subject];

        if (!currentLesson) return;

        lessonTitle.textContent = subject;
        lessonHeading.textContent = currentLesson.heading;
        lessonExplanation.textContent = currentLesson.explanation;
        lessonCode.textContent = currentLesson.code;
        lessonNote.textContent = currentLesson.note;

        // Start a fresh quiz for the selected lesson
        score = 0;
        questionsAnswered = 0;
        selectedAnswer = null;
        answered = false;

        quizScore.textContent = "";
        quizFeedback.textContent = "";
        checkAnswer.hidden = false;
        nextQuestion.hidden = true;

        renderQuestion();

        lessonPanel.hidden = false;
        lessonPanel.scrollIntoView({ behavior: "smooth" });
    });
});


// ----------------------------------
// 4. MINI QUIZ
// ----------------------------------

function renderQuestion() {
    selectedAnswer = null;
    answered = false;

    quizQuestion.textContent = currentLesson.question;
    quizOptions.replaceChildren();
    quizFeedback.textContent = "";

    checkAnswer.hidden = false;
    checkAnswer.disabled = false;
    nextQuestion.hidden = true;

    currentLesson.options.forEach(function (option, index) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "quiz-option";
        button.textContent = option;

        button.addEventListener("click", function () {
            if (answered) return;

            selectedAnswer = index;

            document.querySelectorAll(".quiz-option").forEach(
                function (item) {
                    item.classList.remove("selected");
                }
            );

            button.classList.add("selected");
        });

        quizOptions.appendChild(button);
    });
}

checkAnswer.addEventListener("click", function () {
    if (selectedAnswer === null || answered) {
        if (!answered) {
            quizFeedback.textContent = "Please select an answer first.";
        }
        return;
    }

    answered = true;
    questionsAnswered++;

    const isCorrect = selectedAnswer === currentLesson.answer;

    if (isCorrect) {
        score++;
        quizFeedback.textContent =
            "Correct! 🎉 " + currentLesson.explanationAnswer;
    } else {
        quizFeedback.textContent =
            "Not quite. Correct answer: " +
            currentLesson.options[currentLesson.answer] +
            ". " + currentLesson.explanationAnswer;
    }

    document.querySelectorAll(".quiz-option").forEach(
        function (button) {
            button.disabled = true;
        }
    );

    checkAnswer.hidden = true;
    nextQuestion.hidden = false;

    quizScore.textContent =
        "Your score: " + score + "/" + questionsAnswered;
});

nextQuestion.addEventListener("click", function () {
    // This demo has one question per subject.
    // After answering, allow the student to try again.
    renderQuestion();
    quizFeedback.textContent =
        "Try the question again and improve your score!";
});


// ----------------------------------
// 5. RETURN TO DASHBOARD
// ----------------------------------

backButton.addEventListener("click", function () {
    lessonPanel.hidden = true;

    document.getElementById("subjects").scrollIntoView({
        behavior: "smooth"
    });
});
// ----------------------------------
// DAY 4: STUDYMATE AI CHAT (DEMO)
// ----------------------------------

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");
const clearChatButton = document.getElementById("clearChat");
const suggestionButtons = document.querySelectorAll(".suggestion-button");

// Add a message safely to the chat
function addChatMessage(message, sender) {
    const messageRow = document.createElement("div");
    messageRow.className =
        "chat-message " +
        (sender === "user" ? "user-message" : "tutor-message");

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = sender === "user" ? "🧑" : "🤖";

    const content = document.createElement("div");
    content.className = "message-content";

    const name = document.createElement("strong");
    name.textContent = sender === "user" ? "You" : "StudyMate AI";

    const text = document.createElement("p");
    text.textContent = message;

    content.appendChild(name);
    content.appendChild(text);
    messageRow.appendChild(avatar);
    messageRow.appendChild(content);
    chatMessages.appendChild(messageRow);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageRow;
}


// Demo responses: these are NOT generated by a real AI
function getDemoReply(question) {
    const text = question.toLowerCase();

    if (text.includes("programming")) {
        return "Programming means writing instructions for a computer. " +
            "For example, C, C++ and JavaScript are programming languages. " +
            "Start with basic concepts, then practise small programs.";
    }

    if (text.includes("variable")) {
        return "A variable stores a value that a program can use.\n\n" +
            "Example in JavaScript:\n" +
            "let age = 18;\n\n" +
            "Here, age is the variable and 18 is its value.";
    }

    if (text.includes("learn c") || text.includes("start c")) {
        return "A beginner-friendly C learning order is:\n" +
            "1. Structure of a C program\n" +
            "2. printf() and scanf()\n" +
            "3. Variables and data types\n" +
            "4. if-else and loops\n" +
            "5. Functions and arrays\n\n" +
            "Practise one small program every day.";
    }

    if (text.includes("c++") || text.includes("class") ||
        text.includes("object")) {
        return "In C++, a class is a blueprint and an object is an " +
            "instance of that class. For example, Student can be a class, " +
            "and student1 can be an object created from it.";
    }

    if (text.includes("javascript") || text.includes("console.log")) {
        return "JavaScript helps make webpages interactive.\n\n" +
            "Example:\nlet name = 'Student';\n" +
            "console.log(name);\n\n" +
            "This prints Student in the browser's developer console.";
    }

    return "Good question! 😊 This is currently a demo tutor, so it " +
        "cannot generate a fresh AI answer for every question yet. " +
        "Try asking about programming, variables, learning C, classes " +
        "and objects, or JavaScript. We will connect a real AI model later.";
}



 // Send a message to the backend
chatForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const question = chatInput.value.trim();

    if (question === "") {
        return;
    }

    addChatMessage(question, "user");
    chatInput.value = "";
    sendButton.disabled = true;

    const typing = document.createElement("p");
    typing.className = "typing-indicator";
    typing.textContent = "StudyMate is preparing a reply...";
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: question })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        typing.remove();
        addChatMessage(data.reply, "tutor");

    } catch (error) {
        typing.remove();

        addChatMessage(
            "Backend se connect nahi ho paya. Check karo ki server.js run ho raha hai.",
            "tutor"
        );

        console.error("StudyMate API error:", error);

    } finally {
        sendButton.disabled = false;
        chatInput.focus();
    }
});



// Suggested prompts fill the input box
suggestionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        chatInput.value = button.dataset.prompt;
        chatInput.focus();
    });
});


// Clear the chat and restore the welcome message
clearChatButton.addEventListener("click", function () {
    chatMessages.replaceChildren();

    addChatMessage(
        "Hi! 👋 I'm your study companion. Ask me about C, C++, " +
        "JavaScript, or basic computer science. Let's learn together!",
        "tutor"
    );

    chatInput.value = "";
    chatInput.focus();
});