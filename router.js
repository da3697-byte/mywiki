const app = document.getElementById("app");

async function router() {
  const route = location.hash.slice(1);
  const user = JSON.parse(localStorage.getItem("user"));

  // VIEW ARTICLE
  if (route.startsWith("/wiki/")) {
    const title = decodeURIComponent(route.replace("/wiki/", ""));
    const article = await fetchArticle(title);

    let html = `
      <h2>${title}</h2>
      <p>${article?.content || "This article does not exist yet."}</p>
    `;

    if (user?.isAdmin) {
      html += `<button onclick="location.hash='#/wiki/${encodeURIComponent(title)}/edit'">Edit Article</button>`;
    }

    app.innerHTML = html;
    return;
  }

  // EDIT ARTICLE
  if (route.endsWith("/edit")) {
    if (!user?.isAdmin) {
      app.innerHTML = "<h2>Access Denied</h2>";
      return;
    }

    const title = decodeURIComponent(route.replace("/wiki/", "").replace("/edit", ""));
    const article = await fetchArticle(title);

    app.innerHTML = `
      <h2>Edit: ${title}</h2>
      <textarea id="editor" rows="15" style="width:100%">${article?.content || ""}</textarea>
      <br>
      <button onclick="saveArticle('${title}', document.getElementById('editor').value)">Save</button>
    `;
    return;
  }

  // CREATE NEW ARTICLE
  if (route === "/new") {
    if (!user?.isAdmin) {
      app.innerHTML = "<h2>Access Denied</h2>";
      return;
    }

    app.innerHTML = `
      <h2>New Article</h2>
      <input id="newTitle" placeholder="Article Title" style="width:100%"><br><br>
      <textarea id="newContent" rows="15" style="width:100%" placeholder="Article Content"></textarea><br>
      <button onclick="saveArticle(
        document.getElementById('newTitle').value,
        document.getElementById('newContent').value
      )">Create</button>
    `;
    return;
  }

  // LOGIN / SIGNUP
  if (route === "/login") {
    app.innerHTML = `
      <h2>Login</h2>
      <input id="email" placeholder="Email"><br>
      <input id="password" type="password" placeholder="Password"><br>
      <button onclick="login(email.value, password.value)">Login</button>
    `;
    return;
  }

  if (route === "/signup") {
    app.innerHTML = `
      <h2>Signup</h2>
      <input id="email" placeholder="Email"><br>
      <input id="password" type="password" placeholder="Password"><br>
      <button onclick="signup(email.value, password.value)">Signup</button>
    `;
    return;
  }

  // ADMIN LOGIN PANEL
  if (route === "/admin") {
    app.innerHTML = `
      <h2>Admin Login</h2>
      <input id="adminUser" placeholder="Username"><br>
      <input id="adminPass" type="password" placeholder="Password"><br>
      <button onclick="adminLogin(adminUser.value, adminPass.value)">Login as Admin</button>
    `;
    return;
  }

  // ADMIN PANEL
  if (route === "/admin-panel") {
    if (!user?.isAdmin) {
      app.innerHTML = "<h2>Access Denied</h2>";
      return;
    }

    app.innerHTML = `
      <h2>Admin Panel 👑</h2>
      <button onclick="location.hash='#/new'">Create New Article</button>
      <p>Use the sidebar search or links to edit existing articles.</p>
    `;
    return;
  }

  // MAIN PAGE
  app.innerHTML = `
    <h2>Main Page</h2>
    <p>Welcome to MyWiki — a mini Wikipedia clone!</p>
  `;
}

// SPA router
window.addEventListener("hashchange", router);
router();

// Search bar live update
const searchInput = document.getElementById("searchBar");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    handleSearch(e.target.value);
  });
}
