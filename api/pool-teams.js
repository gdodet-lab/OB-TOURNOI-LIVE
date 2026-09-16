export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: "Configuration Supabase manquante"
      });
    }

    // LISTER LES ÉQUIPES AFFECTÉES AUX POULES
    if (req.method === "GET") {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/pool_teams?select=id,pool_id,team_id,teams(id,name),pools(id,name)&order=id.asc`,
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
// AFFECTER UNE ÉQUIPE À UNE POULE
if (req.method === "POST") {
  const { pool_id, team_id } = req.body || {};

  if (!pool_id || !team_id) {
    return res.status(400).json({
      error: "Poule et équipe obligatoires"
    });
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/pool_teams`,
    {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        pool_id: Number(pool_id),
        team_id: Number(team_id)
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
