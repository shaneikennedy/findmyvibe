import { XCircleIcon } from "@heroicons/react/24/solid";

type SongItemProps = {
  name: string;
  artist: string;
  uri: string;
  removeSong: any;
};
export const SpotifySongItem: React.FC<SongItemProps> = ({ uri }) => {
  return (
    <iframe
      className="rounded-sm"
      src={`https://open.spotify.com/embed/track/${uri.split(":").pop()}?utm_source=generator`}
      width="100%"
      height="100"
      frameBorder="0"
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    />
  );
};
export const GenericSongItem: React.FC<SongItemProps> = ({
  name,
  artist,
  uri,
  removeSong,
}) => {
  return (
    <li className={"flex items-center justify-between py-2"}>
      <div>
        <p className="text-md">{name}</p>
        <p className="text-sm text-gray-400">{artist}</p>
      </div>
      <button
        onClick={() => removeSong(uri)}
        className="text-green-500 transition-colors duration-150 hover:text-green-300"
      >
        <XCircleIcon className="h-5 w-5" />
      </button>
    </li>
  );
};
