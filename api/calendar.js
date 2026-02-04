import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url = "https://nfs.faireconomy.media/ff_calendar_thisweek.xml";
    const xml = await fetch(url).then(r => r.text());

    const events = [];
    const items = xml.split("<event>");

    // تبدیل تاریخ امروز به منطقه زمانی ET (Eastern Time)
    const now = new Date();
    const etOffset = -5; // زمستان ET = UTC-5
    const etDate = new Date(now.getTime() + etOffset * 60 * 60 * 1000);

    const mm = String(etDate.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(etDate.getUTCDate()).padStart(2, "0");
    const yyyy = etDate.getUTCFullYear();
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

      // فقط رویدادهای امروز بر اساس ET
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
