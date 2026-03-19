(function () {
  var STORAGE_KEY = "pkg-theme";
  var LIGHT_CLASS = "theme-light";

  function applyTheme(theme) {
    var body = document.body;
    if (!body) return;
    if (theme === "light") {
      body.classList.add(LIGHT_CLASS);
    } else {
      body.classList.remove(LIGHT_CLASS);
    }
  }

  // Khởi tạo từ localStorage
  try {
    var saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    }
  } catch (e) {
    // Bỏ qua lỗi nếu không truy cập được localStorage
  }

  // Gắn sự kiện cho toggle
  window.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var body = document.body;
      if (!body) return;
      var isLight = !body.classList.contains(LIGHT_CLASS);
      applyTheme(isLight ? "light" : "dark");
      try {
        window.localStorage.setItem(STORAGE_KEY, isLight ? "light" : "dark");
      } catch (e) {
        // ignore
      }
    });
  });
})();

