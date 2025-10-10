import { Context } from "@hono/hono";
import { AllOptional } from "../types/AllOptional.ts";
export class DataController {
  constructor() {}

  async getData(c: AllOptional<Context>) {
    const url = "https://jsonplaceholder.typicode.com/posts"; // Ersetze dies durch deine URL
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Netzwerkantwort war nicht ok");
      }
      const data = await response.json(); // Konvertiere die Antwort in JSON
      return c.json!(data); // Gebe die abgerufenen Daten als JSON zurück
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      return c.json!({ error: "Fehler beim Abrufen der Daten" }, 500);
    }
  }
}
