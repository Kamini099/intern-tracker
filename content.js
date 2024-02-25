// content.js
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.style.border = "1px solid #FF5733";
    link.style.padding = "2px";
  });
});
