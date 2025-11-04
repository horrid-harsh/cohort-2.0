// /*Variables and Keywords (var, let, const)
// */

// //Q1. Declare your name using all three
// var a = "Harsh";
// let b = "Sheryians";
// const c = "School";

// //Q2. Try reassigning them
// a = "Updated";
// b = "Updated";
// c = "Updated"; //❌ TypeError: Assignment to constant variable.

// //Q3. Create a variable inside curly braces using let and log it outside
// {
//   let city = "Bhopal";
// }
// console.log(city); // ❌ ReferenceError: city is not defined

// //Q4. Write 3 examples where const is useful
// const PI = 3.14159;              
// const BASE_URL = "https://api.example.com";  
// const DAYS_IN_WEEK = 7;

// /*Logging and Interaction (console, alert, prompt)
// */

// //Q1. Log name, age, and city using console.log, console.info, and console.warn
// console.log("Name: Harsh");
// console.info("Age: 20"); //ℹ️ Age: 20
// console.warn("City: Bhopal"); //⚠️ City: Bhopal

// //Q2. Use prompt() to take user’s name → then alert a welcome message
// let userName = prompt("Enter your name:");
// alert("Welcome, " + userName + "!");

// //Q3. Log the typeof user’s input
// console.log(typeof userName);

// //Q4. Try this:
// let age = prompt("Enter age:");
// console.log(age + 5);

// /*Working with Strings
//  */

// //Q1. Declare the string
// let msg = "I love Sheryians";

// //Q2. Try msg.slice(2, 6) and predict the result
// msg.slice(2, 6); //love

// //Q3. Try msg.split(" ") and count words
// msg.split(" "); //["I", "love", "Sheryians"]

// //Q4. Try msg.replace("love", "study at")
// msg.replace("love", "study at"); //"I study at Sheryians"

// //Q5. Template string example
// let name = "Harsh";
// console.log(`Hey ${name}, welcome to JS!`); //Hey Harsh, welcome to JS!

// //Q6. Check if msg.includes("love")
// msg.includes("love");

// /*Statements and Semicolons
// */

// //Q2. Combine two statements in one line and see if it breaks
// let city = "Bhopal" console.log(city) //Uncaught SyntaxError: Unexpected identifier

// /*Expressions vs Statements
// */

// /*Q5. One-line explanation of the difference

// 🔹 Expression: Produces a value. Ex:- 5 + 10
// 🔹 Statement: Performs an action or defines structure. Ex:- let x = 10;
// */

// /*Data Types
// */

// //Q1. Declare variables of different data types
// let age = 25;                  // number
// let name = "Harsh";            // string
// let isStudent = true;          // boolean
// let skills = ["JS", "HTML"];   // object (arrays are objects in JS)
// let user = { city: "Bhopal" }; // object
// let x = null;                  // object (this is a known JS bug)
// let y;                         // undefined
// let z = Symbol("id");          // symbol

// /*Special Values
// */

// //Q1. Log the following values
// console.log(1 / 0); //Infinity
// console.log(0 / 0); //NaN
// console.log(Number("abc")); //NaN
// console.log(undefined + 1); //NaN

