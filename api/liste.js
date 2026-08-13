// Fonction Vercel : génère une page "recette" que Bring! sait scanner.
// Les articles de courses sont passés dans l'URL et affichés comme ingrédients
// au format schema.org/Recipe (JSON-LD) que Bring! détecte automatiquement.

export default function handler(req, res) {
  // Les articles arrivent dans l'URL : ?items=article1|article2|article3
  const itemsParam = req.query.items || "";
  const items = itemsParam.split("|").map(s => s.trim()).filter(Boolean);
  const title = req.query.title || "Ma liste de courses";

  // JSON-LD schema.org/Recipe — format minimal et robuste que Bring! accepte
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": title,
    "image": ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"],
    "author": { "@type": "Person", "name": "Le carnet de la maison" },
    "datePublished": new Date().toISOString().split("T")[0],
    "description": "Liste de courses de la semaine.",
    "prepTime": "PT10M",
    "cookTime": "PT10M",
    "totalTime": "PT20M",
    "recipeYield": "4",
    "recipeIngredient": items,
    "recipeInstructions": [
      { "@type": "HowToStep", "name": "Courses", "text": "Ajoute les articles à ta liste." },
    ],
  };

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Recette ${title}</title>
<meta name="description" content="Liste de courses de la semaine avec ${items.length} ingrédients.">
<meta property="og:type" content="article">
<meta property="og:title" content="Recette ${title}">
<meta property="og:description" content="Liste de courses de la semaine avec ${items.length} ingrédients.">
<meta property="og:image" content="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Le carnet de la maison">
<meta name="page-type" content="recette">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Recette ${title}">
<meta name="twitter:image" content="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px; color: #2b2622; background: #faf8f4; }
h1 { font-family: Georgia, serif; font-size: 24px; }
ul { list-style: none; padding: 0; }
li { padding: 12px 0; border-bottom: 1px solid #e8e3da; font-size: 16px; }
.hint { background: #f3ecd9; padding: 14px; border-radius: 12px; font-size: 14px; margin-top: 20px; }
</style>
</head>
<body>
<div itemscope itemtype="https://schema.org/Recipe">
<h1 itemprop="name">${title}</h1>
<img itemprop="image" src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" alt="${title}" style="width:100%;border-radius:12px;margin-bottom:16px">
<h2>Ingrédients</h2>
<ul>
${items.map(i => `<li itemprop="recipeIngredient">${i}</li>`).join("\n")}
</ul>
<div itemprop="recipeInstructions">Ajoute les articles à ta liste Bring!</div>
</div>
<div class="hint">Ouvre le menu Partager puis choisis Bring! pour ajouter ces articles à ta liste.</div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
