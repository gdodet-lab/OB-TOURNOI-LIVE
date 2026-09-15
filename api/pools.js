export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: "Configuration Supabase manquante"
      });
    }

    // LISTER LES POULES
    if (req.method === "GET") {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/pools?select=id,event_id,category_id,pitch_id,name,phase,start_time&order=id.asc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: "Erreur Supabase",
          details: data
        });
      }

      return res.status(200).json(data);
    }
// AJOUTER UNE POULE
if (req.method === "POST") {
  const { category_id, pitch_id, name, phase, start_time } = req.body || {};

  if (!category_id || !pitch_id || !name || !name.trim()) {
    return res.status(400).json({
      error: "Catégorie, terrain et nom de la poule obligatoires"
    });
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/pools`,
    {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        event_id: 1,
        category_id: Number(category_id),
        pitch_id: Number(pitch_id),
        name: name.trim(),
        phase: phase || "morning",
        start_time: start_time || null
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({
      error: "Erreur Supabase",
      details: data
    });
  }

  return res.status(201).json(data);
}
    
    return res.status(405).json({
      error: "Méthode non autorisée"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erreur serveur",
      details: error.message
    });
  }
}
