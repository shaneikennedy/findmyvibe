import Image from "next/image";
import BigBrainSpotify from "/public/bigbrainspotify.png";

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-black text-white">
      <header className="p-5">
        {/* Replace `logo.png` with the path to your logo, ensure it's visible on a dark background */}
        <Image
          src={BigBrainSpotify}
          alt="Find my vibe logo"
          className="rounded-full"
          width={50}
          height={50}
        />
      </header>

      <main className="flex flex-grow items-center justify-center">
        <div className="w-full max-w-xl">
          <form className="flex items-center border-b border-green-500 py-2">
            <input
              className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-white focus:outline-none"
              type="text"
              placeholder="Search..."
              aria-label="Search"
            />
            <button
              className="flex-shrink-0 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
              type="submit"
            >
              Generate
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
