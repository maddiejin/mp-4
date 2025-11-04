import { getWordDetails } from "@/app/actions"; 

export default async function WordPage(props: { params: Promise<{ word: string }> }) {
  const params = await props.params;
  const word = params.word;

  const data = await getWordDetails(word);

  //console.log("-------------WORD PAGE DATA LOG--------------", JSON.stringify(data, null, 2));

  return (
    <main className="font-serif bg-white max-w-2xl mx-auto my-12 p-8 rounded-lg shadow-lg">
      <div className="flex flex-col gap-6">
        <h1 className="font-['Playball'] text-5xl text-center text-[#2d622f] border-b-2 border-[#eee] pb-4 mb-2">
          Dictionary Details
        </h1>

        {data.error ? (
          <p className="text-red-700 bg-red-50 p-4 rounded-md border border-red-200">
            <strong>Error:</strong> {data.error}
          </p>
        ) : (
          <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-inner flex flex-col gap-4">
            
            <div className="flex flex-col items-center gap-2">
              <h2 className="font-['Playball'] text-4xl text-[#2d622f]">{data.word}</h2>
              <i className="text-lg text-[#666]">({data.partOfSpeech})</i>
            </div>

            {/* definition */}
            <p className="text-base text-[#444] leading-relaxed">{data.definition}</p>

            {/* pronunciations */}
            {data.pronunciations.length > 0 && (
              <p className="text-gray-700">
                <strong>Pronunciations:</strong> {data.pronunciations.join(", ")}
              </p>
            )}

            {/* forms */}
            {data.forms.length > 0 && (
              <p className="text-gray-700">
                <strong>Forms:</strong> {data.forms.join(", ")}
              </p>
            )}

            {/* synonyms */}
            {data.synonyms.length > 0 && (
              <p className="text-gray-700">
                <strong>Synonyms:</strong> {data.synonyms.join(", ")}
              </p>
            )}

            {/* antonyms */}
            {data.antonyms?.length > 0 && (
              <p className="text-gray-700">
                <strong>Antonyms:</strong> {data.antonyms.join(", ")}
              </p>
            )}

            {/* audio */}
            {data.audioUrl && (
              <audio controls className="mt-4 w-full">
                <source src={data.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

            {/* usage examples */}
            {data.usageExamples.length > 0 && (
              <div className="mt-4">
                <strong className="text-gray-700">Usage Examples:</strong>
                <ul className="list-disc list-inside mt-2">
                  {data.usageExamples.map((example, index) => (
                    <li key={index} className="text-gray-700">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        )}
      </div>
    </main>
  );
}
