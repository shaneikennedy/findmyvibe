"use client";
import { useState, useRef, useEffect } from "react";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { spotify } from "./spotify";

const loadingStates = [
  "Understanding...",
  "Searching...",
  "Compiling...",
  "Hang in there...",
];

export default function Home() {
  const [songs, setSongs] = useState([] as Song[]);
  const [isLoading, setIsLoading] = useState(false);
  const [playlistDescription, setPlaylistDescription] = useState("");
  let [threadId, setThreadId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingStates[0]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [runId, setRunId] = useState<string | null>(null);
  const playlistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isLoading]);

  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash);
    const queryParams = new URLSearchParams(searchParams);
    const stateJSON = hashParams.get("state");
    if (stateJSON) {
      const state = JSON.parse(stateJSON!);
      if (state && state.threadId) {
        setThreadId(state.threadId);
        if (state.action == "createPlaylist") {
          playlistRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          spotify.authenticateWithState(stateJSON).then(() => {
            const params = new URLSearchParams({ threadId: state.threadId });
            router.replace(`${pathName}/?${params.toString()}`, {
              scroll: false,
            });
            alert(
              "Try creating the playlist again, we needed to log you in to sportify first",
            );
          });
        }
      }
    } else if (searchParams.has("threadId")) {
      setThreadId(searchParams.get("threadId"));
    } else if (queryParams.has("error")) {
      if (queryParams.has("state")) {
        const state = JSON.parse(stateJSON!);
        if (state && state.threadId) {
          setThreadId(state.threadId);
          if (state.action == "createPlaylist") {
            playlistRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }
      alert(
        "Could not authenticate your spotify account for findmyvibe. This means there was a problem with your login or you need to request access to use findmyvibe. To request access, DM @shaneikennedy on twitter.",
      );
    }
  }, [searchParams, pathName, router]);

  useEffect(() => {
    if (threadId === null) {
      return;
    }
    if (!isLoading) {
      setIsLoading(true);
    }
    let loadingIndex = 0;
    const loadingMessageInterval = setInterval(() => {
      if (loadingIndex < loadingStates.length - 1) {
        loadingIndex++;
      }
      setLoadingMessage(loadingStates[loadingIndex]);
    }, 3000);

    // Retrieve the thread on the server
    let interval = setInterval(async () => {
      try {
        const songs = await pollForPlaylist(threadId!, runId);
        if (songs.length > 0) {
          clearInterval(interval);
        }
        setSongs(songs);
        setIsLoading(false);
        clearInterval(loadingMessageInterval);
      } catch (e) {
        // Don't do anything, let the interval resolve this...
      }
    }, 2000);
  }, [threadId, runId]);

  function removeSong(uri: string) {
    setSongs(songs.filter((s) => s.uri !== uri));
  }

  async function getPlaylist(data: FormData) {
    // Create thread
    if (threadId === null) {
      try {
        threadId = await createThread();
      } catch (e) {
        alert("Problems starting the thread :(");
        return;
      }
    }

    // Call to generate playlist
    const description = data.get("description")?.toString();
    setPlaylistDescription(description!);
    let runId = null;
    try {
      runId = await generatePlaylist(description!, threadId!);
    } catch (e) {
      alert("Problem creating a run :(");
      return;
    }

    setRunId(runId);
    setThreadId(threadId);
    const params = new URLSearchParams(searchParams);
    params.set("threadId", threadId!);
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="m-7 flex max-h-screen flex-col bg-black text-stone-300">
      <Header />
      <main className="flex flex-grow justify-center">
        <div className="w-full max-w-xl">
          <Search
            searchCallback={getPlaylist}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />

          <h1
            ref={headingRef}
            className="leading-2 mt-12 text-center text-5xl font-semibold text-stone-300"
          >
            Spotify playlists for how you{"'"}re{" "}
            <span className="text-green-500">really</span> feeling
          </h1>
          <p className="mb-3 mt-11 text-center text-xl leading-6 text-stone-300">
            Try one of our currated descriptions above to see how specific you
            can get and add it to your spotify in one click.
          </p>
          <div ref={playlistRef} className="max-h-fit overflow-y-scroll py-4">
            {isLoading ? (
              <>
                <p className="animate-pulse text-center text-lg">
                  {loadingMessage}
                </p>
                <PlaylistSkeleton />
              </>
            ) : (
              <Playlist
                removeSong={removeSong}
                songs={songs}
                description={playlistDescription}
                threadId={threadId}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
