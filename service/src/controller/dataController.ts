import { Context } from "@hono/hono";

export const dataController = async (c: Context) => {
  const url = "https://jsonplaceholder.typicode.com/posts"; // Ersetze dies durch deine URL

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Netzwerkantwort war nicht ok");
    }
    const data = await response.json(); // Konvertiere die Antwort in JSON
    return c.json(data); // Gebe die abgerufenen Daten als JSON zurück
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
    return c.text("Fehler beim Abrufen der Daten", 500);
  }
};
