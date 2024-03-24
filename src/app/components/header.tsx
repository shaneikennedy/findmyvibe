import Image from "next/image";
import BigBrainSpotify from "/public/bigbrainspotify.png";

export function Header() {
  return (
    <header className="py-1">
      <Image
        src={BigBrainSpotify}
        alt="Find my vibe logo"
        className="rounded-full"
        width={50}
        height={50}
      />
    </header>
  );
}
