import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
const moodyFall =
  "A playlist that encapsulates the feeling of walking through a misty forest, the crisp leaves crunching underfoot, the cool air tinged with the scent of earth and rain.This playlist is a collection of songs that resonate with the soulful, reflective quiet of a gloomy fall day.It's filled with mellow acoustic melodies, soft indie folk whispers, and soul-stirring lyrical narratives that echo the introspective nature of the season.";
const getHype =
  "A playlist that captures the essence of a wild night out. It's an audacious mix of pulsating beats, infectious rhythms, and catchy hooks, designed to propel you into a state of euphoria. From the moment you hit play, each song is a burst of energy, a catalyst for dance, and a badge of defiance against the mundane.";

const bistroCafe =
  "A playlist that encapsulates the essence of Paris after dusk—music that weaves through the air like the rich aroma of espresso and freshly baked pastries.It's a collection of songs that speaks to the heart of the city's romantic allure, blending classic French chansons with modern melodies that echo the timeless spirit of Paris.Each track is a brushstroke on the canvas of the night, painting an auditory masterpiece of love, life, and leisure.";
type ExampleProps = {
  short: string;
  long: string;
  onclick: any;
};
const Example: React.FC<ExampleProps> = ({ short, long, onclick }) => {
  return (
    <button
      onClick={() => onclick(long)}
      className="sm:text-md mr-2 max-w-xs rounded-2xl bg-green-500 px-2 py-1 align-middle text-xs hover:bg-green-600"
    >
      {short}
      <ArrowUpRightIcon className="ml-1 inline h-2 w-2 text-black sm:h-3 sm:w-3" />
    </button>
  );
};

type ExamplesProps = {
  chooseExample: any;
};

export const Examples: React.FC<ExamplesProps> = ({ chooseExample }) => {
  const examples: ExampleProps[] = [
    {
      short: "Autumn day",
      long: moodyFall,
      onclick: chooseExample,
    },
    {
      short: "Get hyped",
      long: getHype,
      onclick: chooseExample,
    },
    {
      short: "Bistro cafe",
      long: bistroCafe,
      onclick: chooseExample,
    },
  ];
  return (
    <div className="mt-3 flex max-w-md justify-start text-black">
      {examples.map((example: ExampleProps, index) => (
        <Example
          key={index}
          short={example.short}
          long={example.long}
          onclick={example.onclick}
        />
      ))}
    </div>
  );
};
