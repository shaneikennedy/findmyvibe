import { useState } from "react";
import { Song } from "../playlistgpt";
import { spotify } from "../spotify";
import { PlusIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/solid";

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

  async function correctUris() {
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
  }
  async function handleAddToSpotify() {
    await spotify.authenticate();
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
        {songs.map((song: Song, index) => (
          <li
            key={index}
            className={`flex items-center justify-between py-2 ${index < songs.length - 1 ? "border-b border-gray-800" : ""}`}
          >
            <div>
              <p className="text-md">{song.name}</p>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
            <button className="text-green-500 transition-colors duration-150 hover:text-green-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
