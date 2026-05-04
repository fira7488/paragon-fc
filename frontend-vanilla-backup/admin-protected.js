// Admin-only protection for all admin pages
(function () {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // List of pages that require admin access
  const adminPages = ["advanced-dashboard.html", "admin-dashboard.html"];
  const currentPage = window.location.pathname.split("/").pop();

  // Check if current page is an admin page
  const isAdminPage = adminPages.some((page) => currentPage.includes(page));

  if (isAdminPage || currentPage === "admin.html") {
    // On admin pages, require authentication
    if (!token) {
      window.location.href = "admin.html";
    }
  }

  // For admin dashboard, require super_admin role
  if (currentPage === "advanced-dashboard.html") {
    if (user.role !== "super_admin" && user.role !== "admin") {
      window.location.href = "index-ultimate.html";
    }
  }
})();
