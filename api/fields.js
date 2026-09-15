export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: "Configuration Supabase manquante"
      });
    }

    // LISTER LES TERRAINS
    if (req.method === "GET") {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/fields?select=id,event_id,name,display_order&order=display_order.asc`,
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

    // AJOUTER UN TERRAIN
    if (req.method === "POST") {
      const { name, display_order } = req.body || {};

      if (!name || !name.trim()) {
        return res.status(400).json({
          error: "Nom du terrain obligatoire"
        });
      }

      const response = await fetch(
        `${supabaseUrl}/rest/v1/fields`,
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
            name: name.trim(),
            display_order: display_order
              ? Number(display_order)
              : 1
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
// MODIFIER UN TERRAIN
if (req.method === "PATCH") {
  const { id, name } = req.body || {};

  if (!id || !name || !name.trim()) {
    return res.status(400).json({
      error: "ID et nom du terrain obligatoires"
    });
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/fields?id=eq.${Number(id)}`,
    {
      method: "PATCH",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        name: name.trim()
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

  return res.status(200).json(data);
}
// SUPPRIMER UN TERRAIN
if (req.method === "DELETE") {
  const { id } = req.body || {};

  if (!id) {
    return res.status(400).json({
      error: "ID du terrain obligatoire"
    });
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/fields?id=eq.${Number(id)}`,
    {
      method: "DELETE",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    }
  );

  if (!response.ok) {
    const data = await response.json();

    return res.status(response.status).json({
      error: "Erreur Supabase",
      details: data
    });
  }

  return res.status(200).json({
    success: true
  });
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
