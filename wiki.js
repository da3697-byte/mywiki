// Fetch single article
async function fetchArticle(title) {
  const { data, error } = await sb
    .from("articles")
    .select("*")
    .eq("title", title)
    .single();

  if (error) return null;
  return data;
}

// Save or create article (admin only)
async function saveArticle(title, content) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.isAdmin) return alert("Only admins can save articles.");

  const { error } = await sb
    .from("articles")
    .upsert({ title, content }, { onConflict: ["title"] });

  if (error) return alert(error.message);
  alert("Article saved!");
  location.hash = `#/wiki/${encodeURIComponent(title)}`;
}

// Fetch all article titles
async function fetchAllArticles() {
  const { data, error } = await sb
    .from("articles")
    .select("title");

  if (error) return [];
  return data.map(a => a.title);
}

// Search articles by query
async function searchArticles(query) {
  const titles = await fetchAllArticles();
  return titles.filter(title => title.toLowerCase().includes(query.toLowerCase()));
}

// Render search results in sidebar
async function handleSearch(query) {
  const resultsDiv = document.getElementById("searchResults");
  if (!resultsDiv) return;

  if (!query) {
    resultsDiv.innerHTML = "";
    return;
  }

  const results = await searchArticles(query);

  if (results.length === 0) {
    resultsDiv.innerHTML = "<p style='font-size:0.9em;color:#555;'>No articles found</p>";
    return;
  }

  resultsDiv.innerHTML = results
    .map(title => `<a href="#/wiki/${encodeURIComponent(title)}">${title}</a>`)
    .join("<br>");
}
