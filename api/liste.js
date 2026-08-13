// Fonction Vercel : génère une page "recette" que Bring! sait scanner.
// Les articles de courses sont passés dans l'URL et affichés comme ingrédients
// au format schema.org/Recipe (JSON-LD) que Bring! détecte automatiquement.

export default function handler(req, res) {
  // Les articles arrivent dans l'URL : ?items=article1|article2|article3
  const itemsParam = req.query.items || "";
  const items = itemsParam.split("|").map(s => s.trim()).filter(Boolean);
  const title = req.query.title || "Ma liste de courses";

  // Construire le JSON-LD schema.org/Recipe
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": title,
    "recipeIngredient": items,
    "recipeInstructions": "Liste de courses générée par Le carnet de la maison.",
    "recipeYield": "1",
  };

  // Page HTML avec le JSON-LD dans le <head> — lisible par Bring! au chargement
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px; color: #2b2622; background: #faf8f4; }
    h1 { font-family: Georgia, serif; font-size: 24px; }
    ul { list-style: none; padding: 0; }
    li { padding: 12px 0; border-bottom: 1px solid #e8e3da; font-size: 16px; }
    .hint { background: #f3ecd9; padding: 14px; border-radius: 12px; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>🥘 ${title}</h1>
  <ul>
    ${items.map(i => `<li>${i}</li>`).join("\n    ")}
  </ul>
  <div class="hint">
    Pour ajouter à Bring! : appuie sur Partager (carré avec flèche) → Bring!, ou ouvre Bring! et importe ce lien.
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
