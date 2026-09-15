export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: "Configuration Supabase manquante"
      });
    }

    // LISTER LES ÉQUIPES
    if (req.method === "GET") {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/teams?select=id,event_id,category_id,club_id,name,team_number,clubs(name),categories(name)&order=name.asc`,
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

    // AJOUTER UNE ÉQUIPE
    if (req.method === "POST") {
      const {
        name,
        club_id,
        category_id,
        team_number
      } = req.body || {};

      if (!name || !club_id || !category_id) {
        return res.status(400).json({
          error: "Nom, club et catégorie obligatoires"
        });
      }

      const response = await fetch(
        `${supabaseUrl}/rest/v1/teams`,
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
            club_id: Number(club_id),
            category_id: Number(category_id),
            name: name.trim(),
            team_number: team_number ? Number(team_number) : 1
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
