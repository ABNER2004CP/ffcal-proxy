import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url = "https://nfs.faireconomy.media/ff_calendar_thisweek.xml";
    const xml = await fetch(url).then(r => r.text());

    const events = [];
    const items = xml.split("<event>");

    // تاریخ امروز بر اساس UTC (سازگار با ForexFactory)
    const now = new Date();
    const utcMonth = String(now.getUTCMonth() + 1).padStart(2, "0");
    const utcDay = String(now.getUTCDate()).padStart(2, "0");
    const utcYear = now.getUTCFullYear();
    const todayStr = `${utcMonth}-${utcDay}-${utcYear}`;

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

      // فقط رویدادهای امروز
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
