import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const url = "https://www.forexfactory.com/calendar?week=next";
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    const events = [];

    $("table.calendar__table tr").each((i, row) => {
      const time = $(row).find(".calendar__time").text().trim();
      const currency = $(row).find(".calendar__currency").text().trim();
      const event = $(row).find(".calendar__event").text().trim();
      const impact = $(row).find(".calendar__impact span").attr("title") || "";
      const actual = $(row).find(".calendar__actual").text().trim();
      const forecast = $(row).find(".calendar__forecast").text().trim();
      const previous = $(row).find(".calendar__previous").text().trim();

      if (!event) return;

      const finalTime = time || "All Day";

      events.push({
        time: finalTime,
        currency,
        impact,
        event,
        actual,
        forecast,
        previous
      });
    });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
