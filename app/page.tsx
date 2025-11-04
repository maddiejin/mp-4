"use client"; 

import { useFormState, useFormStatus } from "react-dom";
import { getDefinition, DictionaryState } from "./actions"; 
import { useRef, useEffect } from "react";

// show loading state on submit button
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
    type="submit" 
    disabled={pending} 
    className="your-class-name">
      {pending ? "Searching..." : "Get Definition"}
    </button>
  );
}

export default function DictionaryPage() {
  const initialState: DictionaryState = {
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
    <main className="your-class-name">

      <div className="your-class-name">
        <h1 className="your-class-name"
        >Dictionary</h1>

        {/* form display */}
        <form 
        action={formAction}
        className="your-class-name">
        <label htmlFor="word" className="your-class-name">Enter a word:</label>
        <input
          id="word"
          type="text"
          name="word"
          placeholder="Enter a word..."
          className="your-class-name"
          required
        />
        <SubmitButton />
      </form>

      {/* error display */}
      {state.error && (
        <p className="your-class-name">
          <strong>Error:</strong> {state.error}
        </p>
      )}

      {/* definition display */}
      {state.definition && !state.error && (
          <div className="your-class-name">
            <div className="your-class-name">
              <h2 className="your-class-name">
                {state.word}
              </h2>
            </div>

            <i className="your-class-name">
              ({state.partOfSpeech})
            </i>

            <p className="your-class-name">{state.definition}</p>

            {state.audioUrl && (
              <audio controls className="mt-5 w-full" ref={audioRef}>
                <source src={state.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}
      </div>
      
      
      
    </main>
  );
}