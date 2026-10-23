
const http = require("http");

function getDemoReply(question) {
  const text = question.toLowerCase().trim();

  // Programming basics
  if (text.includes("programming")) {
    return "Programming means writing instructions for a computer. " +
      "Languages like C, C++ and JavaScript help us create software. " +
      "Start with variables, conditions, loops and functions.";
  }

  // Variables
  if (text.includes("variable")) {
    return "A variable stores a value that a program can use.\n\n" +
      "JavaScript example:\nlet age = 18;\n\n" +
      "Here, age is the variable and 18 is its value.";
  }

  // C++ — check before C
  if (
    text.includes("c++") ||
    text.includes("class") ||
    text.includes("object")
  ) {
    return "In C++, a class is a blueprint and an object is an " +
      "instance of that class.\n\n" +
      "Example:\nclass Student { };\nStudent s1;\n\n" +
      "Here, Student is the class and s1 is an object.";
  }

  // JavaScript
  if (
    text.includes("javascript") ||
    text.includes("console.log")
  ) {
    return "JavaScript makes webpages interactive.\n\n" +
      "Example:\nlet name = 'Student';\n" +
      "console.log(name);\n\n" +
      "This prints Student in the browser console.";
  }

  // C programming
  if (
    text.includes("learn c") ||
    text.includes("start c") ||
    text.includes(" c language") ||
    text === "c" ||
    text.includes(" c programming")
  ) {
    return "A beginner-friendly C learning path:\n\n" +
      "1. Structure of a C program\n" +
      "2. printf() and scanf()\n" +
      "3. Variables and data types\n" +
      "4. if-else conditions\n" +
      "5. Loops, functions and arrays\n\n" +
      "Practise one small program every day.";
  }

  // Loops
  if (text.includes("loop")) {
    return "A loop repeats a block of code.\n\n" +
      "JavaScript example:\n" +
      "for (let i = 1; i <= 3; i++) {\n" +
      "  console.log(i);\n" +
      "}\n\n" +
      "This prints 1, 2 and 3.";
  }

  // Functions
  if (text.includes("function")) {
    return "A function is a reusable block of code.\n\n" +
      "JavaScript example:\n" +
      "function greet() {\n" +
      "  return 'Hello!';\n" +
      "}\n\n" +
      "Call greet() to use the function.";
  }

  // HTML
  if (text.includes("html")) {
    return "HTML structures the content of a webpage.\n\n" +
      "Example:\n<h1>Hello, Student!</h1>\n" +
      "<p>Welcome to StudyMate AI.</p>\n\n" +
      "HTML uses elements called tags.";
  }

  // Conditions
  if (
    text.includes("if-else") ||
    text.includes("condition")
  ) {
    return "Conditions let a program make decisions.\n\n" +
      "JavaScript example:\n" +
      "let age = 18;\n" +
      "if (age >= 18) {\n" +
      "  console.log('Adult');\n" +
      "}\n\n" +
      "The code runs when the condition is true.";
  }

  // Default response
  return "Good question! 😊 I'm currently using predefined " +
    "demo answers, not a real AI model.\n\n" +
    "Try asking about programming, variables, C, C++, " +
    "JavaScript, classes, objects, loops, functions or HTML.";
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("StudyMate AI Backend is Running!");
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 10000) {
        res.writeHead(413, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({ error: "Message is too large." }));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (res.writableEnded) return;

      try {
        const data = JSON.parse(body);
        const question = data.message;

        if (typeof question !== "string" || !question.trim()) {
          res.writeHead(400, {
            "Content-Type": "application/json"
          });
          return res.end(JSON.stringify({
            error: "Please enter a question."
          }));
        }

        const reply = getDemoReply(question);

        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8"
        });

        res.end(JSON.stringify({ reply }));
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({ error: "Invalid JSON." }));
      }
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("StudyMate AI server running at http://localhost:3000");
});
