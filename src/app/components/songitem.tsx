type SongItemProps = {
  name: string;
  artist: string;
  trackId: string;
};
export const SpotifySongItem: React.FC<SongItemProps> = ({ trackId }) => {
  return (
    <iframe
      className="rounded-sm"
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
      width="100%"
      height="100"
      frameBorder="0"
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    ></iframe>
  );
};
// ${index < songsWithUri.length - 1 ? "border-b border-gray-800" : ""}
export const GenericSongItem: React.FC<SongItemProps> = ({ name, artist }) => {
  return (
    <li className={"flex items-center justify-between py-2"}>
      <div>
        <p className="text-md">{name}</p>
        <p className="text-sm text-gray-400">{artist}</p>
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
  );
};
