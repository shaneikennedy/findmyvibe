import { Song } from "../playlistgpt";

type PlaylistProps = {
  songs: Array<Song>;
};
export const Playlist: React.FC<PlaylistProps> = ({ songs }) => {
  return (
    <div className="max-h-fit overflow-y-scroll py-4">
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
    </div>
  );
};
