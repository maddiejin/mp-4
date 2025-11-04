"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getDefinition, BriefDictionaryState } from "./actions";
import { useRef, useEffect } from "react";
import Link from "next/link";

// show loading state on submit button
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 bg-[#2d622f] text-white font-bold rounded-md transition-colors hover:bg-opacity-80 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? "Searching..." : "Get Definition"}
    </button>
  );
}

export default function DictionaryPage() {
  const initialState: BriefDictionaryState = {
    word: null,
    partOfSpeech: null,
    definition: null,
    audioUrl: null,
    error: null,
  };

  const [state, formAction] = useFormState(getDefinition, initialState);

  // reset audio on new word search
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [state.word]);

  return (
    <main className="font-serif bg-white max-w-2xl mx-auto my-12 p-8 rounded-lg shadow-lg">
      <div className="flex flex-col gap-6">
        <h1
          className="font-['Playball'] text-5xl text-center text-[#2d622f] border-b-2 border-[#eee] pb-4 mb-2"
        >
          Dictionary
        </h1>

        {/* form display */}
        <form
          action={formAction}
          className="flex flex-col sm:flex-row gap-4 w-full"
        >
          <label htmlFor="word" className="font-semibold text-[#444] self-center">
            Enter a word:
          </label>
          <input
            id="word"
            type="text"
            name="word"
            placeholder="Enter a word..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md text-[#444] focus:outline-none focus:ring-2 focus:ring-[#2d622f]"
            required
          />
          <SubmitButton />
        </form>

        {/* error display */}
        {state.error && (
          <p className="text-red-700 bg-red-50 p-4 rounded-md border border-red-200">
            <strong>Error:</strong> {state.error}
          </p>
        )}

        {/* definition display */}
        {state.definition && !state.error && (
          <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-inner flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h2
                className="font-['Playball'] text-4xl text-[#2d622f]"
              >
                {state.word}
              </h2>
            </div>

            <i
              className="text-lg text-[#666] -mt-2"
            >
              ({state.partOfSpeech})
            </i>

            <p
              className="text-base text-[#444] leading-relaxed mt-2"
            >
              {state.definition}
            </p>

            {state.audioUrl && (
              <audio controls className="mt-5 w-full" ref={audioRef}>
                <source src={state.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

            <div className="mt-6 border-t border-gray-200 pt-4 flex justify-center">
              <Link
                href={`/word/${state.word}`}
                className="inline-block px-6 py-2 bg-[#2d622f] text-white font-bold rounded-md transition transform hover:scale-105 hover:bg-opacity-80 focus:ring-2 focus:ring-offset-2 focus:ring-[#2d622f] no-underline text-center"
              >
                See all definitions & details &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}