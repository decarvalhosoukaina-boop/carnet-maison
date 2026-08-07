import { useState, useEffect } from "react";

const SUPABASE_URL = "https://violasrrsvyqjfnqxvgh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpb2xhc3Jyc3Z5cWpmbnF4dmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjYzMzUsImV4cCI6MjA5OTI0MjMzNX0.sJJeFVPBKhGRessF1m-I_HN2SvwjD0BWcQ6srfixbRQ";

const db = {
  async get(table) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?order=created_at.asc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    return res.json();
  },
  async insert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async upsert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async update(table, id, data) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  async delete(table, id) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
  },
  async saveCurrentWeek(data) {
    await fetch(`${SUPABASE_URL}/rest/v1/current_week?id=eq.current`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, updated_at: new Date().toISOString() }),
    });
  },
  async loadCurrentWeek() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/current_week?id=eq.current`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    const data = await res.json();
    return data && data[0] ? data[0] : null;
  },
};

const COLORS = {
  ink: "#2b2622",
  inkSoft: "#5c5650",
  inkMuted: "#928c84",
  cream: "#faf8f4",
  card: "#ffffff",
  line: "#e8e3da",
  terracotta: "#b5562f",
  terracottaDark: "#8f4322",
  terracottaSoft: "#f3e3da",
  sage: "#6b7a5e",
  sageSoft: "#e9eee3",
  gold: "#b5872f",
  goldSoft: "#f3ecd9",
};

const INITIAL_RECIPES = [
  {
    id: 1, name: "Blanquette de poulet", subtitle: "Crémeuse, riz vapeur", category: "Poulet",
    servings: 2, prepTime: 15, cookTime: 30, temp: null,
    ingredients: [
      { name: "Poulet (blancs)", qty: 300, unit: "g" },
      { name: "Carottes", qty: 150, unit: "g" },
      { name: "Champignons", qty: 120, unit: "g" },
      { name: "Poireau", qty: 1, unit: "gros" },
      { name: "Gousse d'ail", qty: 1, unit: "" },
      { name: "Beurre", qty: 15, unit: "g" },
      { name: "Bouillon", qty: 1, unit: "L" },
      { name: "Bouquet garni", qty: 1, unit: "" },
      { name: "Maïzena", qty: 3, unit: "cas" },
      { name: "Eau", qty: 10, unit: "cl" },
      { name: "Crème", qty: 120, unit: "g" },
      { name: "Riz", qty: 200, unit: "g" },
      { name: "Persil", qty: 1, unit: "poignée" },
    ],
    prep: [
      { ingredient: "Carottes", action: "éplucher et émincer" },
      { ingredient: "Poireau", action: "émincer finement" },
      { ingredient: "Champignons", action: "émincer" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Persil", action: "ciseler" },
      { ingredient: "Poulet — blancs / filets", action: "couper en morceaux" },
      { ingredient: "Riz", action: "peser et réserver" },
    ],
    assembly: [
      "Faire dorer le poulet coupé à la poêle dans un filet d'huile, réserver",
      "Dans la même poêle, faire revenir carottes, poireau, champignons et ail émincés (7-8 min)",
      "Ajouter le bouquet garni, verser le bouillon et le mélange maïzena/eau, couvrir 15 min",
      "En parallèle — cuire le riz dans de l'eau bouillante salée 18 min, feu doux couvercle fermé",
      "Ajouter la crème, le poulet réservé et le persil ciselé en fin de cuisson",
      "Servir la blanquette sur le riz",
    ],
    steps: [
      "Faire dorer les blancs de poulet à la poêle dans un filet d'huile, couper en morceaux et réserver",
      "Émincer finement tous les légumes, les faire revenir dans la même poêle avec le beurre et l'ail (7-8 min)",
      "Ajouter le bouquet garni, verser le bouillon et le mélange maïzena/eau",
      "Bien mélanger, couvrir et cuire 15 min à feu doux",
      "Pendant ce temps, cuire le riz dans de l'eau bouillante salée (18 min)",
      "En fin de cuisson, ajouter la crème, le poulet et le persil ciselé",
      "Servir la blanquette sur le riz",
    ],
    cookMethod: "feux",
  },
  {
    id: 2, name: "Polpette de Cyril Lignac", subtitle: "Boulettes, sauce tomate, burrata", category: "Boeuf",
    servings: 4, prepTime: 25, cookTime: 35, temp: null,
    ingredients: [
      { name: "Bœuf haché", qty: 300, unit: "g" },
      { name: "Porc haché", qty: 300, unit: "g" },
      { name: "Ricotta", qty: 100, unit: "g" },
      { name: "Parmesan râpé", qty: 30, unit: "g" },
      { name: "Œufs", qty: 2, unit: "" },
      { name: "Mie de pain trempée dans du lait", qty: 100, unit: "g" },
      { name: "Persil haché", qty: 2, unit: "cas" },
      { name: "Farine", qty: 50, unit: "g" },
      { name: "Pulpe de tomates", qty: 800, unit: "g" },
      { name: "Oignon", qty: 1, unit: "" },
      { name: "Gousse d'ail", qty: 1, unit: "" },
      { name: "Basilic frais", qty: 1, unit: "demi-botte" },
      { name: "Thym", qty: 1, unit: "branche" },
      { name: "Penne", qty: 240, unit: "g" },
      { name: "Burrata", qty: 2, unit: "boules 125g" },
      { name: "Huile d'olive", qty: 3, unit: "cas" },
      { name: "Piment d'Espelette", qty: 1, unit: "pincée" },
    ],
    prep: [
      { ingredient: "Oignons", action: "émincer" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Persil", action: "ciseler" },
    ],
    assembly: [
      "Mélanger viandes, ricotta, parmesan, œufs et persil haché, former les boulettes",
      "Faire dorer les boulettes à la poêle, réserver",
      "Faire revenir l'oignon et l'ail émincés, ajouter la pulpe de tomates, mijoter 20 min",
      "Remettre les boulettes dans la sauce, finir la cuisson 10 min",
    ],
    steps: [
      "Faire tremper la mie de pain dans du lait, puis presser pour enlever l'excédent",
      "Mélanger bœuf, porc, ricotta, parmesan, œufs, persil et mie de pain. Saler, poivrer",
      "Former des boulettes en se farinant les mains, les rouler dans la farine",
      "Faire dorer les boulettes dans l'huile d'olive (bien dorées mais pas cuites à cœur), réserver",
      "Faire revenir l'oignon émincé et l'ail dans la même poêle",
      "Ajouter la pulpe de tomates, thym et basilic. Saler, poivrer, mijoter 20 min",
      "Plonger les boulettes dans la sauce et finir la cuisson 10 min à feu doux",
      "Cuire les penne al dente, les enrober de sauce tomate",
      "Servir pâtes + boulettes, déposer la burrata, piment d'Espelette et filet d'huile d'olive",
    ],
    cookMethod: "feux",
  },
  {
    id: 3, name: "Bœuf Bourguignon d'Etchebest", subtitle: "Mijoté, myrtilles, groseille", category: "Boeuf",
    servings: 6, prepTime: 30, cookTime: 145, temp: 200,
    ingredients: [
      { name: "Paleron de bœuf", qty: 1500, unit: "g" },
      { name: "Lardons", qty: 150, unit: "g" },
      { name: "Vin rouge Bourgogne", qty: 1200, unit: "ml" },
      { name: "Fond de bœuf", qty: 1000, unit: "ml" },
      { name: "Carottes", qty: 4, unit: "" },
      { name: "Oignons", qty: 2, unit: "" },
      { name: "Gousses d'ail", qty: 4, unit: "" },
      { name: "Blanc de poireau", qty: 1, unit: "" },
      { name: "Thym frais", qty: 3, unit: "branches" },
      { name: "Laurier", qty: 3, unit: "feuilles" },
      { name: "Farine", qty: 30, unit: "g" },
      { name: "Beurre", qty: 60, unit: "g" },
      { name: "Myrtilles ou mûres fraîches", qty: 2, unit: "cas" },
      { name: "Gelée de groseille", qty: 1, unit: "cac" },
      { name: "Sucre", qty: 1, unit: "cac" },
      { name: "Huile de tournesol", qty: 3, unit: "cas" },
    ],
    prep: [
      { ingredient: "Paleron de bœuf", action: "couper en cubes de 60g" },
      { ingredient: "Carottes", action: "éplucher et tailler en biseaux" },
      { ingredient: "Oignons", action: "hacher" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Poireau", action: "couper" },
      { ingredient: "Thym", action: "réserver en branches pour le bouquet garni" },
    ],
    assembly: [
      "Mariner le bœuf coupé avec carottes, oignons, ail, poireau, bouquet garni et vin rouge — minimum 1h30",
      "Égoutter la viande, faire dorer les lardons puis le bœuf à la cocotte",
      "Saupoudrer de farine, enfourner 10 min à 200°C pour torréfier",
      "Remettre la marinade avec les légumes et les lardons, mijoter à couvert 1h45",
    ],
    steps: [
      "Couper le bœuf en cubes de 60g. Tailler carottes en biseaux, hacher oignons et ail, couper le poireau",
      "Préparer le bouquet garni avec thym et laurier dans la feuille de poireau",
      "Mariner la viande avec légumes, bouquet garni, 80cl de vin rouge et fond de bœuf — au moins 1h30 au frigo",
      "Égoutter la viande en conservant la marinade",
      "Faire dorer les lardons à la cocotte, réserver. Faire dorer les cubes de bœuf dans la même cocotte",
      "Saupoudrer de farine, bien enrober et enfourner 10 min à 200°C pour torréfier la farine",
      "Sortir du four, ajouter la marinade avec tous les légumes, remettre les lardons",
      "Mijoter à feu doux à couvert minimum 1h45 — la viande doit être fondante",
      "Retirer viande et garniture. Verser le jus dans une casserole, ajouter le reste du vin et le sucre",
      "Réduire à feu vif jusqu'à consistance sirupeuse, monter au beurre en fouettant",
      "Ajouter gelée de groseille et myrtilles/mûres. Rectifier l'assaisonnement",
      "Servir la viande nappée de sauce dans des assiettes creuses chaudes",
    ],
    cookMethod: "four",
  },
  {
    id: 4, name: "Shawarma Poulet", subtitle: "Mariné, grillé, pain pita", category: "Poulet",
    servings: 4, prepTime: 20, cookTime: 20, temp: 220,
    sauceBlanche: true,
    marinadeNote: "Idéalement mariné la veille — peut aussi mariner et cuire le jour même si besoin",
    ingredients: [
      { name: "Cuisses de poulet avec peau, coupées en petits morceaux", qty: 700, unit: "g" },
      { name: "Huile d'olive", qty: 4, unit: "cas" },
      { name: "Jus de citron (marinade)", qty: 2, unit: "citrons" },
      { name: "Gousses d'ail écrasées", qty: 5, unit: "" },
      { name: "Cumin", qty: 1, unit: "cac" },
      { name: "Paprika fumé", qty: 1, unit: "cac" },
      { name: "Coriandre moulue", qty: 1, unit: "cac" },
      { name: "Cannelle", qty: 0.5, unit: "cac" },
      { name: "Cardamome", qty: 0.5, unit: "cac" },
      { name: "Sumac", qty: 0.5, unit: "cac" },
      { name: "Piment rouge", qty: 0.25, unit: "cac" },
      { name: "Pain pita", qty: 4, unit: "" },
      { name: "Tomates", qty: 2, unit: "" },
      { name: "Oignon rouge", qty: 1, unit: "" },
      { name: "Cornichons", qty: 1, unit: "poignée" },
      { name: "Menthe fraîche", qty: 1, unit: "poignée" },
    ],
    prep: [
      { ingredient: "Poulet — cuisses", action: "couper en petits morceaux, peau vers l'extérieur" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Citron", action: "presser" },
      { ingredient: "Tomates", action: "couper en dés" },
      { ingredient: "Oignon rouge", action: "émincer" },
    ],
    assembly: [
      "Mélanger le poulet coupé avec l'huile, le citron pressé, l'ail écrasé et toutes les épices",
      "Bien enrober, filmer, laisser mariner (une nuit ou au moins 30 min si fait le jour même)",
      "Disposer les morceaux marinés sur grille, peau vers le haut, plat en dessous pour récupérer les jus",
    ],
    sauceIngredients: [
      { name: "Yaourt grec", qty: 200, unit: "g" },
      { name: "Gousse d'ail râpée", qty: 1, unit: "" },
      { name: "Jus de citron (sauce)", qty: 0.5, unit: "citron" },
      { name: "Échalote ciselée", qty: 1, unit: "" },
      { name: "Ciboulette ciselée", qty: 1, unit: "cas" },
    ],
    steps: [
      "La veille — couper les cuisses en petits morceaux (3-4 cm), peau vers l'extérieur",
      "Mélanger avec l'huile, le jus de citron, l'ail et toutes les épices. Bien enrober, filmer, laisser une nuit au frigo",
      "Le jour J — sortir le poulet 30 min avant cuisson",
      "Disposer les morceaux sur grille, peau vers le haut, avec un plat en dessous pour récupérer les jus",
      "Grill à 220°C pendant 20 min, retourner à mi-cuisson en arrosant avec les jus",
      "Les 3 dernières minutes, monter à 240°C pour que la peau soit bien croustillante",
      "Laisser reposer 5 min. Toaster les pitas",
      "Garnir les pitas de poulet, sauce blanche, tomates, oignon rouge, cornichons et menthe",
    ],
    cookMethod: "four",
  },
  {
    id: 5, name: "Poulet et carottes rôtis, érable-moutarde", subtitle: "Marinade miel, sirop d'érable", category: "Poulet",
    servings: 4, prepTime: 15, cookTime: 30, temp: 200,
    ingredients: [
      { name: "Filets de poulet", qty: 800, unit: "g" },
      { name: "Carottes, pelées et coupées en bâtonnets", qty: 500, unit: "g" },
      { name: "Moutarde à l'ancienne", qty: 3, unit: "cas" },
      { name: "Sirop d'érable", qty: 2, unit: "cas" },
      { name: "Huile d'olive", qty: 2, unit: "cas" },
      { name: "Jus de citron", qty: 2, unit: "cas" },
      { name: "Gousses d'ail écrasées", qty: 3, unit: "" },
      { name: "Paprika fumé", qty: 1, unit: "cac" },
      { name: "Sel", qty: 1, unit: "cac" },
      { name: "Poivre noir", qty: 0.5, unit: "cac" },
      { name: "Herbes de Provence", qty: 1, unit: "cac" },
      { name: "Eau", qty: 3, unit: "cas" },
    ],
    prep: [
      { ingredient: "Carottes", action: "éplucher et couper en bâtonnets" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Citron", action: "presser" },
    ],
    assembly: [
      "Fouetter moutarde, sirop d'érable, huile, citron pressé, ail écrasé et épices pour la marinade",
      "Enrober le poulet et les carottes en bâtonnets avec la marinade, laisser reposer si possible",
      "Disposer poulet et carottes dans le plat, carottes réparties autour, verser le reste de marinade",
    ],
    steps: [
      "Préparer la marinade : mélanger moutarde, sirop d'érable, huile d'olive, jus de citron, ail, paprika fumé, sel, poivre, herbes de Provence et eau. Bien fouetter jusqu'à obtenir une sauce homogène",
      "Placer le poulet et les carottes dans un plat ou un sac de congélation, verser la marinade et bien enrober. Laisser mariner au réfrigérateur (idéalement la veille)",
      "Préchauffer le four à 200°C chaleur tournante. Sortir le plat 10 min avant la cuisson",
      "Disposer les filets et les carottes dans un plat allant au four, carottes bien réparties autour du poulet, verser le reste de la marinade par-dessus",
      "Enfourner à 200°C",
      "Passer en mode gril les 3-4 dernières minutes pour bien caraméliser poulet et carottes",
      "Vérifier la cuisson du poulet (jus clair) et que les carottes sont tendres. Servir aussitôt",
    ],
    notes: [
      "Batch cooking — la marinade se prépare la veille. Se conserve 3 jours au frigo, se réchauffe très bien.",
      "Astuce carottes — les couper en bâtonnets de taille régulière pour une cuisson homogène, et bien les enrober de marinade pour qu'elles caramélisent.",
      "Variante épicée — ajouter ½ c. à café de piment de Cayenne dans la marinade.",
      "Option Thermomix — émulsionner tous les ingrédients de la marinade 10 sec / vitesse 4.",
    ],
    cookMethod: "four",
  },
  {
    id: 6, name: "Lasagnes Bolognaise", subtitle: "Crème fraîche, légumes cachés", category: "Boeuf",
    servings: 5, prepTime: 25, cookTime: 45, temp: 190,
    ingredients: [
      { name: "Viande hachée (bœuf ou mixte)", qty: 600, unit: "g" },
      { name: "Oignon finement haché", qty: 1, unit: "" },
      { name: "Gousses d'ail", qty: 2, unit: "" },
      { name: "Carottes râpées finement", qty: 2, unit: "" },
      { name: "Courgette râpée bien essorée", qty: 1, unit: "" },
      { name: "Tomates concassées en boîte", qty: 400, unit: "g" },
      { name: "Concentré de tomates", qty: 2, unit: "cas" },
      { name: "Origan séché", qty: 1, unit: "cac" },
      { name: "Crème fraîche épaisse entière", qty: 450, unit: "ml" },
      { name: "Muscade", qty: 1, unit: "pincée" },
      { name: "Feuilles de lasagne sèches", qty: 13, unit: "" },
      { name: "Gruyère ou mozzarella râpé", qty: 100, unit: "g" },
      { name: "Parmesan râpé", qty: 1, unit: "poignée" },
    ],
    prep: [
      { ingredient: "Oignons", action: "écraser" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Carottes", action: "râper finement" },
      { ingredient: "Courgette", action: "râper et bien essorer" },
    ],
    assembly: [
      "Faire revenir l'oignon et l'ail dans l'huile d'olive 3 min",
      "Ajouter la viande hachée, faire dorer en formant de petits morceaux — ne pas écraser",
      "Incorporer carottes et courgette râpées, faire revenir 3 min",
      "Ajouter tomates, concentré, origan, sel et poivre — mijoter 20 min à feu doux",
      "Mélanger la crème fraîche avec la muscade et le sel dans un bol",
      "Préchauffer le four à 190°C",
      "Montage dans le plat : crème → feuilles → bolognaise → crème → fromage, répéter 3 fois, finir par crème + fromage",
      "Enfourner 45 min — couvrir les 25 premières min, puis gratiner à découvert",
      "Laisser reposer 10 min avant de servir",
    ],
    steps: [
      "Faire revenir l'oignon et l'ail dans l'huile d'olive 3 min",
      "Ajouter la viande, faire dorer en formant de petits morceaux — ne pas écraser",
      "Incorporer carottes et courgette râpées, faire revenir 3 min",
      "Ajouter tomates, concentré, origan, sel et poivre. Mijoter 20 min à feu doux",
      "Mélanger la crème fraîche avec la muscade et le sel dans un bol",
      "Préchauffer le four à 190°C",
      "Montage : crème → feuilles → bolognaise → crème → fromage. Répéter 3 fois. Finir par crème + fromage",
      "Enfourner 45 min (couvrir les 25 premières min, puis gratiner à découvert)",
      "Laisser reposer 10 min avant de servir",
    ],
    notes: [
      "Batch cooking — se conserve crue au frigo 24h, ou cuite au congélateur.",
      "Réchauffage — 160°C pendant 20 min le soir J.",
      "Les légumes râpés disparaissent complètement dans la sauce — idéal pour les enfants.",
    ],
    cookMethod: "four",
  },
  {
    id: 7, name: "Poulet moutarde, patates au four", subtitle: "Cuisses dorées, pommes de terre entières", category: "Poulet",
    servings: 3, prepTime: 10, cookTime: 55, temp: 180,
    ingredients: [
      { name: "Cuisses de poulet", qty: 4, unit: "" },
      { name: "Moutarde", qty: 2, unit: "cas" },
      { name: "Maggi liquide", qty: 2, unit: "cas" },
      { name: "Gousses d'ail écrasées", qty: 3, unit: "" },
      { name: "Herbes de Provence", qty: 1, unit: "cas" },
      { name: "Petites pommes de terre entières", qty: 600, unit: "g" },
      { name: "Eau", qty: 100, unit: "ml" },
    ],
    prep: [
      { ingredient: "Poulet — cuisses", action: "disposer dans le plat" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Petites pommes de terre entières", action: "laver et disposer entières autour du poulet" },
    ],
    assembly: [
      "Préchauffer le four à 180°C chaleur tournante",
      "Disposer les cuisses dans le plat, enduire généreusement de moutarde",
      "Ajouter l'ail écrasé, les herbes de Provence, sel, poivre et le Maggi",
      "Répartir les petites pommes de terre entières autour du poulet",
      "Verser l'eau dans le fond du plat",
      "Couvrir de papier alu et enfourner 30 min",
      "Retirer l'alu et laisser gratiner 25 min supplémentaires pour bien dorer",
    ],
    steps: [
      "Préchauffer le four à 180°C chaleur tournante",
      "Disposer les cuisses dans le plat, enduire généreusement de moutarde",
      "Ajouter l'ail écrasé, les herbes de Provence, sel, poivre et le Maggi",
      "Répartir les petites pommes de terre entières autour du poulet",
      "Verser l'eau dans le fond du plat",
      "Couvrir de papier alu et enfourner 30 min",
      "Retirer l'alu et laisser gratiner 25 min supplémentaires pour bien dorer",
    ],
    cookMethod: "four",
  },
  {
    id: 8, name: "Hachis Parmentier — croûte crumble", subtitle: "Bœuf mijoté, crumble de patates au persil", category: "Boeuf",
    servings: 5, prepTime: 20, cookTime: 40, temp: 200,
    ingredients: [
      { name: "Bœuf haché", qty: 600, unit: "g" },
      { name: "Oignon haché", qty: 1, unit: "" },
      { name: "Gousses d'ail écrasées", qty: 2, unit: "" },
      { name: "Carottes râpées finement", qty: 2, unit: "" },
      { name: "Tomates concassées en boîte", qty: 400, unit: "g" },
      { name: "Concentré de tomates", qty: 1, unit: "cas" },
      { name: "Thym", qty: 2, unit: "branches" },
      { name: "Laurier", qty: 1, unit: "feuille" },
      { name: "Pommes de terre (Bintje ou Mona Lisa)", qty: 1000, unit: "g" },
      { name: "Beurre", qty: 60, unit: "g" },
      { name: "Persil ciselé", qty: 1, unit: "poignée" },
      { name: "Gruyère râpé", qty: 80, unit: "g" },
      { name: "Muscade", qty: 1, unit: "pincée" },
    ],
    prep: [
      { ingredient: "Oignons", action: "écraser" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Carottes", action: "râper finement" },
      { ingredient: "Persil", action: "ciseler" },
      { ingredient: "Pommes de terre", action: "éplucher et cuire à l'eau bouillante salée 20 min" },
    ],
    assembly: [
      "Faire revenir l'oignon et l'ail 3 min dans un filet d'huile",
      "Ajouter le bœuf haché, faire dorer en cassant les morceaux",
      "Incorporer les carottes râpées, tomates concassées, concentré, thym et laurier — mijoter 20 min",
      "Égoutter les pommes de terre cuites, écraser grossièrement à la fourchette avec le beurre, le persil ciselé, sel et muscade — garder des morceaux irréguliers",
      "Étaler la viande dans le plat, recouvrir du crumble de pommes de terre, parsemer de gruyère",
      "Enfourner à 200°C pendant 20 min jusqu'à croûte bien dorée et croustillante",
    ],
    steps: [
      "Faire revenir l'oignon et l'ail 3 min dans un filet d'huile",
      "Ajouter le bœuf haché, faire dorer en cassant les morceaux",
      "Incorporer les carottes râpées, tomates concassées, concentré, thym et laurier — mijoter 20 min",
      "En parallèle, cuire les pommes de terre épluchées à l'eau bouillante salée 20 min",
      "Égoutter, écraser grossièrement à la fourchette avec beurre, persil ciselé, sel et muscade — garder des morceaux irréguliers",
      "Étaler la viande dans le plat, recouvrir du crumble de pommes de terre, parsemer de gruyère",
      "Four à 200°C — 20 min jusqu'à croûte bien dorée et croustillante",
    ],
    notes: [
      "Le crumble — écraser à la fourchette sans lisser, les morceaux irréguliers donnent la texture croustillante recherchée.",
      "Batch cooking — se congèle très bien avant ou après cuisson. Réchauffer à 160°C pendant 20 min.",
    ],
    cookMethod: "four",
  },
  ,
  {
    id: 10, name: "Poulet curry lait de coco & citronnelle", subtitle: "Safran, badiane, nuoc-mâm", category: "Poulet",
    servings: 4, prepTime: 15, cookTime: 25, temp: null,
    ingredients: [
      { name: "Blancs de poulet coupés en gros cubes", qty: 600, unit: "g" },
      { name: "Oignon émincé", qty: 1, unit: "" },
      { name: "Gousses d'ail", qty: 2, unit: "" },
      { name: "Gingembre frais râpé", qty: 1, unit: "noix" },
      { name: "Tiges de citronnelle émincées finement", qty: 2, unit: "" },
      { name: "Lait de coco", qty: 200, unit: "ml" },
      { name: "Curry en poudre", qty: 2, unit: "cas" },
      { name: "Curcuma", qty: 1, unit: "cac" },
      { name: "Badiane (anis étoilé)", qty: 2, unit: "" },
      { name: "Safran", qty: 1, unit: "pincée" },
      { name: "Sucre de canne", qty: 1, unit: "pincée" },
      { name: "Piment", qty: 1, unit: "pointe" },
      { name: "Fond de volaille en poudre", qty: 1, unit: "cac" },
      { name: "Nuoc-mâm", qty: 1, unit: "cas" },
      { name: "Coriandre fraîche", qty: 1, unit: "poignée" },
      { name: "Riz basmati", qty: 300, unit: "g" },
    ],
    prep: [
      { ingredient: "Oignons", action: "émincer" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Gingembre frais râpé", action: "râper" },
      { ingredient: "Citronnelle", action: "émincer très finement la partie blanche" },
      { ingredient: "Poulet — blancs / filets", action: "couper en gros cubes" },
      { ingredient: "Coriandre fraîche", action: "ciseler" },
      { ingredient: "Riz basmati", action: "rincer" },
    ],
    assembly: [
      "Faire sauter l'oignon, l'ail, le gingembre et la citronnelle 3 min à feu moyen",
      "Ajouter le poulet en gros cubes, dorer sur toutes les faces — réserver",
      "Déglacer avec le lait de coco, ajouter curry, curcuma, badiane, safran, sucre, piment et fond de volaille",
      "Remettre le poulet, mijoter 15-20 min à feu doux sans couvrir pour que la sauce réduise et nappe",
      "Assaisonner au nuoc-mâm en fin de cuisson (à la place du sel — bien plus complexe)",
      "En parallèle — cuire le riz basmati 12 min",
      "Servir sur riz basmati, parsemer de coriandre fraîche",
    ],
    steps: [
      "Faire sauter l'oignon, l'ail, le gingembre et la citronnelle 3 min à feu moyen",
      "Ajouter le poulet en gros cubes, dorer sur toutes les faces — réserver",
      "Déglacer avec le lait de coco, ajouter curry, curcuma, badiane, safran, sucre, piment et fond de volaille",
      "Remettre le poulet, mijoter 15-20 min à feu doux",
      "Assaisonner au nuoc-mâm en fin de cuisson",
      "Servir sur riz basmati avec coriandre fraîche",
    ],
    notes: [
      "La badiane — donne une profondeur aromatique inattendue, ne pas zapper.",
      "Le nuoc-mâm remplace le sel de façon bien plus complexe — commencer par 1 cas et goûter.",
      "Encore meilleur réchauffé le lendemain — les saveurs se développent.",
    ],
    cookMethod: "feux",
  },
  {
    id: 11, name: "Tagine de poulet au citron confit", subtitle: "Mixé d'aromates, olives, petites patates", category: "Poulet",
    servings: 4, prepTime: 15, cookTime: 45, temp: null,
    ingredients: [
      { name: "Cuisses de poulet", qty: 4, unit: "" },
      { name: "Citron confit", qty: 1, unit: "" },
      { name: "Jus de citron", qty: 1, unit: "citron" },
      { name: "Olives vertes dénoyautées", qty: 100, unit: "g" },
      { name: "Petites pommes de terre entières", qty: 600, unit: "g" },
      { name: "Oignon", qty: 1, unit: "" },
      { name: "Gousses d'ail", qty: 4, unit: "" },
      { name: "Gingembre frais", qty: 1, unit: "cac" },
      { name: "Curcuma", qty: 1, unit: "cac" },
      { name: "Coriandre fraîche", qty: 1, unit: "poignée" },
    ],
    prep: [
      { ingredient: "Oignons", action: "mixer avec ail, gingembre et curcuma en pâte lisse" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Petites pommes de terre entières", action: "laver et garder entières" },
      { ingredient: "Citron confit", action: "couper en quartiers" },
      { ingredient: "Coriandre fraîche", action: "ciseler" },
      { ingredient: "Poulet — cuisses", action: "garder entières" },
    ],
    assembly: [
      "Mixer ensemble oignon, ail, gingembre et curcuma jusqu'à obtenir une pâte lisse",
      "Faire chauffer l'huile dans une cocotte, ajouter la pâte mixée et faire revenir 3-4 min",
      "Ajouter les cuisses de poulet, faire dorer sur toutes les faces",
      "Verser l'eau et le jus de citron",
      "Ajouter les petites pommes de terre entières, le citron confit en quartiers et les olives",
      "Couvrir et mijoter 40 min à feu doux — les patates doivent être fondantes",
      "Parsemer de coriandre fraîche avant de servir",
    ],
    steps: [
      "Mixer ensemble oignon, ail, gingembre et curcuma jusqu'à obtenir une pâte lisse",
      "Faire chauffer l'huile dans une cocotte, ajouter la pâte mixée et faire revenir 3-4 min",
      "Ajouter les cuisses de poulet, faire dorer sur toutes les faces",
      "Verser l'eau et le jus de citron",
      "Ajouter les petites pommes de terre entières, le citron confit en quartiers et les olives",
      "Couvrir et mijoter 40 min à feu doux",
      "Parsemer de coriandre fraîche avant de servir",
    ],
    notes: [
      "Le mixé d'aromates — plus tu le fais revenir longtemps (5-6 min), plus les saveurs se développent.",
      "Batch cooking — encore meilleur le lendemain. Se congèle très bien.",
      "Variante — ajouter une poignée de raisins secs pour une touche sucrée-salée typiquement marocaine.",
    ],
    cookMethod: "feux",
  },
  {
    id: 13, name: "Poitrine de porc BBQ moutarde-soja-miel", subtitle: "Marinade sucrée-salée, grillée au BBQ", category: "Porc",
    servings: 4, prepTime: 10, cookTime: 10, temp: null,
    marinadeNote: "Idéalement marinée toute la nuit — minimum 2h si fait le jour même",
    ingredients: [
      { name: "Poitrine de porc en tranches", qty: 800, unit: "g" },
      { name: "Sauce soja", qty: 4, unit: "cas" },
      { name: "Miel liquide", qty: 3, unit: "cas" },
      { name: "Moutarde de Dijon", qty: 2, unit: "cas" },
      { name: "Gousses d'ail écrasées", qty: 2, unit: "" },
      { name: "Huile d'olive", qty: 2, unit: "cas" },
      { name: "Vinaigre de cidre", qty: 1, unit: "cas" },
      { name: "Gingembre frais râpé", qty: 1, unit: "cac" },
      { name: "Poivre noir moulu", qty: 1, unit: "pincée" },
    ],
    prep: [
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Gingembre frais râpé", action: "râper" },
      { ingredient: "Poitrine de porc en tranches", action: "enrober avec la marinade et masser sur toutes les faces" },
    ],
    assembly: [
      "Mélanger sauce soja, miel, moutarde, ail, huile d'olive, vinaigre de cidre, gingembre et poivre jusqu'à sauce homogène",
      "Enrober les tranches de porc avec la marinade dans un plat ou sac zippé — bien masser",
      "Laisser mariner au frigo toute la nuit (minimum 2h)",
      "Sortir la viande 15-20 min avant cuisson pour tempérer",
      "Préchauffer le BBQ à feu moyen-vif",
      "Griller 3-4 min par face — surveiller car le miel caramélise vite, badigeonner avec le reste de marinade en cours de cuisson",
      "Laisser reposer 2-3 min avant de servir",
    ],
    steps: [
      "Mélanger sauce soja, miel, moutarde, ail, huile, vinaigre de cidre, gingembre et poivre jusqu'à sauce homogène",
      "Enrober les tranches de porc avec la marinade — bien masser sur toutes les faces",
      "Laisser mariner au frigo toute la nuit (minimum 2h)",
      "Sortir la viande 15-20 min avant cuisson pour tempérer",
      "Préchauffer le BBQ à feu moyen-vif",
      "Griller 3-4 min par face en surveillant la caramélisation du miel",
      "Badigeonner avec le reste de marinade en cours de cuisson si besoin",
      "Laisser reposer 2-3 min avant de servir",
    ],
    notes: [
      "Le miel caramélise vite — feu moyen plutôt que trop vif pour éviter que ça brûle.",
      "Sans allergie — cette recette ne contient pas de fruits de mer, parfaite pour toute la famille.",
    ],
    cookMethod: "feux",
  },
  {
    id: 14, name: "Poulet au curry, carottes & brocoli", subtitle: "Lait de coco, légumes fondants", category: "Poulet",
    servings: 3, prepTime: 15, cookTime: 30, temp: null,
    ingredients: [
      { name: "Blancs de poulet coupés en morceaux", qty: 500, unit: "g" },
      { name: "Carottes", qty: 2, unit: "" },
      { name: "Brocoli en fleurettes", qty: 200, unit: "g" },
      { name: "Oignon émincé", qty: 1, unit: "" },
      { name: "Gousses d'ail écrasées", qty: 2, unit: "" },
      { name: "Gingembre frais râpé", qty: 1, unit: "cac" },
      { name: "Pâte de curry jaune", qty: 2, unit: "cas" },
      { name: "Lait de coco", qty: 400, unit: "ml" },
      { name: "Tomates concassées", qty: 200, unit: "g" },
      { name: "Sauce soja", qty: 1, unit: "cas" },
      { name: "Jus de citron vert", qty: 0.5, unit: "citron" },
      { name: "Coriandre fraîche", qty: 1, unit: "poignée" },
      { name: "Riz basmati", qty: 250, unit: "g" },
    ],
    prep: [
      { ingredient: "Poulet — blancs / filets", action: "couper en morceaux" },
      { ingredient: "Carottes", action: "éplucher et couper en rondelles" },
      { ingredient: "Brocoli en fleurettes", action: "détailler en fleurettes" },
      { ingredient: "Oignons", action: "émincer" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Gingembre frais râpé", action: "râper" },
      { ingredient: "Coriandre fraîche", action: "ciseler" },
      { ingredient: "Riz basmati", action: "rincer" },
    ],
    assembly: [
      "Faire revenir l'oignon dans l'huile 3-4 min jusqu'à doré",
      "Ajouter ail et gingembre, faire revenir 1 min",
      "Ajouter la pâte de curry, torréfier 1 min en remuant",
      "Ajouter le poulet, faire dorer 5 min sur toutes les faces",
      "Ajouter les carottes en rondelles, verser le lait de coco et les tomates",
      "Mijoter 15 min à feu doux",
      "Ajouter le brocoli, poursuivre 8-10 min — rester légèrement croquant",
      "Terminer avec sauce soja et jus de citron vert",
      "En parallèle — cuire le riz basmati 12 min",
      "Servir sur riz avec coriandre fraîche",
    ],
    steps: [
      "Faire revenir l'oignon dans l'huile 3-4 min jusqu'à doré",
      "Ajouter ail et gingembre, faire revenir 1 min",
      "Ajouter la pâte de curry, torréfier 1 min en remuant",
      "Ajouter le poulet, faire dorer 5 min sur toutes les faces",
      "Ajouter les carottes, verser le lait de coco et les tomates concassées",
      "Mijoter 15 min à feu doux",
      "Ajouter le brocoli, poursuivre 8-10 min",
      "Terminer avec sauce soja et jus de citron vert",
      "Servir sur riz basmati avec coriandre fraîche",
    ],
    cookMethod: "feux",
  },
  {
    id: 15, name: "Riz cantonais aux restes", subtitle: "Riz de la veille, jambon, petits pois, carottes", category: "Restes",
    resteTags: ["riz"],
    servings: 4, prepTime: 10, cookTime: 15, temp: null,
    ingredients: [
      { name: "Riz long grain cuit la veille (froid)", qty: 300, unit: "g" },
      { name: "Œufs", qty: 3, unit: "" },
      { name: "Jambon blanc en dés", qty: 150, unit: "g" },
      { name: "Petits pois surgelés", qty: 150, unit: "g" },
      { name: "Carottes en petits dés", qty: 1, unit: "" },
      { name: "Oignon finement émincé", qty: 1, unit: "" },
      { name: "Gousses d'ail hachées", qty: 2, unit: "" },
      { name: "Sauce soja", qty: 2, unit: "cas" },
      { name: "Huile neutre tournesol ou arachide", qty: 3, unit: "cas" },
      { name: "Huile de sésame grillé", qty: 1, unit: "cac" },
      { name: "Poivre", qty: 0.25, unit: "cac" },
    ],
    prep: [
      { ingredient: "Carottes", action: "couper en tout petits dés" },
      { ingredient: "Oignons", action: "émincer finement" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Jambon blanc en dés", action: "couper en dés" },
    ],
    assembly: [
      "Sortir le riz du frigo bien froid et sec — c'est le secret pour qu'il ne colle pas",
      "Chauffer le wok à feu très vif jusqu'à ce qu'il fume — ne pas précipiter",
      "Ajouter l'huile neutre, faire sauter oignon et ail 2 min",
      "Ajouter les carottes en dés, faire sauter 3 min",
      "Ajouter les petits pois surgelés, faire sauter 2 min",
      "Pousser les légumes sur le côté, scrambler les œufs dans le wok puis mélanger avec les légumes",
      "Ajouter le riz froid, écraser les grains à la spatule, faire sauter à feu vif 3-4 min",
      "Ajouter le jambon, la sauce soja et le poivre — mélanger vivement",
      "Hors du feu, arroser d'huile de sésame",
    ],
    steps: [
      "Sortir le riz du frigo bien froid et sec",
      "Chauffer le wok à feu très vif jusqu'à ce qu'il fume",
      "Ajouter l'huile neutre, faire sauter oignon et ail 2 min",
      "Ajouter les carottes en dés, faire sauter 3 min",
      "Ajouter les petits pois surgelés, faire sauter 2 min",
      "Pousser les légumes sur le côté, scrambler les œufs puis mélanger avec les légumes",
      "Ajouter le riz froid, écraser les grains, faire sauter à feu vif 3-4 min",
      "Ajouter jambon, sauce soja et poivre — mélanger vivement",
      "Hors du feu, arroser d'huile de sésame",
    ],
    notes: [
      "Le secret — riz cuit la veille, bien froid et sec. Riz chaud = bouillie.",
      "Le wok doit fumer avant que le riz n'y touche — la chaleur fait tout.",
      "Variante restes — remplace le jambon par du poulet cuit, des crevettes ou du tofu.",
      "Sans jambon à la maison — fonctionne très bien avec juste les légumes et les œufs.",
    ],
    cookMethod: "feux",
  },
  {
    id: 16, name: "Quesadillas au poulet rôti", subtitle: "Restes de poulet, fromage fondu, poivron", category: "Restes",
    resteTags: ["poulet"],
    servings: 4, prepTime: 15, cookTime: 20, temp: null,
    ingredients: [
      { name: "Grandes tortillas de blé", qty: 8, unit: "" },
      { name: "Poulet rôti effiloché", qty: 350, unit: "g" },
      { name: "Fromage râpé mozzarella + cheddar ou gruyère", qty: 200, unit: "g" },
      { name: "Oignon émincé finement", qty: 1, unit: "" },
      { name: "Poivron rouge en petits dés", qty: 1, unit: "" },
      { name: "Crème fraîche épaisse", qty: 3, unit: "cas" },
      { name: "Paprika doux", qty: 1, unit: "cac" },
      { name: "Cumin moulu", qty: 0.5, unit: "cac" },
      { name: "Huile d'olive", qty: 1, unit: "cas" },
      { name: "Beurre pour la cuisson", qty: 20, unit: "g" },
    ],
    prep: [
      { ingredient: "Poulet — cuisses", action: "effilocher le poulet rôti froid" },
      { ingredient: "Oignons", action: "émincer finement" },
      { ingredient: "Poivron rouge en petits dés", action: "couper en petits dés" },
    ],
    assembly: [
      "Faire revenir oignon et poivron dans l'huile d'olive 5 min jusqu'à tendres",
      "Ajouter le poulet effiloché, paprika, cumin — mélanger et chauffer 2 min",
      "Hors du feu, incorporer la crème fraîche",
      "Poser une tortilla à plat — étaler une couche de fromage, puis la garniture poulet, puis une nouvelle couche de fromage — refermer avec une 2ème tortilla",
      "Chauffer une poêle avec un peu de beurre à feu moyen",
      "Cuire la quesadilla 2-3 min par face en appuyant bien avec la spatule — le fromage doit être fondu et la tortilla dorée",
      "Répéter pour les 4 quesadillas",
      "Couper en triangles et servir immédiatement",
    ],
    steps: [
      "Faire revenir oignon et poivron dans l'huile 5 min jusqu'à tendres",
      "Ajouter le poulet effiloché, paprika, cumin — chauffer 2 min",
      "Hors du feu, incorporer la crème fraîche",
      "Garnir les tortillas : fromage → garniture → fromage → tortilla par-dessus",
      "Cuire 2-3 min par face en appuyant bien à la spatule",
      "Couper en triangles et servir immédiatement",
    ],
    notes: [
      "Le secret — fromage des deux côtés de la garniture pour que rien ne s'échappe à la découpe.",
      "Bien tasser à la spatule pendant la cuisson pour une tortilla bien croustillante.",
      "Parfait avec des restes de poulet rôti, shawarma ou tikka masala.",
    ],
    cookMethod: "feux",
  },
  {
    id: 17, name: "Pâtes à la sauce grillade", subtitle: "Restes de viande grillée, sauce tomate maison", category: "Restes",
    resteTags: ["viande grillée"],
    servings: 4, prepTime: 10, cookTime: 20, temp: null,
    ingredients: [
      { name: "Restes de viande grillée émincée", qty: 300, unit: "g" },
      { name: "Pâtes (penne ou tagliatelles)", qty: 400, unit: "g" },
      { name: "Tomates concassées en boîte", qty: 400, unit: "g" },
      { name: "Oignon émincé", qty: 1, unit: "" },
      { name: "Gousses d'ail écrasées", qty: 2, unit: "" },
      { name: "Concentré de tomates", qty: 1, unit: "cas" },
      { name: "Basilic frais ou séché", qty: 1, unit: "poignée" },
      { name: "Origan séché", qty: 1, unit: "cac" },
      { name: "Parmesan râpé", qty: 40, unit: "g" },
    ],
    prep: [
      { ingredient: "Oignons", action: "émincer" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Viande grillée", action: "émincer finement ou effilocher" },
    ],
    assembly: [
      "Faire revenir l'oignon et l'ail dans l'huile d'olive 3 min",
      "Ajouter la viande grillée émincée, faire revenir 2 min pour la réchauffer",
      "Ajouter tomates concassées, concentré, origan, sel et poivre",
      "Mijoter 15 min à feu doux — la sauce doit épaissir et enrober la viande",
      "En parallèle — cuire les pâtes al dente",
      "Mélanger pâtes et sauce, parsemer de basilic frais et parmesan",
    ],
    steps: [
      "Faire revenir l'oignon et l'ail dans l'huile d'olive 3 min",
      "Ajouter la viande grillée émincée, faire revenir 2 min",
      "Ajouter tomates concassées, concentré, origan, sel et poivre",
      "Mijoter 15 min à feu doux",
      "Cuire les pâtes al dente en parallèle",
      "Mélanger pâtes et sauce, parsemer de basilic et parmesan",
    ],
    notes: [
      "Fonctionne avec n'importe quelle viande grillée — porc BBQ, bœuf, côtelettes.",
      "La viande émincée finement s'intègre mieux dans la sauce que coupée en gros morceaux.",
      "Un peu de vin rouge dans la sauce rehausse le goût de la viande grillée.",
    ],
    cookMethod: "feux",
  },
  ,
  {
    id: 18, name: "Nems façon Carole", subtitle: "Galettes de riz, viande hachée, légumes", category: "Boeuf",
    servings: 4, prepTime: 30, cookTime: 20, temp: null,
    ingredients: [
      { name: "Viande hachée", qty: 300, unit: "g" },
      { name: "Vermicelles chinois coupés", qty: 1, unit: "paquet" },
      { name: "Champignons noirs séchés réhydratés", qty: 4, unit: "" },
      { name: "Oignons verts émincés", qty: 3, unit: "" },
      { name: "Carottes râpées", qty: 2, unit: "" },
      { name: "Oignon haché", qty: 1, unit: "" },
      { name: "Persil ciselé", qty: 1, unit: "bouquet" },
      { name: "Ciboulette ciselée", qty: 1, unit: "bouquet" },
      { name: "Œuf", qty: 1, unit: "" },
      { name: "Sauce soja", qty: 2, unit: "cas" },
      { name: "Nuoc-mâm", qty: 2, unit: "cas" },
      { name: "Galettes de riz (feuilles)", qty: 20, unit: "" },
      { name: "Huile pour friture", qty: 1, unit: "L" },
    ],
    prep: [
      { ingredient: "Vermicelles chinois coupés", action: "réhydrater dans l'eau chaude 5 min puis couper en petits morceaux" },
      { ingredient: "Champignons noirs séchés réhydratés", action: "réhydrater dans l'eau tiède 20 min puis émincer finement" },
      { ingredient: "Carottes", action: "râper finement" },
      { ingredient: "Oignons", action: "hacher" },
      { ingredient: "Oignons verts émincés", action: "émincer" },
      { ingredient: "Persil", action: "ciseler" },
      { ingredient: "Ciboulette ciselée", action: "ciseler" },
    ],
    assembly: [
      "Mélanger viande hachée, vermicelles, champignons, carottes râpées, oignon, oignons verts, persil, ciboulette, œuf, sauce soja et nuoc-mâm",
      "Bien mélanger à la main — la farce doit être homogène",
      "Tremper une feuille de riz 10-15 secondes dans l'eau tiède jusqu'à souple",
      "Poser sur un torchon humide, déposer une cuillère de farce, replier les côtés et rouler bien serré",
      "Répéter pour toutes les feuilles",
      "Chauffer l'huile à 170°C — plonger les nems par petites quantités",
      "Frire 4-5 min en retournant jusqu'à dorés et croustillants — égoutter sur papier absorbant",
    ],
    steps: [
      "Réhydrater vermicelles et champignons noirs, couper finement",
      "Mélanger tous les ingrédients de la farce à la main",
      "Tremper les feuilles de riz une par une 10-15 sec dans l'eau tiède",
      "Garnir, replier les côtés et rouler bien serré",
      "Frire à 170°C par petites quantités — 4-5 min jusqu'à dorés",
      "Égoutter sur papier absorbant, servir aussitôt",
    ],
    notes: [
      "Batch cooking — les nems crus se congèlent très bien. Frire directement congelés, ajouter 2 min de cuisson.",
      "Bien serrer le roulage pour éviter que les nems ne s'ouvrent à la friture.",
      "Servir avec sauce nuoc-mâm citronnée et salade fraîche.",
    ],
    cookMethod: "feux",
  },
  {
    id: 19, name: "Lentilles saucisse façon Carole", subtitle: "Lentilles vertes, Diot de Savoie ou Montbéliard", category: "Légumineuses",
    servings: 4, prepTime: 15, cookTime: 40, temp: null,
    ingredients: [
      { name: "Lentilles vertes", qty: 300, unit: "g" },
      { name: "Saucisses fumées Diot de Savoie ou Montbéliard", qty: 4, unit: "" },
      { name: "Tomates concassées en boîte", qty: 400, unit: "g" },
      { name: "Concentré de tomates", qty: 1, unit: "cas" },
      { name: "Oignon haché", qty: 1, unit: "" },
      { name: "Gousses d'ail", qty: 2, unit: "" },
      { name: "Persil ciselé", qty: 1, unit: "bouquet" },
      { name: "Herbes de Provence", qty: 1, unit: "cac" },
      { name: "Feuille de laurier", qty: 1, unit: "" },
    ],
    prep: [
      { ingredient: "Oignons", action: "hacher" },
      { ingredient: "Ail", action: "écraser" },
      { ingredient: "Persil", action: "ciseler" },
      { ingredient: "Saucisses fumées Diot de Savoie ou Montbéliard", action: "couper en rondelles épaisses" },
    ],
    assembly: [
      "Dans une casserole — couvrir les lentilles d'eau froide, ajouter sel, herbes de Provence et feuille de laurier, cuire 25 min à feu moyen",
      "Dans une autre casserole — faire revenir oignon, saucisse coupée, ail et persil dans un filet d'huile",
      "Ajouter concentré de tomates puis tomates concassées, mijoter 10 min",
      "Égoutter les lentilles et les ajouter à la sauce tomate",
      "Mélanger et laisser mijoter 10 min ensemble pour que les saveurs s'imprègnent",
    ],
    steps: [
      "Cuire les lentilles dans l'eau salée avec herbes de Provence et laurier — 25 min",
      "Faire revenir oignon, saucisse, ail et persil dans l'huile",
      "Ajouter concentré de tomates et tomates concassées — mijoter 10 min",
      "Égoutter les lentilles et les incorporer à la sauce",
      "Mijoter encore 10 min ensemble",
    ],
    notes: [
      "Le Diot de Savoie fumé donne plus de caractère — la Montbéliard est plus douce.",
      "Encore meilleur réchauffé le lendemain.",
      "Batch cooking — se congèle très bien.",
    ],
    cookMethod: "feux",
  },
  ,
  {
    id: 20, name: "Piadine jambon-tomate-fromage", subtitle: "Rapide, achetée toute faite", category: "Rapide",
    servings: 3, prepTime: 5, cookTime: 5, temp: null,
    ingredients: [
      { name: "Piadines toutes faites", qty: 3, unit: "" },
      { name: "Tranches de jambon blanc", qty: 6, unit: "" },
      { name: "Tomates coupées en tranches", qty: 2, unit: "" },
      { name: "Mozzarella ou fromage râpé", qty: 150, unit: "g" },
    ],
    prep: [
      { ingredient: "Tomates", action: "couper en tranches fines" },
    ],
    assembly: [
      "Garnir chaque piadine de jambon, tranches de tomates et fromage",
      "Plier en deux",
      "Chauffer 2 min dans une poêle sèche ou à la plancha jusqu'à fromage fondu et piadine dorée",
    ],
    steps: [
      "Garnir chaque piadine de jambon, tranches de tomates et fromage",
      "Plier en deux",
      "Chauffer 2 min dans une poêle sèche ou à la plancha jusqu'à fromage fondu",
    ],
    cookMethod: "feux",
  },
];

function scaleQty(qty, baseServings, targetServings) {
  const ratio = targetServings / baseServings;
  const scaled = qty * ratio;
  if (scaled === Math.floor(scaled)) return scaled.toString();
  return parseFloat(scaled.toFixed(1)).toString();
}

function findIngredientQty(recipe, prepIngredientName, srv) {
  // Find the matching raw ingredient in the recipe by comparing normalized names,
  // then return its scaled quantity + unit as a display string.
  const targetKey = stripAccents(prepIngredientName.toLowerCase());
  const match = recipe.ingredients.find(ing => stripAccents(normalizeIngredientName(ing.name).toLowerCase()) === targetKey);
  if (!match) return null;
  const scaled = scaleQty(match.qty, recipe.servings, srv);
  return match.unit ? `${scaled} ${match.unit}` : scaled;
}

function buildMutualizedPrep(selected, recipeServings) {
  // For each ingredient+action combo, sum ALL quantities across recipes into one total.
  // Show ONE line per ingredient+action with the total quantity.
  // The recipe names go into the assembly step, not here.
  const byIngredient = {};

  selected.forEach(recipe => {
    if (!recipe.prep) return;
    const srv = recipeServings[recipe.id] || recipe.servings;
    recipe.prep.forEach(p => {
      const ingKey = stripAccents(p.ingredient.toLowerCase());
      if (!byIngredient[ingKey]) byIngredient[ingKey] = { ingredient: p.ingredient, actions: {} };

      const actionKey = stripAccents(p.action.toLowerCase());
      if (!byIngredient[ingKey].actions[actionKey]) {
        byIngredient[ingKey].actions[actionKey] = { action: p.action, totalQty: null, unit: "", recipeNames: [] };
      }

      // Find the ingredient in the recipe to get its quantity
      const ingNorm = stripAccents(p.ingredient.toLowerCase());
      const match = recipe.ingredients.find(ing =>
        stripAccents(normalizeIngredientName(ing.name).toLowerCase()) === ingNorm
      );

      if (match) {
        const scaledNum = parseFloat(scaleQty(match.qty, recipe.servings, srv));
        const entry = byIngredient[ingKey].actions[actionKey];
        if (entry.totalQty === null) {
          entry.totalQty = scaledNum;
          entry.unit = match.unit || "";
        } else if (entry.unit === (match.unit || "")) {
          entry.totalQty += scaledNum;
        }
        // else different units — keep first
      }

      byIngredient[ingKey].actions[actionKey].recipeNames.push(recipe.name);
    });
  });

  return Object.values(byIngredient).map(entry => {
    const actionLines = Object.values(entry.actions).map(a => {
      let qtyDisplay = "—";
      if (a.totalQty !== null) {
        const rounded = a.totalQty === Math.floor(a.totalQty) ? a.totalQty : parseFloat(a.totalQty.toFixed(1));
        qtyDisplay = a.unit ? `${rounded} ${a.unit}` : `${rounded}`;
      }
      return {
        action: a.action,
        qty: qtyDisplay,
        recipeNames: [...new Set(a.recipeNames)],
      };
    });
    return { ingredient: entry.ingredient, actionLines };
  });
}

function generateBatchPlan(selected, recipeServings) {
  if (selected.length === 0) return [];
  const fourItems = selected.filter((r) => r.cookMethod === "four");
  const feuxItems = selected.filter((r) => r.cookMethod === "feux");
  const steps = [];
  let time = 0;

  if (fourItems.length > 0) {
    const maxTemp = Math.max(...fourItems.map((r) => r.temp || 180));
    steps.push({ time: 0, label: `Préchauffer le four à ${maxTemp}°C`, type: "setup" });
  }

  // Mutualized prep step — structured items for visual rendering
  const mutualizedPrep = buildMutualizedPrep(selected, recipeServings);
  const totalPrep = Math.max(...selected.map((r) => r.prepTime));
  if (mutualizedPrep.length > 0) {
    steps.push({ time: 0, label: "Préparer les ingrédients", prepItems: mutualizedPrep, type: "prep" });
  } else {
    steps.push({ time: 0, label: "Préparer tous les ingrédients", detail: selected.map((r) => r.name).join("\n"), type: "prep" });
  }
  time = totalPrep;

  if (fourItems.length > 0) {
    const assemblyItems = fourItems.map(r => ({
      recipeName: r.name,
      marinadeNote: r.marinadeNote || null,
      assembly: r.assembly || [],
      cookTime: r.cookTime,
      temp: r.temp,
    }));
    steps.push({ time, label: `Assembler et enfourner — ${fourItems.map((r) => r.name).join(", ")}`, assemblyItems, type: "cook" });
  }
  if (feuxItems.length > 0) {
    const assemblyItems = feuxItems.map(r => ({
      recipeName: r.name,
      marinadeNote: r.marinadeNote || null,
      assembly: r.assembly || [],
      cookTime: r.cookTime,
      temp: null,
    }));
    steps.push({ time, label: "Assembler et lancer sur les feux, en parallèle", assemblyItems, type: "cook" });
  }
  const maxCook = Math.max(...selected.map((r) => r.cookTime));
  const midPoint = Math.floor(maxCook / 2);
  steps.push({ time: time + midPoint, label: "Vérifier la cuisson à mi-parcours", detail: selected.map((r) => `${r.name} — ${r.cookTime - midPoint} min restantes`).join("\n"), type: "check" });
  steps.push({ time: time + maxCook, label: "Sortir, laisser refroidir, portionner", detail: selected.map((r) => `${r.name} → réfrigérer ou congeler`).join("\n"), type: "finish" });
  return steps;
}


const PANTRY_STAPLES = ["eau", "sel", "poivre", "poivre noir", "huile d'olive", "huile de tournesol", "huile"];

const INGREDIENT_ALIASES = [
  { match: ["filet de poulet", "filets de poulet", "blanc de poulet", "blancs de poulet", "poulet (blancs)"], canonical: "Poulet — blancs / filets" },
  { match: ["cuisse de poulet", "cuisses de poulet", "cuisses de poulet avec peau"], canonical: "Poulet — cuisses" },
  { match: ["bœuf haché", "boeuf haché"], canonical: "Bœuf haché" },
  { match: ["paleron de bœuf", "paleron de boeuf", "paleron"], canonical: "Paleron de bœuf" },
  { match: ["porc haché"], canonical: "Porc haché" },
  { match: ["carotte", "carottes"], canonical: "Carottes" },
  { match: ["oignon rouge"], canonical: "Oignon rouge" },
  { match: ["oignon", "oignons"], canonical: "Oignons" },
  { match: ["gousse d'ail", "gousses d'ail", "ail"], canonical: "Ail" },
  { match: ["jus de citron", "citron"], canonical: "Citron" },
  { match: ["citronnelle", "tiges de citronnelle", "tige de citronnelle", "tiges de citronnelle émincées finement"], canonical: "Citronnelle" },
  { match: ["échalote", "échalotes"], canonical: "Échalote" },
  { match: ["persil"], canonical: "Persil" },
  { match: ["thym"], canonical: "Thym" },
  { match: ["poireau"], canonical: "Poireau" },
  { match: ["champignon", "champignons"], canonical: "Champignons" },
  { match: ["tomate", "tomates"], canonical: "Tomates" },
];

const CATEGORY_RULES = [
  { canonical: "Viandes & volailles", keywords: ["poulet", "bœuf", "boeuf", "porc", "lardons", "paleron", "haché", "cuisses"] },
  { canonical: "Légumes", keywords: ["carotte", "oignon", "poireau", "ail", "échalote", "tomate", "champignon", "cornichon"] },
  { canonical: "Herbes fraîches", keywords: ["persil", "thym", "laurier", "basilic", "ciboulette", "menthe", "bouquet garni"] },
  { canonical: "Épices", keywords: ["cumin", "paprika", "coriandre", "cannelle", "cardamome", "sumac", "piment", "herbes de provence"] },
  { canonical: "Produits laitiers", keywords: ["crème", "beurre", "yaourt", "ricotta", "parmesan", "burrata", "fromage"] },
  { canonical: "Épicerie & féculents", keywords: ["riz", "penne", "farine", "maïzena", "pain pita", "mie de pain", "chapelure"] },
  { canonical: "Liquides & condiments", keywords: ["bouillon", "vin", "fond de", "moutarde", "sirop d'érable", "citron", "miel", "gelée", "sucre", "pulpe de tomates"] },
  { canonical: "Autres", keywords: ["œuf", "oeuf"] },
];

function stripAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function cleanName(name) {
  // remove parenthetical notes like "(marinade)" or "(sauce)"
  let cleaned = name.replace(/\s*\(.*?\)\s*/g, "").trim();
  // remove trailing descriptors after a comma, e.g. "Carottes, pelées et coupées en bâtonnets" -> "Carottes"
  cleaned = cleaned.split(",")[0].trim();
  return cleaned;
}

function isPantryStaple(name) {
  const lower = stripAccents(cleanName(name).toLowerCase());
  return PANTRY_STAPLES.some(s => lower === stripAccents(s) || lower.startsWith(stripAccents(s) + " "));
}

function normalizeIngredientName(rawName) {
  const rawLower = stripAccents(rawName.toLowerCase());
  // Handle poulet with cut specified in parentheses, e.g. "Poulet (blancs)"
  if (rawLower.includes("poulet")) {
    if (rawLower.includes("blanc") || rawLower.includes("filet")) return "Poulet — blancs / filets";
    if (rawLower.includes("cuisse")) return "Poulet — cuisses";
    if (rawLower.includes("hache")) return "Poulet haché";
    if (rawLower.includes("entier")) return "Poulet entier";
  }
  const cleaned = cleanName(rawName);
  const lower = stripAccents(cleaned.toLowerCase());
  // Substring match — handles "Carottes, pelées..." and "gousses d'ail écrasées" alike
  for (const alias of INGREDIENT_ALIASES) {
    for (const m of alias.match) {
      const mNorm = stripAccents(m.toLowerCase());
      if (lower === mNorm || lower.includes(mNorm)) return alias.canonical;
    }
  }
  // fallback: capitalize cleaned original
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function categorizeIngredient(canonicalName) {
  const lower = stripAccents(canonicalName.toLowerCase());
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(kw => lower.includes(stripAccents(kw)))) return rule.canonical;
  }
  return "Autres";
}

const UNIT_EQUIVALENTS = {
  "branche": "branche", "branches": "branche",
  "gousse": "gousse", "gousses": "gousse",
  "citron": "citron-unit", "citrons": "citron-unit",
  "gros": "piece", "grosse": "piece", "piece": "piece", "pieces": "piece", "": "piece",
};

function normalizeUnit(unit) {
  const u = unit.toLowerCase().trim();
  return UNIT_EQUIVALENTS[u] || u;
}

// Reference weight (g) for one typical unit of a "piece"-counted ingredient,
// and reference volume (ml) for a tablespoon (cas) where relevant — used to
// convert grams/ml into an approximate whole-piece count. unitLabel is the
// word shown next to the converted count, e.g. "gousses", "champignons".
const PIECE_REFERENCE = {
  "carottes": { gramsPerPiece: 80, unitLabel: "carottes" },
  "poireau": { gramsPerPiece: 200, unitLabel: "poireaux" },
  "oignon": { gramsPerPiece: 100, unitLabel: "oignons" },
  "tomates": { gramsPerPiece: 120, unitLabel: "tomates" },
  "champignons": { gramsPerPiece: 20, unitLabel: "champignons" },
  "citron": { mlPerPiece: 45, casPerPiece: 3, unitLabel: "citrons" },
  "ail": { gramsPerPiece: 5, unitLabel: "gousses" },
};

function roundToHalf(n) {
  return Math.round(n * 2) / 2;
}

// Convert a list of {qty, unit} parts for one ingredient into a single
// best-effort display string by converting everything into a piece count
// when a reference is known, otherwise falling back to listing parts.
function consolidateParts(canonicalName, parts) {
  const nameKey = stripAccents(canonicalName.toLowerCase());
  const refKey = Object.keys(PIECE_REFERENCE).find(k => nameKey.includes(stripAccents(k)));
  const ref = refKey ? PIECE_REFERENCE[refKey] : null;

  if (ref) {
    let totalPieces = 0;
    const leftover = {};
    Object.entries(parts).forEach(([unit, qty]) => {
      if (unit === "piece" || unit === "gousse" || unit === "citron-unit") {
        totalPieces += qty;
      } else if (unit === "g" && ref.gramsPerPiece) {
        totalPieces += qty / ref.gramsPerPiece;
      } else if (unit === "kg" && ref.gramsPerPiece) {
        totalPieces += (qty * 1000) / ref.gramsPerPiece;
      } else if (unit === "cas" && ref.casPerPiece) {
        totalPieces += qty / ref.casPerPiece;
      } else if (unit === "ml" && ref.mlPerPiece) {
        totalPieces += qty / ref.mlPerPiece;
      } else {
        leftover[unit] = (leftover[unit] || 0) + qty;
      }
    });
    const parts2 = [];
    if (totalPieces > 0) {
      const rounded = roundToHalf(totalPieces);
      const display = rounded % 1 === 0 ? rounded : rounded.toFixed(1);
      parts2.push(`~${display} ${ref.unitLabel}`);
    }
    Object.entries(leftover).forEach(([unit, qty]) => {
      const qtyDisplay = qty === Math.floor(qty) ? qty.toString() : qty.toFixed(1);
      parts2.push(unit ? `${qtyDisplay} ${unit}` : qtyDisplay);
    });
    return parts2.join(" + ");
  }

  // No reference available — just list parts side by side as before
  return Object.entries(parts).map(([unit, qty]) => {
    const qtyDisplay = qty === Math.floor(qty) ? qty.toString() : qty.toFixed(1);
    return unit && unit !== "piece" ? `${qtyDisplay} ${unit}` : qtyDisplay;
  }).join(" + ");
}

function buildShoppingList(selected, recipeServings) {
  // Group purely by canonical ingredient name (ignore unit at this stage)
  const merged = {};
  selected.forEach(recipe => {
    const srv = recipeServings[recipe.id] || recipe.servings;
    recipe.ingredients.forEach((ing) => {
      if (isPantryStaple(ing.name)) return;
      const canonicalName = normalizeIngredientName(ing.name);
      const scaledQty = parseFloat(scaleQty(ing.qty, recipe.servings, srv)) || 0;
      const normUnit = normalizeUnit(ing.unit || "");
      const nameKey = stripAccents(canonicalName.toLowerCase());
      if (!merged[nameKey]) {
        merged[nameKey] = { name: canonicalName, parts: {}, recipeNames: [] };
      }
      if (!merged[nameKey].parts[normUnit]) merged[nameKey].parts[normUnit] = 0;
      merged[nameKey].parts[normUnit] += scaledQty;
      if (!merged[nameKey].recipeNames.includes(recipe.name)) merged[nameKey].recipeNames.push(recipe.name);
    });
  });

  const grouped = {};
  Object.values(merged).forEach(item => {
    const cat = categorizeIngredient(item.name);
    if (!grouped[cat]) grouped[cat] = [];
    const key = stripAccents(item.name.toLowerCase());
    grouped[cat].push({
      key,
      name: item.name,
      qtyDisplay: consolidateParts(item.name, item.parts),
      recipeName: item.recipeNames.join(", "),
    });
  });
  return grouped;
}

const sauceBlancheRecipe = {
  id: "sauce_blanche", name: "Sauce blanche", subtitle: "Yaourt, ail, citron", category: "Sauce",
  servings: 4, prepTime: 5, cookTime: 0, cookMethod: "feux",
  ingredients: [
    { name: "Yaourt grec", qty: 200, unit: "g" },
    { name: "Gousse d'ail râpée", qty: 1, unit: "" },
    { name: "Jus de citron", qty: 0.5, unit: "citron" },
    { name: "Échalote ciselée", qty: 1, unit: "" },
    { name: "Ciboulette ciselée", qty: 1, unit: "cas" },
  ],
  steps: ["Mélanger tous les ingrédients", "Goûter et rectifier l'assaisonnement", "Réserver au frais jusqu'au service"],
};

function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: COLORS.line, text: COLORS.inkSoft },
    terracotta: { bg: COLORS.terracottaSoft, text: COLORS.terracottaDark },
    sage: { bg: COLORS.sageSoft, text: "#3f4a37" },
    gold: { bg: COLORS.goldSoft, text: "#7a5a1f" },
  };
  const t = tones[tone];
  return (
    <span style={{ background: t.bg, color: t.text, fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function ServingsControl({ value, onChange, compact }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 8 : 12 }}>
      <button onClick={() => onChange(Math.max(1, value - 1))} style={{
        width: compact ? 28 : 34, height: compact ? 28 : 34, borderRadius: "50%",
        border: `1px solid ${COLORS.line}`, background: COLORS.card, color: COLORS.ink,
        fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>−</button>
      <div style={{ minWidth: compact ? 24 : 32, textAlign: "center", fontSize: compact ? 16 : 20, fontWeight: 500, color: COLORS.ink }}>{value}</div>
      <button onClick={() => onChange(Math.min(12, value + 1))} style={{
        width: compact ? 28 : 34, height: compact ? 28 : 34, borderRadius: "50%",
        border: `1px solid ${COLORS.terracotta}`, background: COLORS.terracotta, color: "#fff",
        fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>+</button>
    </div>
  );
}

export default function BatchCooking() {
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [selected, setSelected] = useState([]);
  const [view, setView] = useState("home");
  const [filterCat, setFilterCat] = useState("Tous");
  const [expandedStep, setExpandedStep] = useState(null);
  const [batchPlan, setBatchPlan] = useState([]);
  const [detailRecipe, setDetailRecipe] = useState(null);
  const [detailServings, setDetailServings] = useState(2);
  const [recipeServings, setRecipeServings] = useState({});
  const [showSauceBlanche, setShowSauceBlanche] = useState(false);
  const [restesSuggestion, setRestesSuggestion] = useState(null); // { tag, suggestions[] }
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [weekPlan, setWeekPlan] = useState({ Lun: null, Mar: null, Mer: null, Jeu: null, Ven: null });
  const [planPickingDay, setPlanPickingDay] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [weekHistory, setWeekHistory] = useState([]);
  const [ownedIngredients, setOwnedIngredients] = useState({});
  const [manualItems, setManualItems] = useState([]); // extra items added manually
  const [manualInput, setManualInput] = useState("");
  const [showFinalList, setShowFinalList] = useState(false);
  const [savedShoppingLists, setSavedShoppingLists] = useState([]);
  const [viewingShoppingList, setViewingShoppingList] = useState(null);
  const [ambiguousPoultry, setAmbiguousPoultry] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null); // recipe being edited
  const [confirmDelete, setConfirmDelete] = useState(null); // { type: "recipe"|"list", item }
  // weekStatus tracks where the person is in the real-life journey:
  // "planning" -> choosing recipes, "shopping" -> list generated, waiting to shop,
  // "cooking" -> groceries done, ready to batch cook, "idle" -> nothing active
  const [weekStatus, setWeekStatus] = useState("idle");
  const [activeShoppingList, setActiveShoppingList] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    name: "", category: "", servings: 4,
    prepTime: 10, cookTime: 30, temp: "", cookMethod: "feux",
    ingredients: "", steps: ""
  });

  const categories = ["Tous", ...Array.from(new Set(recipes.map(r => r.category))).filter(c => c !== "Restes" && c)];
  const [filterReste, setFilterReste] = useState(null);
  const allResteTags = [...new Set(recipes.filter(r => r.resteTags).flatMap(r => r.resteTags))];
  const filtered = (() => {
    let list = filterCat === "Tous" ? recipes : recipes.filter(r => r.category === filterCat);
    if (filterReste) list = list.filter(r => r.resteTags && r.resteTags.includes(filterReste));
    return list;
  })();

  // Load data from Supabase on mount
  useEffect(() => {
    const load = async () => {
      try {
        // Load recipes (merge with INITIAL_RECIPES — db takes priority for existing ids)
        const dbRecipes = await db.get("recipes");
        if (dbRecipes && dbRecipes.length > 0) {
          const mapped = dbRecipes.map(r => ({
            id: r.id, name: r.name, subtitle: r.subtitle, category: r.category,
            servings: r.servings, prepTime: r.prep_time, cookTime: r.cook_time,
            temp: r.temp, cookMethod: r.cook_method, marinadeNote: r.marinade_note,
            sauceBlanche: r.sauce_blanche, ingredients: r.ingredients || [],
            prep: r.prep || [], assembly: r.assembly || [],
            steps: r.steps || [], notes: r.notes || [],
            sauceIngredients: r.sauce_ingredients || [],
          }));
          // Merge: keep INITIAL_RECIPES not in db, add db ones
          const dbIds = new Set(mapped.map(r => r.id));
          const localOnly = INITIAL_RECIPES.filter(r => !dbIds.has(r.id));
          setRecipes([...localOnly, ...mapped]);
          // Sync local recipes to db
          for (const r of INITIAL_RECIPES) {
            if (!dbIds.has(r.id)) {
              await db.upsert("recipes", {
                id: r.id, name: r.name, subtitle: r.subtitle || "", category: r.category,
                servings: r.servings, prep_time: r.prepTime, cook_time: r.cookTime,
                temp: r.temp, cook_method: r.cookMethod, marinade_note: r.marinadeNote || null,
                sauce_blanche: r.sauceBlanche || false, ingredients: r.ingredients,
                prep: r.prep || [], assembly: r.assembly || [],
                steps: r.steps, notes: r.notes || [],
                sauce_ingredients: r.sauceIngredients || [],
              });
            }
          }
        } else {
          // First time — push all INITIAL_RECIPES to db
          for (const r of INITIAL_RECIPES) {
            await db.upsert("recipes", {
              id: r.id, name: r.name, subtitle: r.subtitle || "", category: r.category,
              servings: r.servings, prep_time: r.prepTime, cook_time: r.cookTime,
              temp: r.temp, cook_method: r.cookMethod, marinade_note: r.marinadeNote || null,
              sauce_blanche: r.sauceBlanche || false, ingredients: r.ingredients,
              prep: r.prep || [], assembly: r.assembly || [],
              steps: r.steps, notes: r.notes || [],
              sauce_ingredients: r.sauceIngredients || [],
            });
          }
        }
        // Load week history
        const dbHistory = await db.get("week_history");
        if (dbHistory && dbHistory.length > 0) {
          setWeekHistory(dbHistory.map(h => ({ week: h.week_label, date: h.date, recipes: h.recipes, dbId: h.id })));
        }
        // Load shopping lists
        const dbLists = await db.get("shopping_lists");
        if (dbLists && dbLists.length > 0) {
          setSavedShoppingLists(dbLists.map(l => ({ label: l.label, date: l.date, recipes: l.recipes, list: l.list, dbId: l.id })));
        }
        // Restore current week from localStorage
        try {
          const raw = localStorage.getItem("carnet_current_week");
          if (raw) {
            const cw = JSON.parse(raw);
            if (cw.weekStatus && cw.weekStatus !== "idle") {
              setWeekStatus(cw.weekStatus);
              if (cw.recipeServings) setRecipeServings(cw.recipeServings);
              if (cw.ownedIngredients) setOwnedIngredients(cw.ownedIngredients);
              if (cw.manualItems) setManualItems(cw.manualItems);
              if (cw.activeShoppingList) setActiveShoppingList(cw.activeShoppingList);
              if (cw.selectedIds && cw.selectedIds.length > 0) {
                window.__pendingSelectedIds = cw.selectedIds;
              }
            }
          }
        } catch(e) {}
      } catch (e) {
        console.error("Supabase load error:", e);
      }
      setAppReady(true);
    };
    load();
  }, []);

  // Auto-save current week state whenever key state changes
  // Save current week to localStorage whenever key state changes
  const [appReady, setAppReady] = useState(false);
  useEffect(() => {
    if (!appReady) return;
    const data = {
      weekStatus, recipeServings, ownedIngredients, manualItems,
      selectedIds: selected.map(r => r.id),
      activeShoppingList: activeShoppingList || null,
    };
    try { localStorage.setItem("carnet_current_week", JSON.stringify(data)); } catch(e) {}
  }, [weekStatus, selected, recipeServings, activeShoppingList, ownedIngredients, manualItems, appReady]);

  const toggleSelect = (recipe) => {
    const isCurrentlySelected = selected.find((r) => r.id === recipe.id);
    if (isCurrentlySelected) {
      setSelected(prev => prev.filter(r => r.id !== recipe.id));
      setRecipeServings(prev => { const n = { ...prev }; delete n[recipe.id]; return n; });
    } else {
      setSelected(prev => [...prev, recipe]);
      setRecipeServings(prev => ({ ...prev, [recipe.id]: recipe.servings }));
      if (recipe.sauceBlanche) setTimeout(() => setShowSauceBlanche(true), 200);
      if (weekStatus === "idle") setWeekStatus("planning");
      // Detect if this recipe generates leftovers matching a Restes recipe
      const RESTE_TRIGGERS = {
        "riz": ["riz basmati", "riz long grain", "riz cuit", "riz blanc", "riz jasmin"],
        "poulet": ["poulet rôti", "poulet effiloché"],
        "viande grillée": ["poitrine de porc", "côte", "grillade", "bbq"],
      };
      const resteRecipes = recipes.filter(r => r.resteTags);
      const suggestions = [];
      (recipe.ingredients || []).forEach(ing => {
        const ingLower = stripAccents(ing.name.toLowerCase());
        Object.entries(RESTE_TRIGGERS).forEach(([tag, keywords]) => {
          if (keywords.some(kw => ingLower.includes(stripAccents(kw)))) {
            resteRecipes.filter(r => r.resteTags.includes(tag)).forEach(resteRecipe => {
              if (!suggestions.find(s => s.recipe.id === resteRecipe.id)) {
                suggestions.push({ tag, recipe: resteRecipe });
              }
            });
          }
        });
      });
      if (suggestions.length > 0) {
        setTimeout(() => setRestesSuggestion(suggestions), recipe.sauceBlanche ? 600 : 300);
      }
    }
  };

  const totalTime = selected.length > 0
    ? Math.max(...selected.map((r) => r.prepTime)) + Math.max(...selected.map((r) => r.cookTime))
    : 0;

  const buildRecipeFromForm = (ingredients) => ({
    id: Date.now(), name: newRecipe.name, subtitle: "", category: newRecipe.category,
    servings: Number(newRecipe.servings), prepTime: Number(newRecipe.prepTime),
    cookTime: Number(newRecipe.cookTime), temp: newRecipe.temp ? Number(newRecipe.temp) : null,
    cookMethod: newRecipe.cookMethod, ingredients,
    steps: newRecipe.steps.split("\n").filter(Boolean),
  });

  const finalizeAddRecipe = async (ingredients) => {
    const recipe = buildRecipeFromForm(ingredients);
    setRecipes((prev) => [...prev, recipe]);
    setNewRecipe({ name: "", category: "", servings: 4, prepTime: 10, cookTime: 30, temp: "", cookMethod: "feux", ingredients: "", steps: "" });
    setView("select");
    try {
      await db.upsert("recipes", {
        id: recipe.id, name: recipe.name, subtitle: recipe.subtitle || "",
        category: recipe.category, servings: recipe.servings,
        prep_time: recipe.prepTime, cook_time: recipe.cookTime,
        temp: recipe.temp, cook_method: recipe.cookMethod,
        marinade_note: recipe.marinadeNote || null,
        sauce_blanche: recipe.sauceBlanche || false,
        ingredients: recipe.ingredients, prep: recipe.prep || [],
        assembly: recipe.assembly || [], steps: recipe.steps,
        notes: recipe.notes || [], sauce_ingredients: recipe.sauceIngredients || [],
      });
    } catch (e) { console.error("Save recipe error:", e); }
  };

  const addRecipe = () => {
    if (!newRecipe.name || !newRecipe.category) return;
    const ingredients = newRecipe.ingredients.split("\n").filter(Boolean).map(line => {
      const match = line.match(/^([\d.]+)\s*([a-zA-Zéèêàùûôîïçœæ]*)\s+(?:de\s+)?(.+)$/i);
      if (match) return { qty: parseFloat(match[1]), unit: match[2], name: match[3] };
      return { qty: 1, unit: "", name: line };
    });

    // Check for ambiguous "poulet" without specifying the cut
    const specifics = ["blanc", "filet", "cuisse", "haché", "hache", "aile", "pilon", "entier", "carcasse"];
    const ambiguousIndex = ingredients.findIndex(ing => {
      const lower = ing.name.toLowerCase();
      return lower.includes("poulet") && !specifics.some(s => lower.includes(s));
    });

    if (ambiguousIndex !== -1) {
      setAmbiguousPoultry({ ingredients, index: ambiguousIndex });
      return;
    }

    finalizeAddRecipe(ingredients);
  };

  const inputStyle = {
    width: "100%", padding: "11px 13px", borderRadius: 10,
    border: `1px solid ${COLORS.line}`, fontSize: 15, boxSizing: "border-box",
    background: COLORS.cream, color: COLORS.ink, fontFamily: "inherit",
  };
  const labelStyle = { fontSize: 13, fontWeight: 500, color: COLORS.inkSoft, display: "block", marginBottom: 6 };

  return (
    <div style={{ fontFamily: "'Georgia', 'Iowan Old Style', serif", background: COLORS.cream, minHeight: "100vh", color: COLORS.ink }}>
      <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

        {/* RESTES SUGGESTION MODAL */}
        {restesSuggestion && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(43,38,34,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setRestesSuggestion(null)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: COLORS.card, borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", border: `1px solid ${COLORS.line}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.gold, marginBottom: 6 }}>Astuce restes</div>
              <h2 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 500, fontFamily: "Georgia, serif" }}>Tu vas avoir des restes 🍱</h2>
              <p style={{ fontSize: 13, color: COLORS.inkMuted, marginBottom: 18, lineHeight: 1.5 }}>
                Cette recette va te laisser des restes — voici ce que tu peux en faire :
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {restesSuggestion.map((s, i) => (
                  <div key={i} style={{ background: COLORS.goldSoft, borderRadius: 12, padding: "12px 14px", border: `1px solid #e8d9a0` }}>
                    <div style={{ fontWeight: 600, fontSize: 14, fontFamily: "Georgia, serif", marginBottom: 2 }}>
                      {s.recipe.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#7a5a1f" }}>
                      Avec tes restes de {s.tag} · {s.recipe.prepTime + s.recipe.cookTime} min
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => {
                restesSuggestion.forEach(s => {
                  if (!selected.find(r => r.id === s.recipe.id)) {
                    setSelected(prev => [...prev, s.recipe]);
                    setRecipeServings(prev => ({ ...prev, [s.recipe.id]: s.recipe.servings }));
                  }
                });
                setRestesSuggestion(null);
              }} style={{
                width: "100%", padding: 13, borderRadius: 10, border: "none",
                background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 14, cursor: "pointer", marginBottom: 8,
              }}>Ajouter au batch</button>
              <button onClick={() => setRestesSuggestion(null)} style={{
                width: "100%", padding: 13, borderRadius: 10, border: `1px solid ${COLORS.line}`,
                background: "transparent", color: COLORS.inkSoft, fontWeight: 500, fontSize: 14, cursor: "pointer",
              }}>Non merci</button>
            </div>
          </div>
        )}

        {/* SAUCE BLANCHE MODAL */}
        {showSauceBlanche && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(43,38,34,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setShowSauceBlanche(false)}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: COLORS.card, borderRadius: 16, padding: 28, maxWidth: 380, width: "100%",
              border: `1px solid ${COLORS.line}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 6 }}>Suggestion</div>
              <h2 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 500, fontFamily: "Georgia, serif" }}>Sauce blanche</h2>
              <p style={{ fontSize: 13, color: COLORS.inkMuted, marginBottom: 18 }}>À préparer pendant que le poulet repose</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                {sauceBlancheRecipe.ingredients.map((ing, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, padding: "7px 0", borderBottom: i < sauceBlancheRecipe.ingredients.length - 1 ? `1px solid ${COLORS.line}` : "none" }}>
                    <span style={{ fontWeight: 600, color: COLORS.terracotta, minWidth: 50 }}>{ing.qty}{ing.unit}</span>
                    <span style={{ color: COLORS.inkSoft }}>{ing.name}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => {
                setSelected(prev => prev.find(r => r.id === "sauce_blanche") ? prev : [...prev, sauceBlancheRecipe]);
                setRecipeServings(prev => ({ ...prev, sauce_blanche: prev.sauce_blanche || 4 }));
                setShowSauceBlanche(false);
              }} style={{
                width: "100%", padding: 13, borderRadius: 10, border: "none",
                background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 14, cursor: "pointer", marginBottom: 8,
              }}>Ajouter au batch</button>
              <button onClick={() => setShowSauceBlanche(false)} style={{
                width: "100%", padding: 13, borderRadius: 10, border: `1px solid ${COLORS.line}`,
                background: "transparent", color: COLORS.inkSoft, fontWeight: 500, fontSize: 14, cursor: "pointer",
              }}>Non merci</button>
            </div>
          </div>
        )}

        {/* HISTORY MODAL */}
        {showHistoryModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(43,38,34,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            onClick={() => setShowHistoryModal(false)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: COLORS.cream, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 600,
              maxHeight: "80vh", overflowY: "auto", padding: "26px 22px 32px", border: `1px solid ${COLORS.line}`, borderBottom: "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                <h2 style={{ margin: 0, fontSize: 21, fontWeight: 500, fontFamily: "Georgia, serif" }}>Historique des semaines</h2>
                <button onClick={() => setShowHistoryModal(false)} style={{ background: "transparent", border: `1px solid ${COLORS.line}`, borderRadius: "50%", width: 32, height: 32, fontSize: 16, cursor: "pointer", color: COLORS.inkSoft }}>×</button>
              </div>
              {weekHistory.length === 0 ? (
                <div style={{ textAlign: "center", color: COLORS.inkMuted, padding: 30, fontSize: 14 }}>Aucune semaine enregistrée</div>
              ) : (
                [...weekHistory].reverse().map((entry, i) => (
                  <div key={i} style={{ background: COLORS.card, borderRadius: 14, padding: 18, marginBottom: 12, border: `1px solid ${COLORS.line}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 10 }}>{entry.week}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {entry.recipes.map((r, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", fontSize: 14, color: COLORS.inkSoft }}>
                          <span style={{ flex: 1 }}>{r.name}</span>
                          <span style={{ fontSize: 12, color: COLORS.inkMuted }}>{r.servings} pers.</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUGGESTION MODAL */}
        {showSuggestion && (() => {
          const lastIds = weekHistory.length > 0 ? weekHistory[weekHistory.length - 1].recipes.map(r => r.id) : [];
          const prevIds = weekHistory.length > 1 ? weekHistory[weekHistory.length - 2].recipes.map(r => r.id) : [];
          const usedIds = new Set([...lastIds, ...prevIds]);
          const suggestions = recipes.filter(r => !usedIds.has(r.id));
          const alreadyUsed = recipes.filter(r => usedIds.has(r.id));
          return (
            <div style={{ position: "fixed", inset: 0, background: "rgba(43,38,34,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
              onClick={() => setShowSuggestion(false)}>
              <div onClick={e => e.stopPropagation()} style={{
                background: COLORS.cream, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 600,
                maxHeight: "85vh", overflowY: "auto", padding: "26px 22px 32px", border: `1px solid ${COLORS.line}`, borderBottom: "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h2 style={{ margin: 0, fontSize: 21, fontWeight: 500, fontFamily: "Georgia, serif" }}>Semaine enregistrée</h2>
                  <button onClick={() => setShowSuggestion(false)} style={{ background: "transparent", border: `1px solid ${COLORS.line}`, borderRadius: "50%", width: 32, height: 32, fontSize: 16, cursor: "pointer", color: COLORS.inkSoft }}>×</button>
                </div>
                <p style={{ fontSize: 14, color: COLORS.inkMuted, marginBottom: 22 }}>Pour varier, voici des idées pour la semaine prochaine</p>

                {suggestions.length > 0 ? (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.sage, marginBottom: 12 }}>Pas cuisinés récemment</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
                      {suggestions.map(r => (
                        <div key={r.id} style={{
                          background: COLORS.card, borderRadius: 12, padding: "14px 16px",
                          display: "flex", alignItems: "center", gap: 12, border: `1px solid ${COLORS.line}`,
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: 15 }}>{r.name}</div>
                            <div style={{ fontSize: 12, color: COLORS.inkMuted }}>{r.category} · {r.prepTime + r.cookTime} min</div>
                          </div>
                          <button onClick={() => { toggleSelect(r); setShowSuggestion(false); setView("batch"); }} style={{
                            padding: "8px 14px", borderRadius: 8, border: "none",
                            background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 13, cursor: "pointer",
                          }}>Ajouter</button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ background: COLORS.card, borderRadius: 12, padding: 18, marginBottom: 22, textAlign: "center", color: COLORS.inkMuted, fontSize: 14, border: `1px solid ${COLORS.line}` }}>
                    Toutes les recettes ont été cuisinées récemment. Ajoute de nouvelles recettes pour varier.
                  </div>
                )}

                {alreadyUsed.length > 0 && (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.inkMuted, marginBottom: 10 }}>Déjà cuisinés récemment</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
                      {alreadyUsed.map(r => (
                        <Pill key={r.id}>{r.name}</Pill>
                      ))}
                    </div>
                  </>
                )}

                <button onClick={() => { setShowSuggestion(false); setSelected([]); setRecipeServings({}); setView("select"); }} style={{
                  width: "100%", padding: 14, borderRadius: 10, border: "none",
                  background: COLORS.ink, color: "#fff", fontWeight: 500, fontSize: 14, cursor: "pointer",
                }}>Commencer la semaine prochaine</button>
              </div>
            </div>
          );
        })()}

        {/* CONFIRM DELETE MODAL */}
        {confirmDelete && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(43,38,34,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: COLORS.card, borderRadius: 16, padding: 28, maxWidth: 360, width: "100%", border: `1px solid ${COLORS.line}` }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 500, fontFamily: "Georgia, serif" }}>
                {confirmDelete.type === "recipe" ? "Supprimer la recette ?" : "Supprimer la liste ?"}
              </h2>
              <p style={{ fontSize: 14, color: COLORS.inkMuted, marginBottom: 24, lineHeight: 1.5 }}>
                {confirmDelete.type === "recipe"
                  ? `"${confirmDelete.item.name}" sera supprimée définitivement.`
                  : `"${confirmDelete.item.label}" sera supprimée de l'historique.`}
              </p>
              <button onClick={async () => {
                if (confirmDelete.type === "recipe") {
                  setRecipes(prev => prev.filter(r => r.id !== confirmDelete.item.id));
                  setSelected(prev => prev.filter(r => r.id !== confirmDelete.item.id));
                  setDetailRecipe(null);
                  try { await db.delete("recipes", confirmDelete.item.id); } catch(e) {}
                } else {
                  setSavedShoppingLists(prev => prev.filter(l => l.label !== confirmDelete.item.label));
                  try { await db.delete("shopping_lists", confirmDelete.item.dbId); } catch(e) {}
                }
                setConfirmDelete(null);
              }} style={{
                width: "100%", padding: 13, borderRadius: 10, border: "none",
                background: "#c0392b", color: "#fff", fontWeight: 500, fontSize: 14, cursor: "pointer", marginBottom: 8,
              }}>Supprimer définitivement</button>
              <button onClick={() => setConfirmDelete(null)} style={{
                width: "100%", padding: 13, borderRadius: 10, border: `1px solid ${COLORS.line}`,
                background: "transparent", color: COLORS.inkSoft, fontWeight: 500, fontSize: 14, cursor: "pointer",
              }}>Annuler</button>
            </div>
          </div>
        )}

        {/* EDIT RECIPE MODAL */}
        {editingRecipe && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(43,38,34,0.6)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <div style={{ background: COLORS.cream, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", padding: "24px 22px 32px", border: `1px solid ${COLORS.line}`, borderBottom: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, fontFamily: "Georgia, serif" }}>Modifier la recette</h2>
                <button onClick={() => setEditingRecipe(null)} style={{ background: "transparent", border: `1px solid ${COLORS.line}`, borderRadius: "50%", width: 32, height: 32, fontSize: 16, cursor: "pointer", color: COLORS.inkSoft }}>×</button>
              </div>

              {[
                { label: "Nom", key: "name", placeholder: "Ex. Blanquette de poulet" },
                { label: "Sous-titre", key: "subtitle", placeholder: "Ex. Crémeuse, riz vapeur" },
                { label: "Catégorie", key: "category", placeholder: "Ex. Poulet, Boeuf..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkSoft, display: "block", marginBottom: 5 }}>{label}</label>
                  <input value={editingRecipe[key] || ""} onChange={e => setEditingRecipe(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder} style={{ width: "100%", padding: "10px 13px", borderRadius: 10, border: `1px solid ${COLORS.line}`, fontSize: 14, boxSizing: "border-box", background: COLORS.cream, fontFamily: "inherit" }} />
                </div>
              ))}

              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                {[{ label: "Prépa (min)", key: "prepTime" }, { label: "Cuisson (min)", key: "cookTime" }, { label: "Portions", key: "servings" }].map(({ label, key }) => (
                  <div key={key} style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: COLORS.inkSoft, display: "block", marginBottom: 5 }}>{label}</label>
                    <input type="number" value={editingRecipe[key] || ""} onChange={e => setEditingRecipe(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                      style={{ width: "100%", padding: "10px 8px", borderRadius: 10, border: `1px solid ${COLORS.line}`, fontSize: 14, boxSizing: "border-box", background: COLORS.cream }} />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkSoft, display: "block", marginBottom: 5 }}>Ingrédients (1 par ligne)</label>
                <textarea rows={6} value={(editingRecipe.ingredients || []).map(i => `${i.qty}${i.unit} ${i.name}`).join("\n")}
                  onChange={e => {
                    const lines = e.target.value.split("\n").filter(Boolean).map(line => {
                      const match = line.match(/^([\d.]+)\s*([a-zA-Zéèêàùûôîïçœæ]*)\s+(?:de\s+)?(.+)$/i);
                      if (match) return { qty: parseFloat(match[1]), unit: match[2], name: match[3] };
                      return { qty: 1, unit: "", name: line };
                    });
                    setEditingRecipe(prev => ({ ...prev, ingredients: lines }));
                  }}
                  style={{ width: "100%", padding: "10px 13px", borderRadius: 10, border: `1px solid ${COLORS.line}`, fontSize: 13, boxSizing: "border-box", resize: "vertical", background: COLORS.cream, fontFamily: "inherit" }} />
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkSoft, display: "block", marginBottom: 5 }}>Étapes (1 par ligne)</label>
                <textarea rows={6} value={(editingRecipe.steps || []).join("\n")}
                  onChange={e => setEditingRecipe(prev => ({ ...prev, steps: e.target.value.split("\n").filter(Boolean) }))}
                  style={{ width: "100%", padding: "10px 13px", borderRadius: 10, border: `1px solid ${COLORS.line}`, fontSize: 13, boxSizing: "border-box", resize: "vertical", background: COLORS.cream, fontFamily: "inherit" }} />
              </div>

              <button onClick={async () => {
                setRecipes(prev => prev.map(r => r.id === editingRecipe.id ? editingRecipe : r));
                setDetailRecipe(editingRecipe);
                setEditingRecipe(null);
                try {
                  await db.update("recipes", editingRecipe.id, {
                    name: editingRecipe.name, subtitle: editingRecipe.subtitle || "",
                    category: editingRecipe.category, servings: editingRecipe.servings,
                    prep_time: editingRecipe.prepTime, cook_time: editingRecipe.cookTime,
                    ingredients: editingRecipe.ingredients, steps: editingRecipe.steps,
                  });
                } catch(e) { console.error("Update error:", e); }
              }} style={{
                width: "100%", padding: 14, borderRadius: 10, border: "none",
                background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 15, cursor: "pointer",
              }}>Enregistrer les modifications</button>
            </div>
          </div>
        )}

        {/* AMBIGUOUS POULTRY MODAL */}
        {ambiguousPoultry && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(43,38,34,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{
              background: COLORS.card, borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", border: `1px solid ${COLORS.line}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 6 }}>Précision nécessaire</div>
              <h2 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 500, fontFamily: "Georgia, serif" }}>Quel morceau de poulet ?</h2>
              <p style={{ fontSize: 13, color: COLORS.inkMuted, marginBottom: 20, lineHeight: 1.5 }}>
                L'ingrédient "{ambiguousPoultry.ingredients[ambiguousPoultry.index].name}" ne précise pas le morceau. Pour bien organiser la liste de courses, choisis :
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Blancs / filets", suffix: "blancs" },
                  { label: "Cuisses", suffix: "cuisses" },
                  { label: "Poulet entier", suffix: "entier" },
                  { label: "Poulet haché", suffix: "haché" },
                ].map(opt => (
                  <button key={opt.suffix} onClick={() => {
                    const updated = [...ambiguousPoultry.ingredients];
                    updated[ambiguousPoultry.index] = {
                      ...updated[ambiguousPoultry.index],
                      name: `${updated[ambiguousPoultry.index].name} (${opt.suffix})`,
                    };
                    finalizeAddRecipe(updated);
                    setAmbiguousPoultry(null);
                  }} style={{
                    padding: "12px 16px", borderRadius: 10, border: `1px solid ${COLORS.line}`,
                    background: "transparent", color: COLORS.ink, fontWeight: 500, fontSize: 14,
                    cursor: "pointer", textAlign: "left",
                  }}>{opt.label}</button>
                ))}
              </div>
              <button onClick={() => setAmbiguousPoultry(null)} style={{
                width: "100%", padding: 12, border: "none", background: "transparent",
                color: COLORS.inkMuted, fontWeight: 500, fontSize: 13, cursor: "pointer", marginTop: 14,
              }}>Annuler</button>
            </div>
          </div>
        )}

        {/* VIEWING SAVED SHOPPING LIST MODAL */}
        {viewingShoppingList && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(43,38,34,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            onClick={() => setViewingShoppingList(null)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: COLORS.cream, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 600,
              maxHeight: "85vh", overflowY: "auto", padding: "26px 22px 32px", border: `1px solid ${COLORS.line}`, borderBottom: "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 21, fontWeight: 500, fontFamily: "Georgia, serif" }}>{viewingShoppingList.label}</h2>
                <button onClick={() => setViewingShoppingList(null)} style={{ background: "transparent", border: `1px solid ${COLORS.line}`, borderRadius: "50%", width: 32, height: 32, fontSize: 16, cursor: "pointer", color: COLORS.inkSoft }}>×</button>
              </div>
              <p style={{ fontSize: 13, color: COLORS.inkMuted, marginBottom: 22 }}>Pour {viewingShoppingList.recipes.join(", ")}</p>

              {Object.entries(viewingShoppingList.list).map(([category, items]) => (
                <div key={category} style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, fontFamily: "Georgia, serif", color: "#4a5640" }}>{category}</div>
                  <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.line}`, overflow: "hidden" }}>
                    {items.map((item, i) => (
                      <div key={item.key} style={{
                        display: "flex", gap: 10, fontSize: 14, padding: "10px 14px",
                        borderBottom: i < items.length - 1 ? `1px solid ${COLORS.line}` : "none",
                      }}>
                        <span style={{ fontWeight: 600, color: COLORS.terracotta, minWidth: 90 }}>{item.qtyDisplay}</span>
                        <span style={{ color: COLORS.inkSoft }}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button onClick={() => setViewingShoppingList(null)} style={{
                width: "100%", padding: 14, borderRadius: 10, border: "none",
                background: COLORS.ink, color: "#fff", fontWeight: 500, fontSize: 14, cursor: "pointer", marginTop: 8,
              }}>Fermer</button>
            </div>
          </div>
        )}

        {/* FINAL SHOPPING LIST MODAL */}
        {showFinalList && (() => {
          const fullList = buildShoppingList(selected, recipeServings);
          const finalList = {};
          Object.entries(fullList).forEach(([cat, items]) => {
            const remaining = items.filter(item => !ownedIngredients[item.key]);
            if (remaining.length > 0) finalList[cat] = remaining;
          });
          const totalItems = Object.values(finalList).reduce((sum, items) => sum + items.length, 0);
          return (
            <div style={{ position: "fixed", inset: 0, background: "rgba(43,38,34,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
              onClick={() => setShowFinalList(false)}>
              <div onClick={e => e.stopPropagation()} style={{
                background: COLORS.cream, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 600,
                maxHeight: "85vh", overflowY: "auto", padding: "26px 22px 32px", border: `1px solid ${COLORS.line}`, borderBottom: "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <h2 style={{ margin: 0, fontSize: 21, fontWeight: 500, fontFamily: "Georgia, serif" }}>Liste finale</h2>
                  <button onClick={() => setShowFinalList(false)} style={{ background: "transparent", border: `1px solid ${COLORS.line}`, borderRadius: "50%", width: 32, height: 32, fontSize: 16, cursor: "pointer", color: COLORS.inkSoft }}>×</button>
                </div>
                <p style={{ fontSize: 13, color: COLORS.inkMuted, marginBottom: 22 }}>{totalItems} article{totalItems > 1 ? "s" : ""} à acheter</p>

                {totalItems === 0 ? (
                  <div style={{ textAlign: "center", padding: 30, color: COLORS.inkMuted, fontSize: 14 }}>
                    Tu as déjà tout ce qu'il te faut.
                  </div>
                ) : (
                  Object.entries(finalList).map(([category, items]) => (
                    <div key={category} style={{ marginBottom: 20 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, fontFamily: "Georgia, serif", color: "#4a5640" }}>{category}</div>
                      <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.line}`, overflow: "hidden" }}>
                        {items.map((item, i) => (
                          <div key={item.key} style={{
                            display: "flex", gap: 10, fontSize: 14, padding: "10px 14px",
                            borderBottom: i < items.length - 1 ? `1px solid ${COLORS.line}` : "none",
                          }}>
                            <span style={{ fontWeight: 600, color: COLORS.terracotta, minWidth: 90 }}>{item.qtyDisplay}</span>
                            <span style={{ color: COLORS.inkSoft }}>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}

                <button onClick={() => setShowFinalList(false)} style={{
                  width: "100%", padding: 14, borderRadius: 10, border: "none",
                  background: COLORS.ink, color: "#fff", fontWeight: 500, fontSize: 14, cursor: "pointer", marginTop: 8,
                }}>Fermer</button>
              </div>
            </div>
          );
        })()}

        {/* RECIPE DETAIL MODAL */}
        {detailRecipe && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(43,38,34,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            onClick={() => setDetailRecipe(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: COLORS.cream, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 600,
              maxHeight: "92vh", overflowY: "auto", border: `1px solid ${COLORS.line}`, borderBottom: "none",
            }}>
              <div style={{ padding: "24px 24px 0", position: "sticky", top: 0, background: COLORS.cream, zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <Pill tone="terracotta">{detailRecipe.category}</Pill>
                  <button onClick={() => setDetailRecipe(null)} style={{ background: "transparent", border: `1px solid ${COLORS.line}`, borderRadius: "50%", width: 32, height: 32, fontSize: 16, cursor: "pointer", color: COLORS.inkSoft, flexShrink: 0 }}>×</button>
                </div>
                <h2 style={{ margin: "10px 0 4px", fontSize: 24, fontWeight: 500, fontFamily: "Georgia, serif" }}>{detailRecipe.name}</h2>
                {detailRecipe.subtitle && <p style={{ margin: "0 0 12px", fontSize: 14, color: COLORS.inkMuted, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{detailRecipe.subtitle}</p>}
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: COLORS.inkSoft, paddingBottom: 18, borderBottom: `1px solid ${COLORS.line}`, fontFamily: "'Helvetica Neue', sans-serif" }}>
                  <span>{detailRecipe.prepTime + detailRecipe.cookTime} min</span>
                  <span>{detailRecipe.cookMethod === "four" ? `Four ${detailRecipe.temp}°C` : "À la poêle"}</span>
                  <span>{detailRecipe.servings} pers. de base</span>
                </div>
              </div>

              <div style={{ padding: "20px 24px 28px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.inkMuted }}>Personnes</span>
                  <ServingsControl value={detailServings} onChange={setDetailServings} />
                </div>

                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.inkMuted, marginBottom: 10 }}>Ingrédients</div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: 28 }}>
                  {detailRecipe.ingredients.map((ing, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, fontSize: 14, padding: "9px 0", borderBottom: i < detailRecipe.ingredients.length - 1 ? `1px solid ${COLORS.line}` : "none" }}>
                      <span style={{ fontWeight: 600, color: COLORS.terracotta, minWidth: 56 }}>
                        {scaleQty(ing.qty, detailRecipe.servings, detailServings)}{ing.unit}
                      </span>
                      <span style={{ color: COLORS.inkSoft }}>{ing.name}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.inkMuted, marginBottom: 10 }}>Préparation</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: detailRecipe.notes ? 28 : 24 }}>
                  {detailRecipe.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 14 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                        border: `1px solid ${COLORS.terracotta}`, color: COLORS.terracotta,
                        fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{i + 1}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: COLORS.inkSoft, paddingTop: 2 }}>{step}</div>
                    </div>
                  ))}
                </div>

                {detailRecipe.notes && detailRecipe.notes.length > 0 && (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.inkMuted, marginBottom: 10 }}>Notes</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                      {detailRecipe.notes.map((note, i) => (
                        <div key={i} style={{ fontSize: 13, lineHeight: 1.6, color: COLORS.inkSoft, paddingLeft: 14, borderLeft: `2px solid ${COLORS.gold}` }}>
                          {note}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <button onClick={() => { toggleSelect(detailRecipe); setDetailRecipe(null); }} style={{
                  width: "100%", padding: 15, borderRadius: 10, border: "none",
                  background: selected.find(r => r.id === detailRecipe.id) ? COLORS.line : COLORS.terracotta,
                  color: selected.find(r => r.id === detailRecipe.id) ? COLORS.inkSoft : "#fff",
                  fontWeight: 500, fontSize: 15, cursor: "pointer",
                }}>
                  {selected.find(r => r.id === detailRecipe.id) ? "Retirer du batch" : "Ajouter au batch"}
                </button>

                {/* Edit and delete buttons */}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => { setEditingRecipe(detailRecipe); }} style={{
                    flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${COLORS.line}`,
                    background: "transparent", color: COLORS.inkSoft, fontWeight: 500, fontSize: 14, cursor: "pointer",
                  }}>✏️ Modifier</button>
                  <button onClick={() => { setConfirmDelete({ type: "recipe", item: detailRecipe }); }} style={{
                    flex: 1, padding: 12, borderRadius: 10, border: "1px solid #f5c6c6",
                    background: "#fff5f5", color: "#c0392b", fontWeight: 500, fontSize: 14, cursor: "pointer",
                  }}>🗑️ Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ padding: "28px 24px 0", maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, fontFamily: "Georgia, serif", color: COLORS.ink, lineHeight: 1.2 }}>Le carnet de la maison</h1>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: COLORS.inkMuted, fontFamily: "Georgia, serif", fontStyle: "italic" }}>Recettes · Courses · Cuisine</p>
          </div>
          <div style={{ fontSize: 28 }}>🥘</div>
        </div>

        {/* Tabs — icon cards */}
        <div style={{ background: COLORS.cream, position: "sticky", top: 0, zIndex: 10, padding: "12px 16px 0", borderBottom: `1px solid ${COLORS.line}` }}>
          <div style={{ display: "flex", gap: 8, maxWidth: 700, margin: "0 auto", justifyContent: "space-between" }}>
            {[
              { key: "home",     label: "Accueil",  icon: "🏠" },
              { key: "select",   label: "Recettes", icon: "📖" },
              { key: "shopping", label: "Courses",  icon: "🛒", active: view === "shopping" || view === "batch" },
              { key: "plan",     label: "Cuisine",  icon: "👨‍🍳", active: view === "plan" },
              { key: "semaine",  label: "Semaine",  icon: "📅" },
              { key: "history",  label: "Archives", icon: "🕐" },
            ].map((tab) => {
              const isActive = tab.active !== undefined ? tab.active : view === tab.key;
              const isDisabled = tab.disabled;
              const handleClick = () => {
                if (isDisabled) return;
                if (tab.key === "plan") { setBatchPlan(generateBatchPlan(selected, recipeServings)); setView("plan"); return; }
                if (tab.key === "shopping" && view !== "shopping" && view !== "batch") {
                  setView(weekStatus === "planning" ? "batch" : "shopping");
                } else {
                  setView(tab.key);
                }
              };
              return (
                <button key={tab.key} onClick={handleClick} style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: "8px 4px 10px", border: "none", borderRadius: "12px 12px 0 0",
                  background: isActive ? COLORS.card : "transparent",
                  boxShadow: isActive ? `0 -2px 8px rgba(0,0,0,0.06)` : "none",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  borderBottom: isActive ? `2px solid ${COLORS.terracotta}` : "2px solid transparent",
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 20, filter: isDisabled ? "grayscale(1) opacity(0.3)" : isActive ? "none" : "opacity(0.5)" }}>{tab.icon}</span>
                  <span style={{
                    fontSize: 10, fontWeight: isActive ? 600 : 400, letterSpacing: "0.02em",
                    color: isDisabled ? COLORS.line : isActive ? COLORS.terracotta : COLORS.inkMuted,
                    fontFamily: "'Helvetica Neue', sans-serif",
                  }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 24px 80px", fontFamily: "'Helvetica Neue', sans-serif" }}>

          {/* HOME VIEW — entry point showing where the person is in the journey */}
          {view === "home" && (
            <div>
              {weekStatus === "idle" && (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 10 }}>Prête à commencer ?</div>
                  <h2 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 500, fontFamily: "Georgia, serif" }}>Aucune semaine en cours</h2>
                  <p style={{ fontSize: 14, color: COLORS.inkMuted, marginBottom: 28, maxWidth: 420, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                    Choisis tes recettes pour la semaine, génère la liste de courses, puis reviens quand tu es prête à cuisiner — aucune urgence à tout faire d'un coup.
                  </p>
                  <button onClick={() => setView("select")} style={{
                    padding: "13px 26px", borderRadius: 10, border: "none",
                    background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 15, cursor: "pointer",
                  }}>Choisir les recettes</button>
                </div>
              )}

              {weekStatus === "planning" && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 10 }}>Étape 1 sur 3 — planification</div>
                  <h2 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 500, fontFamily: "Georgia, serif" }}>Semaine en cours de préparation</h2>
                  <p style={{ fontSize: 14, color: COLORS.inkMuted, marginBottom: 24, lineHeight: 1.6 }}>
                    {selected.length} plat{selected.length > 1 ? "s" : ""} sélectionné{selected.length > 1 ? "s" : ""}. Ajoute d'autres recettes ou passe à la liste de courses quand tu es prête.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                    {selected.map(r => (
                      <div key={r.id} style={{ background: COLORS.card, borderRadius: 10, padding: "12px 16px", border: `1px solid ${COLORS.line}`, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                        <span style={{ fontFamily: "Georgia, serif", fontWeight: 600 }}>{r.name}</span>
                        <span style={{ color: COLORS.inkMuted }}>{recipeServings[r.id] || r.servings} pers.</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setView("select")} style={{
                    width: "100%", padding: 14, borderRadius: 10, border: `1px solid ${COLORS.ink}`,
                    background: "transparent", color: COLORS.ink, fontWeight: 500, fontSize: 14, cursor: "pointer", marginBottom: 10,
                  }}>Ajouter des recettes</button>
                  <button onClick={() => setView("batch")} style={{
                    width: "100%", padding: 14, borderRadius: 10, border: "none",
                    background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 14, cursor: "pointer",
                  }}>Continuer vers les courses</button>
                </div>
              )}

              {weekStatus === "shopping" && activeShoppingList && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 10 }}>Étape 2 sur 3 — courses</div>
                  <h2 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 500, fontFamily: "Georgia, serif" }}>Liste de courses prête</h2>
                  <p style={{ fontSize: 14, color: COLORS.inkMuted, marginBottom: 24, lineHeight: 1.6 }}>
                    Pour {activeShoppingList.recipes.map(r => r.name).join(", ")}. Reviens ici une fois les courses faites.
                  </p>
                  <button onClick={() => setView("shopping")} style={{
                    width: "100%", padding: 14, borderRadius: 10, border: `1px solid ${COLORS.ink}`,
                    background: "transparent", color: COLORS.ink, fontWeight: 500, fontSize: 14, cursor: "pointer", marginBottom: 10,
                  }}>Voir la liste de courses</button>
                  <button onClick={() => { setWeekStatus("cooking"); }} style={{
                    width: "100%", padding: 14, borderRadius: 10, border: "none",
                    background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 14, cursor: "pointer",
                  }}>Courses faites — passer à la cuisine</button>
                </div>
              )}

              {weekStatus === "cooking" && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 10 }}>Étape 3 sur 3 — cuisine</div>
                  <h2 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 500, fontFamily: "Georgia, serif" }}>Prête à cuisiner</h2>
                  <p style={{ fontSize: 14, color: COLORS.inkMuted, marginBottom: 24, lineHeight: 1.6 }}>
                    Les courses sont faites. Lance le plan de cuisson pour {selected.length} plat{selected.length > 1 ? "s" : ""} en parallèle.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                    {selected.map(r => (
                      <div key={r.id} style={{ background: COLORS.card, borderRadius: 10, padding: "12px 16px", border: `1px solid ${COLORS.line}`, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                        <span style={{ fontFamily: "Georgia, serif", fontWeight: 600 }}>{r.name}</span>
                        <span style={{ color: COLORS.inkMuted }}>{recipeServings[r.id] || r.servings} pers.</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setBatchPlan(generateBatchPlan(selected, recipeServings)); setView("plan"); }} style={{
                    width: "100%", padding: 15, borderRadius: 10, border: "none",
                    background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 15, cursor: "pointer",
                  }}>Lancer le plan de cuisson</button>
                </div>
              )}

              {weekHistory.length > 0 && (
                <button onClick={() => setView("history")} style={{
                  width: "100%", padding: 13, border: "none", background: "transparent",
                  color: COLORS.inkMuted, fontWeight: 500, fontSize: 13, cursor: "pointer", marginTop: 24,
                }}>Voir l'historique ({weekHistory.length} semaine{weekHistory.length > 1 ? "s" : ""})</button>
              )}
            </div>
          )}

          {/* SELECT VIEW */}
          {view === "select" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 0, flex: 1 }}>
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => { setFilterCat(cat); setFilterReste(null); }} style={{
                      padding: "7px 15px", borderRadius: 20, whiteSpace: "nowrap", fontSize: 13, cursor: "pointer",
                      border: `1px solid ${filterCat === cat && !filterReste ? COLORS.ink : COLORS.line}`,
                      background: filterCat === cat && !filterReste ? COLORS.ink : "transparent",
                      color: filterCat === cat && !filterReste ? "#fff" : COLORS.inkSoft, fontWeight: 500,
                    }}>{cat}</button>
                  ))}
                </div>
                <button onClick={() => setView("add")} style={{
                  flexShrink: 0, marginLeft: 12, padding: "7px 14px", borderRadius: 20, border: "none",
                  background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 13, cursor: "pointer",
                }}>+ Recette</button>
              </div>

              {/* Reste banner */}
              {allResteTags.length > 0 && (
                <div style={{ background: COLORS.goldSoft, borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#7a5a1f", marginBottom: 10 }}>
                    🍱 J'ai des restes de...
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {allResteTags.map(tag => (
                      <button key={tag} onClick={() => {
                        setFilterReste(filterReste === tag ? null : tag);
                        setFilterCat("Tous");
                      }} style={{
                        padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 13,
                        background: filterReste === tag ? "#7a5a1f" : "#fff",
                        color: filterReste === tag ? "#fff" : "#7a5a1f",
                        fontWeight: 500, cursor: "pointer",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                      }}>{tag}</button>
                    ))}
                    {filterReste && (
                      <button onClick={() => setFilterReste(null)} style={{
                        padding: "6px 14px", borderRadius: 20, border: `1px solid ${COLORS.line}`,
                        background: "transparent", color: COLORS.inkMuted, fontSize: 13, cursor: "pointer",
                      }}>✕ Effacer</button>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {filtered.map((recipe, idx) => {
                  const isSelected = !!selected.find((r) => r.id === recipe.id);
                  return (
                    <div key={recipe.id} style={{
                      background: COLORS.card, padding: "18px 4px",
                      display: "flex", alignItems: "center", gap: 16,
                      borderTop: idx === 0 ? `1px solid ${COLORS.line}` : "none",
                      borderBottom: `1px solid ${COLORS.line}`,
                    }}>
                      <div onClick={() => setDetailRecipe(recipe) || setDetailServings(recipe.servings)} style={{ flex: 1, cursor: "pointer", minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                          <span style={{ fontWeight: 600, fontSize: 16, fontFamily: "Georgia, serif" }}>{recipe.name}</span>
                        </div>
                        {recipe.subtitle && <div style={{ fontSize: 13, color: COLORS.inkMuted, fontStyle: "italic", fontFamily: "Georgia, serif", marginBottom: 6 }}>{recipe.subtitle}</div>}
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {recipe.resteTags
                            ? recipe.resteTags.map(tag => <Pill key={tag} tone="gold">Restes de {tag}</Pill>)
                            : <Pill tone="terracotta">{recipe.category}</Pill>
                          }
                          <span style={{ fontSize: 12, color: COLORS.inkMuted }}>{recipe.prepTime + recipe.cookTime} min</span>
                        </div>
                      </div>
                      <button onClick={() => toggleSelect(recipe)} style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        border: `1px solid ${isSelected ? COLORS.terracotta : COLORS.line}`,
                        background: isSelected ? COLORS.terracotta : "transparent",
                        color: isSelected ? "#fff" : COLORS.inkSoft,
                        fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{isSelected ? "✓" : "+"}</button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* BATCH VIEW */}
          {view === "batch" && (
            <div>
              {selected.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 8, fontFamily: "Georgia, serif" }}>Aucun plat sélectionné</div>
                  <div style={{ fontSize: 14, color: COLORS.inkMuted, marginBottom: 24 }}>Choisis des recettes dans l'onglet Recettes</div>
                  <button onClick={() => setView("select")} style={{
                    padding: "12px 22px", borderRadius: 10, border: "none",
                    background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 14, cursor: "pointer",
                  }}>Voir les recettes</button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {selected.map(recipe => {
                      const srv = recipeServings[recipe.id] || recipe.servings;
                      return (
                        <div key={recipe.id} style={{ background: COLORS.card, borderRadius: 14, padding: 18, border: `1px solid ${COLORS.line}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: 15, fontFamily: "Georgia, serif" }}>{recipe.name}</div>
                              <div style={{ fontSize: 12, color: COLORS.inkMuted }}>{recipe.prepTime + recipe.cookTime} min</div>
                            </div>
                            <button onClick={() => toggleSelect(recipe)} style={{
                              background: "transparent", border: `1px solid ${COLORS.line}`, borderRadius: "50%",
                              width: 28, height: 28, fontSize: 14, cursor: "pointer", color: COLORS.inkMuted,
                            }}>×</button>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${COLORS.line}` }}>
                            <span style={{ fontSize: 12, color: COLORS.inkMuted, fontWeight: 500 }}>Personnes</span>
                            <ServingsControl
                              value={srv}
                              onChange={(v) => setRecipeServings(prev => ({ ...prev, [recipe.id]: v }))}
                              compact
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ background: COLORS.sageSoft, borderRadius: 12, padding: 18, marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4a5640", marginBottom: 10 }}>Résumé</div>
                    {selected.map(r => (
                      <div key={r.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#3f4a37", padding: "3px 0" }}>
                        <span>{r.name}</span>
                        <span>{recipeServings[r.id] || r.servings} pers.</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 13, color: "#3f4a37", marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                      Temps de cuisine estimé — {totalTime} min
                    </div>
                  </div>

                  <button onClick={async () => {
                    const fullList = buildShoppingList(selected, recipeServings);
                    const newList = {
                      date: new Date().toLocaleDateString("fr-FR"),
                      label: `Courses du ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`,
                      recipes: selected.map(r => ({ id: r.id, name: r.name, servings: recipeServings[r.id] || r.servings })),
                      list: fullList,
                    };
                    setActiveShoppingList(newList);
                    setOwnedIngredients({});
                    setWeekStatus("shopping");
                    setView("shopping");
                    try {
                      const saved = await db.insert("shopping_lists", {
                        label: newList.label, date: newList.date,
                        recipes: newList.recipes, list: newList.list,
                      });
                      if (saved && saved[0]) setSavedShoppingLists(prev => [...prev, { ...newList, dbId: saved[0].id }]);
                    } catch (e) { console.error("Save shopping list error:", e); }
                  }} style={{
                    width: "100%", padding: 15, borderRadius: 10, border: "none",
                    background: COLORS.terracotta, color: "#fff", fontWeight: 500, fontSize: 15, cursor: "pointer", marginBottom: 10,
                  }}>Générer la liste de courses</button>

                  <div style={{ fontSize: 12, color: COLORS.inkMuted, textAlign: "center", marginBottom: 20, lineHeight: 1.5 }}>
                    Tu pourras lancer le plan de cuisson plus tard, une fois les courses faites
                  </div>
                </>
              )}
            </div>
          )}

          {/* SHOPPING VIEW — the list to take to the store, revisited over several days */}
          {view === "shopping" && activeShoppingList && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 6 }}>Étape 2 sur 3</div>
                <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, fontFamily: "Georgia, serif" }}>Liste de courses</h2>
                <p style={{ fontSize: 14, color: COLORS.inkMuted, margin: 0 }}>Pour {activeShoppingList.recipes.map(r => r.name).join(", ")}</p>
              </div>

              <div style={{ background: COLORS.card, borderRadius: 14, padding: 20, marginBottom: 20, border: `1px solid ${COLORS.line}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.inkMuted }}>À acheter</div>
                  <div style={{ fontSize: 12, color: COLORS.inkMuted }}>par rayon</div>
                </div>
                {Object.entries(activeShoppingList.list).map(([category, items], catIdx) => (
                  <div key={category} style={{ marginTop: 18, paddingTop: catIdx === 0 ? 14 : 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 9, fontFamily: "Georgia, serif", color: "#4a5640" }}>{category}</div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {items.map((item, i) => {
                        const owned = !!ownedIngredients[item.key];
                        return (
                          <div key={item.key} onClick={() => setOwnedIngredients(prev => ({ ...prev, [item.key]: !prev[item.key] }))} style={{
                            display: "flex", gap: 10, fontSize: 13, padding: "8px 0",
                            borderBottom: i < items.length - 1 ? `1px solid ${COLORS.line}` : "none",
                            alignItems: "baseline", cursor: "pointer", opacity: owned ? 0.4 : 1,
                          }}>
                            <span style={{
                              width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
                              border: `1.5px solid ${owned ? COLORS.sage : COLORS.line}`,
                              background: owned ? COLORS.sage : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff",
                            }}>{owned ? "✓" : ""}</span>
                            <span style={{ fontWeight: 600, color: COLORS.terracotta, minWidth: 90, flexShrink: 0, textDecoration: owned ? "line-through" : "none" }}>{item.qtyDisplay}</span>
                            <span style={{ flex: 1, color: COLORS.inkSoft, textDecoration: owned ? "line-through" : "none" }}>{item.name}</span>
                            <span style={{ fontSize: 11, color: COLORS.inkMuted, fontStyle: "italic" }}>{item.recipeName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Manual items section */}
              <div style={{ background: COLORS.card, borderRadius: 14, padding: 18, marginBottom: 16, border: `1px solid ${COLORS.line}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.inkMuted, marginBottom: 12 }}>
                  Ajouter un article
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: manualItems.length > 0 ? 14 : 0 }}>
                  <input
                    value={manualInput}
                    onChange={e => setManualInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && manualInput.trim()) {
                        setManualItems(prev => [...prev, { key: `manual-${Date.now()}`, name: manualInput.trim(), done: false }]);
                        setManualInput("");
                      }
                    }}
                    placeholder="Ex. lessive, shampooing..."
                    style={{
                      flex: 1, padding: "10px 13px", borderRadius: 10,
                      border: `1px solid ${COLORS.line}`, fontSize: 14,
                      background: COLORS.cream, fontFamily: "inherit",
                    }}
                  />
                  <button onClick={() => {
                    if (manualInput.trim()) {
                      setManualItems(prev => [...prev, { key: `manual-${Date.now()}`, name: manualInput.trim(), done: false }]);
                      setManualInput("");
                    }
                  }} style={{
                    padding: "10px 16px", borderRadius: 10, border: "none",
                    background: COLORS.terracotta, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", flexShrink: 0,
                  }}>+</button>
                </div>
                {manualItems.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {manualItems.map((item, i) => (
                      <div key={item.key} style={{
                        display: "flex", gap: 10, padding: "8px 0", alignItems: "center",
                        borderBottom: i < manualItems.length - 1 ? `1px solid ${COLORS.line}` : "none",
                        opacity: item.done ? 0.4 : 1,
                      }}>
                        <span onClick={() => setManualItems(prev => prev.map(it => it.key === item.key ? { ...it, done: !it.done } : it))} style={{
                          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                          border: `1.5px solid ${item.done ? COLORS.sage : COLORS.line}`,
                          background: item.done ? COLORS.sage : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, color: "#fff", cursor: "pointer",
                        }}>{item.done ? "✓" : ""}</span>
                        <span style={{ flex: 1, fontSize: 14, color: COLORS.inkSoft, textDecoration: item.done ? "line-through" : "none" }}>{item.name}</span>
                        <button onClick={() => setManualItems(prev => prev.filter(it => it.key !== item.key))} style={{
                          background: "transparent", border: "none", color: COLORS.inkMuted,
                          fontSize: 16, cursor: "pointer", padding: "0 4px",
                        }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => {
                setSavedShoppingLists(prev => [...prev, activeShoppingList]);
                setWeekStatus("cooking");
                setView("home");
              }} style={{
                width: "100%", padding: 15, borderRadius: 10, border: "none",
                background: COLORS.ink, color: "#fff", fontWeight: 500, fontSize: 15, cursor: "pointer", marginBottom: 10,
              }}>Courses terminées</button>
              <div style={{ fontSize: 12, color: COLORS.inkMuted, textAlign: "center", lineHeight: 1.5 }}>
                Reviens quand tu es prête à cuisiner — la liste reste disponible ici
              </div>
            </div>
          )}

          {/* PLAN VIEW */}
          {view === "plan" && batchPlan.length > 0 && (
            <>
              <button onClick={() => setView("home")} style={{
                background: "transparent", border: "none", color: COLORS.inkMuted,
                fontSize: 13, cursor: "pointer", marginBottom: 18, padding: 0,
              }}>← Retour à l'accueil</button>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 6 }}>Étape 3 sur 3 — session de cuisine</div>
                <div style={{ fontSize: 26, fontWeight: 500, fontFamily: "Georgia, serif" }}>{totalTime} minutes au total</div>
                <div style={{ fontSize: 14, color: COLORS.inkMuted, marginTop: 4 }}>{selected.length} plat{selected.length > 1 ? "s" : ""} en parallèle</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
                {batchPlan.map((step, i) => (
                  <div key={i} onClick={() => setExpandedStep(expandedStep === i ? null : i)} style={{
                    background: COLORS.card, borderRadius: 12, overflow: "hidden", cursor: "pointer", border: `1px solid ${COLORS.line}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px" }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%", border: `1px solid ${COLORS.terracotta}`, color: COLORS.terracotta,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0,
                      }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{step.label}</div>
                        {step.time > 0 && <div style={{ fontSize: 12, color: COLORS.inkMuted }}>à {step.time} min</div>}
                      </div>
                      <span style={{ color: COLORS.inkMuted, fontSize: 12 }}>{expandedStep === i ? "−" : "+"}</span>
                    </div>
                    {expandedStep === i && step.prepItems && (
                      <div style={{ padding: "4px 18px 16px 58px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: "left", fontWeight: 600, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.inkMuted, paddingBottom: 8, paddingRight: 12, borderBottom: `1px solid ${COLORS.line}`, width: "30%" }}>Ingrédient</th>
                              <th style={{ textAlign: "left", fontWeight: 600, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.inkMuted, paddingBottom: 8, paddingRight: 12, borderBottom: `1px solid ${COLORS.line}`, whiteSpace: "nowrap" }}>Quantité</th>
                              <th style={{ textAlign: "left", fontWeight: 600, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.inkMuted, paddingBottom: 8, borderBottom: `1px solid ${COLORS.line}` }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {step.prepItems.map((item, ii) =>
                              item.actionLines.map((a, k) => (
                                <tr key={`${item.ingredient}-${k}`}>
                                  {k === 0 && (
                                    <td rowSpan={item.actionLines.length} style={{
                                      verticalAlign: "top", paddingTop: 10, paddingRight: 10, paddingBottom: 10,
                                      borderBottom: `1px solid ${COLORS.line}`, fontWeight: 600,
                                      fontFamily: "Georgia, serif", color: COLORS.terracotta,
                                    }}>{item.ingredient}</td>
                                  )}
                                  <td style={{ verticalAlign: "top", padding: "10px 10px 10px 0", borderBottom: `1px solid ${COLORS.line}`, fontWeight: 600, color: COLORS.ink, whiteSpace: "nowrap" }}>
                                    {a.qty}
                                  </td>
                                  <td style={{ verticalAlign: "top", padding: "10px 0", borderBottom: `1px solid ${COLORS.line}`, color: COLORS.ink }}>
                                    <div>{a.action}</div>
                                    {a.recipeNames.length > 1 && (
                                      <div style={{ fontSize: 11, color: COLORS.inkMuted, fontStyle: "italic", marginTop: 2 }}>
                                        {a.recipeNames.join(", ")}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {expandedStep === i && step.assemblyItems && (
                      <div style={{ padding: "4px 18px 16px 58px", display: "flex", flexDirection: "column", gap: 16 }}>
                        {step.assemblyItems.map((r, j) => (
                          <div key={j}>
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                              <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.terracotta, fontFamily: "Georgia, serif" }}>{r.recipeName}</span>
                              <span style={{ fontSize: 11, color: COLORS.inkMuted }}>{r.cookTime} min{r.temp ? ` à ${r.temp}°C` : ""}</span>
                            </div>
                            {r.marinadeNote && (
                              <div style={{ fontSize: 12, color: "#7a5a1f", background: COLORS.goldSoft, borderRadius: 8, padding: "7px 10px", marginBottom: 8, lineHeight: 1.5 }}>
                                {r.marinadeNote}
                              </div>
                            )}
                            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                              {r.assembly.map((step2, k) => (
                                <div key={k} style={{ display: "flex", gap: 8, fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.5 }}>
                                  <span style={{ color: COLORS.inkMuted, fontSize: 11, flexShrink: 0 }}>{k + 1}.</span>
                                  <span>{step2}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {expandedStep === i && step.detail && (
                      <div style={{ padding: "0 18px 16px 58px", fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.8, whiteSpace: "pre-line" }}>{step.detail}</div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16, marginBottom: 24, fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.8 }}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: COLORS.ink }}>Conseils</div>
                Prépare tous les contenants avant de commencer. Étiquette chaque boîte avec le nom et la date. Réfrigérateur — 3 à 4 jours. Congélateur — 3 mois.
              </div>

              <button onClick={async () => {
                const newEntry = {
                  recipes: selected.map(r => ({ id: r.id, name: r.name, servings: recipeServings[r.id] || r.servings })),
                  date: new Date().toLocaleDateString("fr-FR"),
                  week: `Semaine ${Math.ceil(new Date().getDate() / 7)} — ${new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`,
                };
                setWeekHistory(prev => [...prev, newEntry]);
                setWeekStatus("idle");
                setActiveShoppingList(null);
                setShowSuggestion(true);
                try {
                  await db.insert("week_history", {
                    week_label: newEntry.week,
                    date: newEntry.date,
                    recipes: newEntry.recipes,
                  });
                } catch (e) { console.error("Save week error:", e); }
              }} style={{
                width: "100%", padding: 15, borderRadius: 10, border: "none",
                background: COLORS.ink, color: "#fff", fontWeight: 500, fontSize: 15, cursor: "pointer",
              }}>Terminé — valider la semaine</button>
            </>
          )}


          {view === "semaine" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 500, fontFamily: "Georgia, serif" }}>Ma semaine</h2>
                <p style={{ fontSize: 13, color: COLORS.inkMuted, margin: 0 }}>Appuie sur un jour pour choisir le plat</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 20 }}>
                {["Lun","Mar","Mer","Jeu","Ven"].map(day => (
                  <div key={day}>
                    <div style={{ fontSize: 11, color: COLORS.inkMuted, textAlign: "center", marginBottom: 6, fontWeight: 500 }}>{day}</div>
                    <div onClick={() => setPlanPickingDay(planPickingDay === day ? null : day)} style={{
                      minHeight: 88, borderRadius: 12,
                      border: "1.5px " + (planPickingDay === day ? "solid " + COLORS.terracotta : weekPlan[day] ? "solid " + COLORS.line : "dashed " + COLORS.line),
                      background: planPickingDay === day ? COLORS.terracottaSoft : weekPlan[day] ? COLORS.card : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", padding: 6,
                    }}>
                      {weekPlan[day] ? (
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 22, marginBottom: 3 }}>
                            {weekPlan[day].category === "Poulet" ? "🍗" : weekPlan[day].category === "Boeuf" ? "🥩" : weekPlan[day].category === "Porc" ? "🐷" : "🍽️"}
                          </div>
                          <div style={{ fontSize: 9, fontWeight: 500, color: COLORS.ink, lineHeight: 1.3 }}>
                            {weekPlan[day].name.length > 12 ? weekPlan[day].name.slice(0,11) + "…" : weekPlan[day].name}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: 20, color: COLORS.line }}>+</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {planPickingDay && (
                <div style={{ background: COLORS.card, borderRadius: 16, border: "1px solid " + COLORS.line, marginBottom: 16, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid " + COLORS.line, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Que manges-tu {planPickingDay} ?</span>
                    <button onClick={() => setPlanPickingDay(null)} style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.inkMuted }}>×</button>
                  </div>
                  {weekPlan[planPickingDay] && (
                    <div onClick={() => { setWeekPlan(prev => ({ ...prev, [planPickingDay]: null })); setPlanPickingDay(null); }}
                      style={{ padding: "12px 16px", fontSize: 13, color: "#c0392b", borderBottom: "1px solid " + COLORS.line, cursor: "pointer" }}>
                      Retirer ce plat
                    </div>
                  )}
                  {selected.length === 0 ? (
                    <div style={{ padding: 16, fontSize: 13, color: COLORS.inkMuted }}>Sélectionne des recettes dans Recettes d'abord</div>
                  ) : selected.map(r => (
                    <div key={r.id} onClick={() => { setWeekPlan(prev => ({ ...prev, [planPickingDay]: r })); setPlanPickingDay(null); }}
                      style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", borderBottom: "1px solid " + COLORS.line,
                        background: weekPlan[planPickingDay] && weekPlan[planPickingDay].id === r.id ? COLORS.terracottaSoft : "transparent" }}>
                      <span style={{ fontSize: 22 }}>{r.category === "Poulet" ? "🍗" : r.category === "Boeuf" ? "🥩" : r.category === "Porc" ? "🐷" : "🍽️"}</span>
                      <span style={{ fontSize: 14, fontFamily: "Georgia, serif", fontWeight: 500, flex: 1 }}>{r.name}</span>
                      {weekPlan[planPickingDay] && weekPlan[planPickingDay].id === r.id && <span style={{ color: COLORS.terracotta }}>✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HISTORY VIEW */}
          {view === "history" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 6 }}>Archives</div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 500, fontFamily: "Georgia, serif" }}>Semaines et courses passées</h2>
              </div>

              {weekHistory.length === 0 && savedShoppingLists.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px 20px", color: COLORS.inkMuted, fontSize: 14 }}>
                  Rien d'enregistré pour l'instant. Valide une semaine pour commencer ton historique.
                </div>
              ) : (
                <>
                  {weekHistory.length > 0 && (
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.inkMuted, marginBottom: 12 }}>Menus de la semaine</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[...weekHistory].reverse().map((entry, i) => (
                          <div key={i} style={{ background: COLORS.card, borderRadius: 14, padding: 18, border: `1px solid ${COLORS.line}` }}>
                            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 10 }}>{entry.week}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                              {entry.recipes.map((r, j) => (
                                <div key={j} style={{ display: "flex", alignItems: "center", fontSize: 14, color: COLORS.inkSoft }}>
                                  <span style={{ flex: 1, fontFamily: "Georgia, serif" }}>{r.name}</span>
                                  <span style={{ fontSize: 12, color: COLORS.inkMuted }}>{r.servings} pers.</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {savedShoppingLists.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.inkMuted, marginBottom: 12 }}>Listes de courses générées</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[...savedShoppingLists].reverse().map((entry, i) => {
                          const itemCount = Object.values(entry.list).reduce((sum, items) => sum + items.length, 0);
                          const recipeNames = entry.recipes ? entry.recipes.map(r => typeof r === "string" ? r : r.name).join(", ") : "";
                          return (
                            <div key={i} style={{
                              background: COLORS.card, borderRadius: 14, padding: 18, border: `1px solid ${COLORS.line}`,
                              display: "flex", alignItems: "center", gap: 14,
                            }}>
                              <div onClick={() => setViewingShoppingList(entry)} style={{ flex: 1, cursor: "pointer" }}>
                                <div style={{ fontWeight: 600, fontSize: 15, fontFamily: "Georgia, serif", marginBottom: 4 }}>{entry.label}</div>
                                <div style={{ fontSize: 12, color: COLORS.inkMuted }}>{itemCount} article{itemCount > 1 ? "s" : ""} · {recipeNames}</div>
                              </div>
                              <button onClick={e => { e.stopPropagation(); setConfirmDelete({ type: "list", item: entry }); }} style={{
                                background: "#fff5f5", border: "1px solid #f5c6c6", borderRadius: 8,
                                padding: "6px 10px", color: "#c0392b", fontSize: 13, cursor: "pointer",
                              }}>🗑️</button>
                              <span onClick={() => setViewingShoppingList(entry)} style={{ color: COLORS.inkMuted, fontSize: 18, cursor: "pointer" }}>›</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ADD VIEW */}
          {view === "add" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.terracotta, marginBottom: 6 }}>Nouvelle recette</div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 500, fontFamily: "Georgia, serif" }}>Ajouter au carnet</h2>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Nom de la recette</label>
                <input value={newRecipe.name} onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                  placeholder="Ex. Poulet rôti" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Catégorie</label>
                <input value={newRecipe.category} onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
                  placeholder="Ex. Poulet, Boeuf, Légumes" style={inputStyle} />
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                {[{ label: "Préparation, min", key: "prepTime" }, { label: "Cuisson, min", key: "cookTime" }, { label: "Portions", key: "servings" }].map(({ label, key }) => (
                  <div key={key} style={{ flex: 1 }}>
                    <label style={labelStyle}>{label}</label>
                    <input type="number" value={newRecipe[key]} onChange={(e) => setNewRecipe({ ...newRecipe, [key]: e.target.value })} style={inputStyle} />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Mode de cuisson</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["feux", "four"].map((m) => (
                    <button key={m} onClick={() => setNewRecipe({ ...newRecipe, cookMethod: m })} style={{
                      flex: 1, padding: "11px", borderRadius: 10, fontWeight: 500, fontSize: 14, cursor: "pointer",
                      border: `1px solid ${newRecipe.cookMethod === m ? COLORS.ink : COLORS.line}`,
                      background: newRecipe.cookMethod === m ? COLORS.ink : "transparent",
                      color: newRecipe.cookMethod === m ? "#fff" : COLORS.inkSoft,
                    }}>{m === "feux" ? "À la poêle" : "Au four"}</button>
                  ))}
                </div>
              </div>

              {newRecipe.cookMethod === "four" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Température, °C</label>
                  <input type="number" value={newRecipe.temp} onChange={(e) => setNewRecipe({ ...newRecipe, temp: e.target.value })}
                    placeholder="180" style={inputStyle} />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Ingrédients — un par ligne, ex. 300g de poulet</label>
                <textarea value={newRecipe.ingredients} onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                  placeholder={"300g de poulet\n150g de carottes\n1L de bouillon"} rows={5}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Étapes — une par ligne</label>
                <textarea value={newRecipe.steps} onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })}
                  placeholder={"Faire revenir le poulet\nAjouter les légumes\nMijoter 20 min"} rows={5}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <button onClick={addRecipe} style={{
                width: "100%", padding: 15, borderRadius: 10, border: "none",
                background: newRecipe.name && newRecipe.category ? COLORS.terracotta : COLORS.line,
                color: newRecipe.name && newRecipe.category ? "#fff" : COLORS.inkMuted,
                fontWeight: 500, fontSize: 15, cursor: newRecipe.name && newRecipe.category ? "pointer" : "not-allowed",
              }}>Ajouter au carnet</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
