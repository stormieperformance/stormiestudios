const news = document.getElementById("news");

news.innerHTML = "<p style='color:yellow;'>JS laddad</p>";

try {
  const SUPABASE_URL = "https://lhxbzhjymxseucmmodmi.supabase.co";
  const SUPABASE_KEY = "sb_publishable__Bs8LsdEtlwHzzAxXkfVYQ_hHptrnE1";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  async function loadNews() {
    news.innerHTML = "<p style='color:yellow;'>Laddar nyheter...</p>";

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) {
      news.innerHTML = `<p style="color:red;">Supabase error: ${error.message}</p>`;
      return;
    }

    if (!data || data.length === 0) {
      news.innerHTML = "<p style='color:orange;'>Inga nyheter hittades.</p>";
      return;
    }

    news.innerHTML = data.map(item => `
      <article>
        <h3>${item.title || ""}</h3>
        <p>${item.content || ""}</p>
        ${item.image_url ? `<img src="${item.image_url}" alt="${item.title || "Nyhet"}">` : ""}
      </article>
    `).join("");
  }

  loadNews();
} catch (e) {
  news.innerHTML = `<p style="color:red;">JS crash: ${e.message}</p>`;
}
