const phrases = [
    "Computer Enthusiast.",
    "Electrical Engineer.",
    "Full-Time Nerd.",
    "Robot Designer.",
    "Math Tutor.",
    "Coding Mentor.",
    "AI Enthusiast.",
    "Technology Advocate.",
    "Problem Solver.",
    "Tech Educator.",
    "Controls Systems Superhero.",
    "Open Source Contributor.",
    "CAD Creator.",
    "3D Printing Pro.",
    "Web Developer.",
    "STEM Advocate.",
    "Embedded Systems Engineer.",
    "Linux User.",
    "Python Wizard.",
    "JavaScript Journeyman.",
    "Engine Enabler.",
    "Car Coder."
];

let shuffledPhrases = shuffleArray([...phrases]);
let currentIndex = 0;
const changingText = document.getElementById("changing-text");

let typingSpeed = 100; // Speed of typing in milliseconds
let erasingSpeed = 50;  // Speed of erasing in milliseconds
let delayBetweenPhrases = 2000; // Delay between erasing and starting the next phrase

// Ensure the element starts with an empty string
changingText.textContent = "";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function typeText(text, callback) {
    let i = 0;
    function type() {
        if (i < text.length) {
            changingText.textContent += text.charAt(i);
            i++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(callback, delayBetweenPhrases);
        }
    }
    type();
}

function eraseText(callback) {
    let length = changingText.textContent.length;
    function erase() {
        if (length > 0) {
            changingText.textContent = changingText.textContent.slice(0, length - 1);
            length--;
            setTimeout(erase, erasingSpeed);
        } else {
            callback();
        }
    }
    erase();
}

function changeText() {
    if (currentIndex >= shuffledPhrases.length) {
        shuffledPhrases = shuffleArray([...phrases]);
        currentIndex = 0;
    }

    const currentPhrase = shuffledPhrases[currentIndex];
    changingText.textContent = ""; // Clear text before typing
    typeText(currentPhrase, () => {
        setTimeout(() => eraseText(() => {
            currentIndex++;
            changeText();
        }), delayBetweenPhrases);
    });
}

// Start the typing effect when the page loads
document.addEventListener("DOMContentLoaded", function() {
    changeText();
});