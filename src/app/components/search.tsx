import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Examples } from "./examples";

type SearchProps = {
  searchCallback: any;
  setIsLoading: any;
  isLoading: boolean;
};
export const Search: React.FC<SearchProps> = ({
  searchCallback,
  setIsLoading,
  isLoading,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [txtAreaValue, setTxtAreaValue] = useState("");

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
    setTxtAreaValue(event.target.value);
  };

  useEffect(() => {
    textAreaRef.current!.style.height = "auto";
    textAreaRef.current!.style.height =
      textAreaRef.current!.scrollHeight + "px";
  }, [txtAreaValue]);

  return (
    <>
      <form
        ref={formRef}
        action={searchCallback}
        className="flex items-center border-b border-green-500 py-1"
      >
        <textarea
          ref={textAreaRef}
          className="mr-3 h-auto w-full resize-none appearance-none border-none bg-transparent px-2 py-1 leading-tight text-stone-300 focus:outline-none"
          required={true}
          placeholder="What do you want to listen to?"
          value={txtAreaValue}
          onKeyDown={handleKeyDown}
          onChange={handleTxtAreaInput}
          rows={1}
          name="description"
        />
        <button
          className="flex-shrink-0 rounded-full bg-green-500 p-2 font-bold text-stone-300 hover:bg-green-700"
          title="Generate a playlist"
          onClick={() => setIsLoading(!isLoading)}
          type="submit"
        >
          <ArrowLeftIcon className="h-4 w-4 text-black" />
        </button>
      </form>
      <Examples chooseExample={setTxtAreaValue} />
    </>
  );
};
