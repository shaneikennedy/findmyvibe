"use server";
import { OpenAI } from "openai";

const openai = new OpenAI();

function getPlaylistPrompt(description: string): string {
  return `Generate a spotify playlist with 10 songs for the description: ${description}. Make your response a json that kay one key: playlist which is a list of the song's:  name, the artist and the spotify track uri.`;
}

export type Song = {
  name: string;
  artist: string;
  uri: string;
};

export async function generatePlaylist(
  description: string | undefined,
): Promise<Array<Song>> {
  if (!description) {
    return [];
  }
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: getPlaylistPrompt(description) }],
    model: "gpt-3.5-turbo",
  });
  const jsonString = completion.choices[0]?.message?.content;
  if (jsonString === null) {
    console.error("Can't get a json response from chatgpt.");
  }
  try {
    const { playlist } = JSON.parse(jsonString as string);
    if (!playlist) {
      console.error("cant parse to json");
      return [];
    }
    return playlist!;
  } catch (error) {
    console.error(
      "Failed to parse the completion response to a JSON object",
      error,
    );
    return [];
  }
}
