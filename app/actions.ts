"use server";

// interface: pulls first definition, part of speech, and word from API response
export interface DictionaryState {
  word: string | null;
  partOfSpeech: string | null;
  definition: string | null;
  audioUrl: string | null;
  error: string | null;
}

// gets definition from API
export async function getDefinition(
  prevState: DictionaryState,
  formData: FormData
): Promise<DictionaryState> {
  
  const word = formData.get("word") as string;
  if (!word) {
    return { ...prevState, error: "Please enter a word." };
  }

  const apiKey = process.env.LINGUA_ROBOT_API_KEY;
  if (!apiKey) {
    return { ...prevState, error: "Server configuration error: API key not found." };
  }

  try {
    // call API
    const response = await fetch(
      `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/${word}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "lingua-robot.p.rapidapi.com",
        },
      }
    );

    // error handling
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || `API Error: ${response.statusText}`;
      return { ...prevState, error: message };
    }

    // parse JSON for first entry 
    const data = await response.json();

    console.log("--------------DATA LOG---------------", JSON.stringify(data, null, 2));

    const entry = data.entries?.[0]; 

    if (!entry) {
        return { ...prevState, error: `No definitions found for "${word}".` };
    }

    console.log("-------------ENTRY LOG--------------", JSON.stringify(entry, null, 2));

    const lexeme = entry?.lexemes?.[0];
    const sense = lexeme?.senses?.[0];

    console.log("-------------SENSE LOG--------------", JSON.stringify(sense, null, 2));

    const foundWord = entry.entry;
    const foundPartOfSpeech = lexeme?.partOfSpeech;
    const foundDefinition = sense?.definition;
    const foundAudio = entry?.pronunciations?.[0]?.audio?.url;


    console.log("-------------DEFINITION LOG--------------", JSON.stringify(foundDefinition, null, 2));
    

    // returns first definition and part of speech
    return {
      word: foundWord || "N/A",
      partOfSpeech: foundPartOfSpeech || "N/A",
      definition: foundDefinition || "No definition provided.",
      audioUrl: foundAudio || null,
      error: null,
    };

  } catch (error) {
    console.error(error);
    return { ...prevState, error: "An unexpected error occurred." };
  }
}