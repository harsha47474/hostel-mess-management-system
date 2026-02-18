document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleBtn");

  if (toggleBtn) {
    let showVegOnly = false;

    toggleBtn.addEventListener("click", () => {
      showVegOnly = !showVegOnly;

      document.querySelectorAll(".nonveg").forEach(item => {
        item.style.display = showVegOnly ? "none" : "inline-block";
      });

      toggleBtn.innerText = showVegOnly ? "Show Full Menu" : "Show Veg Only";
    });
  }
});