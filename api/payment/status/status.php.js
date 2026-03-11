const VENO_BASE_URL = process.env.VENO_BASE_URL || "https://beta.venopayments.com/api";

module.exports = async (req, res) => {
  try {
    if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

    const venoApiKey = process.env.VENO_API_KEY;
    if (!venoApiKey) {
      return res.status(500).json({ success: false, message: "VENO_API_KEY não configurada" });
    }

    const id = String(req.query.id || req.query.transaction_id || "").trim();
    if (!id) return res.status(400).json({ success: false, message: "id é obrigatório" });

    const url = `${VENO_BASE_URL}/v1/pix/${encodeURIComponent(id)}/status`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${venoApiKey}`,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      const txData = Array.isArray(data?.data) ? data.data[0] : data?.data || data;
      const status = String(txData?.status || data?.status || data?.payment_status || "pending").toLowerCase();
      return res.json({ success: true, status, transaction: txData || data });
    }

    return res.status(502).json({
      success: false,
      message: "Não foi possível consultar status",
      response: { status: response.status, data },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Erro interno", error: String(e?.message || e) });
  }
};
