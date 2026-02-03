export default async function handler(req, res) {
  try {
    const url = "https://nfs.faireconomy.media/ff_calendar_thisweek.xml";
    const xml = await fetch(url).then(r => r.text());

    // تبدیل XML به JSON ساده
    const events = [];
    const items = xml.split("<event>");

    items.forEach(block => {
      if (!block.includes("</event>")) return;

      const get = tag => {
        const start = block.indexOf(`<${tag}>`);
        const end = block.indexOf(`</${tag}>`);
        if (start === -1 || end === -1) return "";
        return block.substring(start + tag.length + 2, end).trim();
      };

      events.push({
        date: get("date"),
        time: get("time") || "All Day",
        currency: get("country"),
        impact: get("impact"),
        title: get("title"),
        forecast: get("forecast"),
        previous: get("previous"),
        actual: get("actual")
      });
    });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
