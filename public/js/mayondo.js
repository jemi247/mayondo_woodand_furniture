// main.js
// Mayondo Wood & Furniture Ltd – Main Site Script

document.addEventListener("DOMContentLoaded", () => {
console.log("MWF script loaded successfully");

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener("click", e => {
const target = document.querySelector(anchor.getAttribute("href"));
if (target) {
e.preventDefault();
target.scrollIntoView({ behavior: "smooth" });
}
});
});

// form validation
const forms = document.querySelectorAll("form");

forms.forEach(form => {
form.addEventListener("submit", e => {
const requiredFields = form.querySelectorAll("[required]");
let valid = true;

requiredFields.forEach(field => {
if (!field.value.trim()) {
valid = false;
field.classList.add("error");
} else {
field.classList.remove("error");
}
});

if (!valid) {
e.preventDefault();
alert("⚠️ Please fill in all required fields before submitting.");
} else {
alert("Form submitted successfully!");
}
});
});

// navigation link
const navLinks = document.querySelectorAll("nav a");
const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(link => {
if (link.getAttribute("href") === currentPage) {
link.classList.add("active");
} else {
link.classList.remove("active");
}
});
});
