import { useRef, useState } from "react";
import { ArrowLeftCircleIcon, PlusIcon } from "@heroicons/react/24/solid";

type SearchProps = {
  searchCallback: any;
  setIsLoading: any;
  isLoading: boolean;
  playlistLength: number;
};
export const Search: React.FC<SearchProps> = ({
  searchCallback,
  setIsLoading,
  isLoading,
  playlistLength,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [txtAreaHeight, setTxtAreaHeight] = useState("");

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

  return (
    <form
      ref={formRef}
      action={searchCallback}
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
        onClick={() => setIsLoading(!isLoading)}
        type="submit"
      >
        <ArrowLeftCircleIcon className="h-4 w-4" />
      </button>
      {playlistLength > 0 && (
        <button
          className="ml-1 flex-shrink-0 rounded-full bg-green-500 px-2 py-2 font-bold text-white hover:bg-green-700"
          title="Add to my spotify"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      )}
    </form>
  );
};
