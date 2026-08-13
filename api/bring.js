// Fonction Vercel : envoie les articles directement dans Bring! via l'API officielle.
// Les identifiants Bring! sont lus depuis les variables d'environnement Vercel
// (BRING_EMAIL et BRING_PASSWORD) — ils ne sont JAMAIS dans le code.
//
// Le bouton de l'app appelle : POST /api/bring  avec un corps JSON { items: ["Lait", "Pain", ...] }

const BRING_API = "https://api.getbring.com/rest/v2";
// Clé publique de l'API Bring! (la même pour tout le monde, utilisée par l'app officielle)
const BRING_HEADERS = {
  "X-BRING-API-KEY": "cof4Nc6P8QDmJ9dNq5Uw5xJi",
  "X-BRING-CLIENT": "webApp",
  "X-BRING-CLIENT-SOURCE": "webApp",
  "X-BRING-COUNTRY": "FR",
};

export default async function handler(req, res) {
  // Autoriser seulement POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const email = process.env.BRING_EMAIL;
  const password = process.env.BRING_PASSWORD;

  if (!email || !password) {
    res.status(500).json({ error: "Identifiants Bring! non configurés dans Vercel (BRING_EMAIL / BRING_PASSWORD)." });
    return;
  }

  // Récupérer les articles envoyés par l'app
  let items = [];
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    items = body.items || [];
  } catch (e) {
    res.status(400).json({ error: "Corps de requête invalide." });
    return;
  }

  if (items.length === 0) {
    res.status(400).json({ error: "Aucun article à envoyer." });
    return;
  }

  try {
    // ÉTAPE 1 — Login
    const loginRes = await fetch(`${BRING_API}/bringauth`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, password }).toString(),
    });

    if (!loginRes.ok) {
      res.status(401).json({ error: "Login Bring! échoué. Vérifie ton email et mot de passe." });
      return;
    }

    const loginData = await loginRes.json();
    const accessToken = loginData.access_token;
    const bringListUuid = loginData.bringListUUID;

    // En-têtes authentifiés pour les requêtes suivantes
    const authHeaders = {
      ...BRING_HEADERS,
      "Authorization": `Bearer ${accessToken}`,
    };

    // ÉTAPE 2 — Récupérer la liste (utilise la liste par défaut de l'utilisateur)
    let listUuid = bringListUuid;
    try {
      const listsRes = await fetch(`${BRING_API}/bringusers/${loginData.uuid}/lists`, {
        headers: authHeaders,
      });
      if (listsRes.ok) {
        const listsData = await listsRes.json();
        if (listsData.lists && listsData.lists.length > 0) {
          listUuid = listsData.lists[0].listUuid;
        }
      }
    } catch (e) { /* on garde la liste par défaut */ }

    // ÉTAPE 3 — Ajouter chaque article
    let added = 0;
    for (const item of items) {
      // Séparer quantité et nom si possible (ex: "200 g Chorizo" -> name="Chorizo", spec="200 g")
      const name = String(item).trim();
      const addRes = await fetch(`${BRING_API}/bringlists/${listUuid}`, {
        method: "PUT",
        headers: {
          ...authHeaders,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ purchase: name }).toString(),
      });
      if (addRes.ok) added++;
    }

    res.status(200).json({ success: true, added, total: items.length });
  } catch (e) {
    res.status(500).json({ error: "Erreur lors de l'envoi vers Bring!", details: String(e) });
  }
}
