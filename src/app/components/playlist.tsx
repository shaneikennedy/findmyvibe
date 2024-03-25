import { useCallback, useEffect, useState } from "react";
import { Song } from "../playlistgpt";
import { spotify } from "../spotify";
import { PlusIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/solid";
import { GenericSongItem, SpotifySongItem } from "./songitem";

type PlaylistProps = {
  description: string;
  songs: Array<Song>;
};

type AddPlaylistState = null | "loading" | "done";

export const Playlist: React.FC<PlaylistProps> = ({ songs, description }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [addPlaylistState, setAddPlaylistState] = useState(
    null as AddPlaylistState,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  let [songsWithUri, setSongsWithUri] = useState([] as Song[]);

  useEffect(() => {
    spotify.getAccessToken().then((token) => {
      if (token?.expires! < Date.now()) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    });
  }, [songs]);

  const correctUris = useCallback(async () => {
    const songsWithUri = songs.map(async (s) => {
      let search = await spotify.search(s.artist + " " + s.name, ["track"]);
      return {
        name: s.name,
        artist: s.artist,
        uri: search.tracks.items[0]?.uri,
        verified: true,
      };
    });
    return await Promise.all(songsWithUri);
  }, [songs]);

  useEffect(() => {
    if (isAuthenticated) {
      correctUris().then((songs) => setSongsWithUri(songs));
    } else {
      setSongsWithUri(songs);
    }
  }, [songs, isAuthenticated, correctUris]);

  async function handleAddToSpotify() {
    await spotify.authenticate();
    setIsAuthenticated(true);
    const songsWithUri = await correctUris();

    const user = await spotify.currentUser.profile();
    const playlist = await spotify.playlists.createPlaylist(user.id, {
      name: playlistName,
      description,
    });
    await spotify.playlists.addItemsToPlaylist(
      playlist.id,
      songsWithUri.map((s) => s.uri),
    );
    setAddPlaylistState("done");
    setTimeout(() => setAddPlaylistState(null), 5000);
  }

  function updatePlaylistName(e: React.ChangeEvent<HTMLInputElement>) {
    setPlaylistName(e.target.value);
  }

  return (
    <>
      {songs.length > 0 && (
        <form
          className="mb-2 flex justify-items-start"
          onSubmit={(e) => {
            e.preventDefault();
            setAddPlaylistState("loading");
            handleAddToSpotify();
          }}
        >
          <button
            className="mr-3 rounded-full bg-green-500 p-3 text-black hover:bg-green-700"
            title="Add to my spotify"
            type={"submit"}
          >
            {(() => {
              switch (addPlaylistState) {
                case "loading":
                  return (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900 text-black"></div>
                    </div>
                  );
                case "done":
                  return <CheckIcon className="h-4 w-4 text-black" />;
                case null:
                default:
                  return <PlusIcon className="h-4 w-4 text-black" />;
              }
            })()}
          </button>
          <input
            className="border-b border-green-500 bg-transparent p-1 text-stone-300 focus:outline-none"
            value={playlistName}
            onInput={updatePlaylistName}
            placeholder="Name your playlist"
            required
          />
        </form>
      )}
      <ul>
        {songsWithUri.map((song, index) =>
          isAuthenticated && song.uri ? (
            <SpotifySongItem
              key={index}
              trackId={song.uri.split(":").pop()!}
              name={song.name}
              artist={song.artist}
            />
          ) : (
            <GenericSongItem
              key={index}
              trackId=""
              name={song.name}
              artist={song.artist}
            />
          ),
        )}
      </ul>
    </>
  );
};
