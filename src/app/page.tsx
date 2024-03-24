"use client";
import { useState } from "react";
import { Header } from "./components/header";
import {
  createThread,
  generatePlaylist,
  pollForPlaylist,
  Song,
} from "./playlistgpt";
import { PlaylistSkeleton } from "./skeletons";
import { Search } from "./components/search";
import { Playlist } from "./components/playlist";

export default function Home() {
  const [songs, setSongs] = useState([] as Song[]);
  const [isLoading, setIsLoading] = useState(false);
  let [threadId, setThreadId] = useState(null);

  async function getPlaylist(data: FormData) {
    // Create thread
    if (threadId === null) {
      try {
        threadId = await createThread();
        setThreadId(threadId);
      } catch (e) {
        alert("Problems starting the thread :(");
        return;
      }
    }

    // Call to generate playlist
    const description = data.get("description")?.toString();
    let runId = null;
    try {
      runId = await generatePlaylist(description!, threadId!);
    } catch (e) {
      alert("Problem creating a run :(");
      return;
    }

    // Retrieve the thread on the server
    let interval = setInterval(async () => {
      try {
        const songs = await pollForPlaylist(threadId!, runId);
        if (songs.length > 0) {
          clearInterval(interval);
        }
        setSongs(await pollForPlaylist(threadId!, runId));
        setIsLoading(false);
      } catch (e) {
        // Don't do anything, let the interval resolve this...
      }
    }, 2000);
  }

  return (
    <div className="m-7 flex max-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex flex-grow justify-center">
        <div className="w-full max-w-xl">
          <Search
            searchCallback={getPlaylist}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            playlistLength={songs.length}
          />
          {isLoading ? (
            <div className="max-h-fit overflow-y-scroll py-4">
              <PlaylistSkeleton />
            </div>
          ) : (
            <Playlist songs={songs} />
          )}
        </div>
      </main>
    </div>
  );
}
