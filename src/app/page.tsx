"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import BigBrainSpotify from "/public/bigbrainspotify.png";
import { generatePlaylist, Song } from "./playlistgpt";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { PlaylistSkeleton } from "./skeletons";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const [txtAreaHeight, setTxtAreaHeight] = useState("");
  const [playlist, setPlaylist] = useState([] as Song[]);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setIsLoading(true);
      formRef.current?.requestSubmit();
    }
  };
  const handleTxtAreaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTxtAreaHeight(event.target.value);
  };

  async function getPlaylist(data: FormData) {
    setPlaylist(await generatePlaylist(data.get("description")?.toString()));
    setIsLoading(false);
  }
  return (
    <div className="m-7 flex max-h-screen flex-col bg-black text-white">
      <header className="py-1">
        <Image
          src={BigBrainSpotify}
          alt="Find my vibe logo"
          className="rounded-full"
          width={50}
          height={50}
        />
      </header>

      <main className="flex flex-grow justify-center">
        <div className="w-full max-w-xl">
          <form
            ref={formRef}
            action={getPlaylist}
            className="flex items-center border-b border-green-500 py-1"
          >
            <textarea
              className="mr-3 h-auto w-full resize-none appearance-none border-none bg-transparent px-2 py-1 leading-tight text-white focus:outline-none"
              required={true}
              placeholder="What do you want to listen to?"
              value={txtAreaHeight}
              onKeyDown={handleKeyDown}
              onChange={handleTxtAreaInput}
              rows={1}
              name="description"
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
            <button
              className="flex-shrink-0 rounded-full bg-green-500 px-2 py-2 font-bold text-white hover:bg-green-700"
              title="Generate a playlist"
              type="submit"
            >
              <ArrowLeftCircleIcon className="h-4 w-4" />
            </button>
            {playlist.length > 0 && (
              <button
                className="ml-1 flex-shrink-0 rounded-full bg-green-500 px-2 py-2 font-bold text-white hover:bg-green-700"
                title="Add to my spotify"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            )}
          </form>
          {isLoading ? (
            <div className="max-h-fit overflow-y-scroll py-4">
              <PlaylistSkeleton />
            </div>
          ) : (
            <div className="max-h-fit overflow-y-scroll py-4">
              <ul>
                {playlist.map((song: Song, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between py-2 ${index < playlist.length - 1 ? "border-b border-gray-800" : ""}`}
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
          )}
          <div className="max-h-fit overflow-y-scroll py-4">
            <ul>
              {playlist.map((song: Song, index) => (
                <li
                  key={index}
                  className={`flex items-center justify-between py-2 ${index < playlist.length - 1 ? "border-b border-gray-800" : ""}`}
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
        </div>
      </main>
    </div>
  );
}
