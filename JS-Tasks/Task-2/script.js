/*Variable Hoisting in JavaScript
*/

//Q1. Predict output of:
console.log(a);
var a = 10; 
//✅ Output: undefined 
//Explanation: 'var' declarations are hoisted but not initialized.
//Internally, JS does:
//var a; 
//console.log(a); //undefined
//a = 10;

//Q2. Predict output of:
console.log(b);
let b = 10; 
//❌ ReferenceError: Cannot access 'b' before initialization
//Explanation: 'let' is hoisted but stays in the Temporal Dead Zone (TDZ)
//until the line of initialization.

//Q3. Predict output of:
test();
function test() {
  console.log("Hello");
}
//✅ Output: Hello
//Explanation: Function declarations are fully hoisted — both name & body.
//So you can call them before they are defined.

//Q4. Try writing a function expression before initialization and call it:
hello();
var hello = function() {
  console.log("Hi");
};
//❌ TypeError: hello is not a function
//Explanation: Variable 'hello' is hoisted (declared but undefined).
//The function expression part is not hoisted.
//During hoisting:
//var hello;
//hello(); //undefined() → TypeError
//hello = function() {...}

//Q5. Write one sentence:
//✅ What gets hoisted?
//Variable declarations (var) and function declarations are hoisted.

//🚫 What does not get hoisted fully?
//let, const, and function expressions are not fully hoisted (they remain in the TDZ).

/*--------------------------------------------*/

/*Conditional Operators (if, else, else-if, ternary, switch)
*/

/*--------------------------------------------*/
//Q1. Take input using prompt for age.
//If age >= 18 → log “Adult”.
//Else → log “Minor”.

let age = prompt("Enter your age:");

if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
//✅ If input is 20 → Adult
//✅ If input is 15 → Minor

//Q2. Write a program:
//If marks >= 90 → “A grade”
//Else if marks >= 75 → “B grade”
//Else if marks >= 50 → “C grade”
//Else → “Fail”

let marks = prompt("Enter your marks:");

if (marks >= 90) {
  console.log("A grade");
} else if (marks >= 75) {
  console.log("B grade");
} else if (marks >= 50) {
  console.log("C grade");
} else {
  console.log("Fail");
}

//Q3. Create a variable city = “Bhopal”.
//If city is “Bhopal” → log “MP”
//Else if city is “Delhi” → log “Capital”
//Else → log “Unknown City”

let city = "Bhopal";

if (city === "Bhopal") {
  console.log("MP");
} else if (city === "Delhi") {
  console.log("Capital");
} else {
  console.log("Unknown City");
}

//Q4. Use ternary operator:
//Let score = 40.
//If score >= 35 → “Pass” else “Fail” using a ternary.

let score = 40;
let result = (score >= 35) ? "Pass" : "Fail";
console.log(result); //✅ Output: Pass

//Q5. Convert this if-else into a ternary:
//if (temperature >= 30) { "Hot" } else { "Pleasant" }

let temperature = 30;
let weather = (temperature >= 30) ? "Hot" : "Pleasant";
console.log(weather); //✅ Output: Hot

//Q6. Write a switch case:
//Take day number (1 to 7).
//Print the day name. Default case: “Invalid Day”.

let day = parseInt(prompt("Enter day number (1-7):"));

switch (day) {
  case 1:
    console.log("Sunday");
    break;
  case 2:
    console.log("Monday");
    break;
  case 3:
    console.log("Tuesday");
    break;
  case 4:
    console.log("Wednesday");
    break;
  case 5:
    console.log("Thursday");
    break;
  case 6:
    console.log("Friday");
    break;
  case 7:
    console.log("Saturday");
    break;
  default:
    console.log("Invalid Day");
}

//Q7. Using logical operators in condition:
//If age >= 18 and country == “India” → log “Eligible for Vote”
//Else → “Not Eligible”

let personAge = 20;
let country = "India";

if (personAge >= 18 && country === "India") {
  console.log("Eligible for Vote");
} else {
  console.log("Not Eligible");
}
