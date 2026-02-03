import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const url = "https://www.forexfactory.com/calendar";
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    const events = [];

    $("tr.calendar__row, tr.calendar__row--all-day").each((i, row) => {
      const time = $(row).find(".calendar__time").text().trim() || "All Day";
      const currency = $(row).find(".calendar__currency").text().trim();
      const impact = $(row).find(".calendar__impact span").attr("title") || "";
      const event = $(row).find(".calendar__event").text().trim();
      const actual = $(row).find(".calendar__actual").text().trim();
      const forecast = $(row).find(".calendar__forecast").text().trim();
      const previous = $(row).find(".calendar__previous").text().trim();

      if (event) {
        events.push({
          time,
          currency,
          impact,
          event,
          actual,
          forecast,
          previous
        });
      }
    });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
