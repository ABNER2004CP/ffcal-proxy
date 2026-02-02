export default async function handler(req, res) {
  try {
    const xmlUrl = "https://cdn-nfs.faireconomy.media/ff_calendar_thisweek.xml";
    const xml = await fetch(xmlUrl).then(r => r.text());

    const { parseStringPromise } = await import("xml2js");
    const json = await parseStringPromise(xml);

    res.status(200).json(json);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
