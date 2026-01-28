const SUPABASE_URL = "https://qclzywmxapdobhobffju.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjbHp5d214YXBkb2Job2JmZmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Mjc2OTIsImV4cCI6MjA4NTIwMzY5Mn0.3FNKfDTkjHYplcgujBzcrRxjSof29dG1mHm1TiWrN40";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const authNav = document.getElementById("auth-nav");

// Admin credentials (frontend-only demo)
const ADMIN_USERNAME = "Declan";
const ADMIN_PASSWORD = "declan123#";

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  updateAuthUI();
}

function updateAuthUI() {
  const user = getUser();
  if (user) {
    authNav.innerHTML = `
      <span>
        ${user.email || user.username} ${user.isAdmin ? "👑" : ""}
      </span>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    authNav.innerHTML = `
      <a href="#/login">Login</a> |
      <a href="#/signup">Signup</a>
    `;
  }
}

// User login (Supabase)
async function login(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  setUser(data.user);
  location.hash = "#/";
}

// User signup (Supabase)
async function signup(email, password) {
  const { error } = await sb.auth.signUp({ email, password });
  if (error) return alert(error.message);
  alert("Check your email to confirm account.");
}

// Admin login (local)
function adminLogin(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    setUser({ username: "Declan", isAdmin: true });
    location.hash = "#/admin-panel";
  } else {
    alert("Wrong admin credentials");
  }
}

// Logout
async function logout() {
  await sb.auth.signOut();
  localStorage.removeItem("user");
  updateAuthUI();
  location.hash = "#/";
}

updateAuthUI();
