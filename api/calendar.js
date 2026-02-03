import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url = "https://nfs.faireconomy.media/ff_calendar_thisweek.xml";
    const xml = await fetch(url).then(r => r.text());

    const events = [];
    const items = xml.split("<event>");

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const yyyy = today.getFullYear();
    const todayStr = `${mm}-${dd}-${yyyy}`;

    const clean = str =>
      str.replace("<![CDATA[", "").replace("]]>", "").trim();

    items.forEach(block => {
      if (!block.includes("</event>")) return;

      const get = tag => {
        const start = block.indexOf(`<${tag}>`);
        const end = block.indexOf(`</${tag}>`);
        if (start === -1 || end === -1) return "";
        return clean(block.substring(start + tag.length + 2, end));
      };

      const date = get("date");
      if (date !== todayStr) return;

      events.push({
        date,
        time: get("time") || "All Day",
        currency: get("country"),
        impact: get("impact"),
        title: get("title"),
        forecast: get("forecast"),
        previous: get("previous"),
        actual: get("actual")
      });
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

export default router;
