import { getWordDetails } from "@/app/actions"; // 1. Use our server action
import Link from "next/link";

// This is a Server Component, so it can be async!
export default async function WordDetailPage({
  params,
}: {
  params: { word: string };
}) {
  // 2. DO NOT try to access params.word here.
  //    We must pass it directly into the awaited function.
  //    const word = decodeURIComponent(params.word); <-- THIS WAS THE BROKEN LINE
  //    console.log(`[Page] Calling getWordDetails with: ${params.word}`); <-- THIS WAS THE BROKEN LINE

  // 3. This is the fix:
  //    Call the action *immediately* and pass params.word.
  //    This allows Next.js to "unwrap" the params.
  const entry = await getWordDetails(params.word); // params.word is passed raw
  
  // 4. Log *after* the await (this is safe)
  console.log("[Page] Data received from action:", entry ? entry.entry : null);


  // 5. Handle the "Not Found" case
  if (!entry) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-4 pt-12 font-serif text-brand-grey md:p-24">
        <div className="w-full max-w-xl">
          <h1 className="mb-12 animate-float-up border-b border-gray-200 pb-4 text-center text-5xl font-cursive text-brand-green opacity-0 [animation-delay:0.1s]">
            Error
          </h1>
          <div className="animate-float-up rounded-lg bg-white p-6 text-center shadow-md opacity-0 [animation-delay:0.3s]">
            <p className="mb-6 leading-relaxed text-brand-grey">
              Sorry, we couldn't find any details for the word:{" "}
              {/* This is now safe because the 'await' has happened */}
              <strong>{decodeURIComponent(params.word)}</strong>
            </p>
            <Link
              href="/"
              className="group relative inline-block font-serif font-bold text-brand-green no-underline"
            >
              &larr; Back to Dictionary
              <span className="absolute bottom-0 left-0 block h-0.5 w-full scale-x-0 bg-brand-green transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 6. Render the full details for the word
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-4 pt-12 font-serif text-brand-grey md:p-24">
      <div className="w-full max-w-xl">
        {/* Header: Word + Link Back */}
        <div className="mb-6 flex animate-float-up items-baseline justify-between opacity-0 [animation-delay:0.1s]">
          <h1 className="text-5xl font-cursive text-brand-green">
            {entry.entry}
          </h1>
          <Link
            href="/"
            className="group relative font-serif text-sm font-bold text-brand-green no-underline"
          >
            &larr; Back
            <span className="absolute bottom-0 left-0 block h-0.5 w-full scale-x-0 bg-brand-green transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
        </div>

        {/* Pronunciations Section */}
        <div className="animate-float-up rounded-lg bg-white p-6 shadow-md opacity-0 [animation-delay:0.3s]">
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-cursive text-brand-green">
            Pronunciations
          </h2>
          {entry.pronunciations?.map((pron: any, index: number) => (
            <div
              key={index}
              className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-50 p-4"
            >
              <div>
                {pron.transcriptions?.map((t: any, tIndex: number) => (
                  <span
                    key={tIndex}
                    className="mr-2 text-xl font-light text-gray-600"
                  >
                    {t.transcription}
                  </span>
                ))}
                <span className="text-sm italic text-brand-grey">
                  ({pron.context?.regions?.join(", ")})
                </span>
              </div>
              {pron.audio?.url && (
                <audio
                  controls
                  src={pron.audio.url}
                  className="w-full max-w-xs"
                />
              )}
            </div>
          ))}
        </div>

        {/* Definitions Section - Mapped by Part of Speech */}
        <div className="mt-6 space-y-6">
          {entry.lexemes?.map((lexeme: any, index: number) => (
            <div
              key={index}
              className="animate-float-up rounded-lg bg-white p-6 shadow-md opacity-0 [animation-delay:0.5s]"
            >
              <h2 className="mb-4 text-3xl font-cursive text-brand-green">
                {lexeme.partOfSpeech}
              </h2>
              <ol className="ml-5 list-decimal space-y-4">
                {lexeme.senses?.map((sense: any, sIndex: number) => (
                  <li key={sIndex} className="leading-relaxed text-brand-grey">
                    {sense.definition}
                    {sense.labels && (
                      <span className="ml-2 text-sm italic text-gray-500">
                        ({sense.labels.join(", ")})
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

