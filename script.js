const phrases = [
    "Electrical Engineer.",
    "Control Systems Engineer.",
    "Embedded Systems Engineer.",
    "Robot Designer.",
    "CAD Creator.",
    "3D Printing Pro.",
    "Python Wizard.",
    "JavaScript Journeyman.",
    "Web Developer.",
    "Linux User.",
    "Open Source Contributor.",
    "AI Enthusiast.",
    "Problem Solver.",
    "Math Tutor.",
    "Coding Mentor.",
    "STEM Advocate.",
    "Car Coder."
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Always open on "Electrical Engineer." so the first impression is the headline role
let shuffledPhrases = [phrases[0], ...shuffleArray(phrases.slice(1))];
let currentIndex = 0;
const changingText = document.getElementById("changing-text");

let typingSpeed = 85;   // Base speed of typing in milliseconds
let erasingSpeed = 40;  // Speed of erasing in milliseconds
let delayBetweenPhrases = 1800; // Pause while a phrase is fully shown

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
            // Slight jitter so the typing feels human rather than mechanical
            setTimeout(type, typingSpeed + Math.random() * 60);
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
            setTimeout(callback, 300);
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
        eraseText(() => {
            currentIndex++;
            changeText();
        });
    });
}

// Reduced motion: swap whole phrases instead of typing them
function cycleStatic() {
    changingText.textContent = shuffledPhrases[currentIndex % shuffledPhrases.length];
    currentIndex++;
    setTimeout(cycleStatic, 3000);
}

// Sidebar (mobile drawer)
const hamburger = document.querySelector(".hamburger");

function toggleSidebar(force) {
    const open = document.body.classList.toggle("show-sidebar", force);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") toggleSidebar(false);
});

// Highlight the nav link for the section currently in view
function initScrollSpy() {
    const links = document.querySelectorAll("nav a");
    const sections = document.querySelectorAll("main section[id]");

    links.forEach((link) => link.addEventListener("click", () => toggleSidebar(false)));

    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach((section) => spy.observe(section));
}

// Fade sections in as they scroll into view
function initReveal() {
    const revealer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));
}

// Start everything when the page loads
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("year").textContent = new Date().getFullYear();
    initScrollSpy();
    initReveal();

    if (prefersReducedMotion) {
        cycleStatic();
    } else {
        setTimeout(changeText, 600);
    }
});
