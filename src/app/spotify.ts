"use client";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-modify-public",
];
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
const clientId = process.env.SPOTIFY_CLIENT_ID;

export const spotify = SpotifyApi.withImplicitGrant(
  clientId!,
  redirectUri!,
  scopes,
);
