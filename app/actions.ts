"use server";

export interface BriefDictionaryState {
  word: string | null;
  partOfSpeech: string | null;
  definition: string | null;
  audioUrl: string | null;
  error: string | null;
}

export interface FullDictionaryState extends BriefDictionaryState {
  pronunciations: string[]; 
  forms: string[];           
  synonyms: string[];        
  antonyms: string[];  
  usageExamples: string[];      
}


export async function getDefinition(
  prevState: BriefDictionaryState,
  formData: FormData
): Promise<BriefDictionaryState> {
  
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

    //console.log("--------------DATA LOG---------------", JSON.stringify(data, null, 2));

    const entry = data.entries?.[0]; 

    if (!entry) {
        return { ...prevState, error: `No definitions found for "${word}".` };
    }

    //console.log("-------------ENTRY LOG--------------", JSON.stringify(entry, null, 2));

    const lexeme = entry?.lexemes?.[0];
    const sense = lexeme?.senses?.[0];

    //console.log("-------------SENSE LOG--------------", JSON.stringify(sense, null, 2));

    const foundWord = entry.entry;
    const foundPartOfSpeech = lexeme?.partOfSpeech;
    const foundDefinition = sense?.definition;
    const foundAudio = entry?.pronunciations?.[0]?.audio?.url;


    console.log("-------------DEFINITION LOG--------------");
    console.log("word = ", JSON.stringify(foundWord,null,2));
    console.log("def = ", JSON.stringify(foundDefinition, null, 2));
    

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

export async function getWordDetails(word: string): Promise<FullDictionaryState> {
  if (!word) {
    return {
      word: "",
      partOfSpeech: "",
      definition: "",
      pronunciations: [],
      forms: [],
      synonyms: [],
      antonyms: [],
      audioUrl: null,
      usageExamples: [],
      error: "Please provide a word to fetch details for."
    };
  }

  const apiKey = process.env.LINGUA_ROBOT_API_KEY;
  if (!apiKey) {
    return {
      word,
      partOfSpeech: "",
      definition: "",
      pronunciations: [],
      forms: [],
      synonyms: [],
      antonyms: [],
      audioUrl: null,
      usageExamples: [],
      error: "Server configuration error: API key not found."
    };
  }

  try {
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || `API Error: ${response.statusText}`;
      return {
        word,
        partOfSpeech: "",
        definition: "",
        pronunciations: [],
        forms: [],
        synonyms: [],
        antonyms: [],
        audioUrl: null,
        usageExamples: [],
        error: message
      };
    }

    const data = await response.json();
    const entry = data.entries?.[0];

    if (!entry) {
      return {
        word,
        partOfSpeech: "",
        definition: "",
        pronunciations: [],
        forms: [],
        synonyms: [],
        antonyms: [],
        audioUrl: null,
        usageExamples: [],
        error: `No definitions found for "${word}".`
      };
    }

    const lexeme = entry.lexemes?.[0];
    const sense = lexeme?.senses?.[0];

    /*
    console.log("-------------DETAILED ENTRY LOG--------------", JSON.stringify(entry, null, 2));
    console.log("-------------DETAILED LEXEME LOG--------------", JSON.stringify(lexeme, null, 2));
    console.log("-------------DETAILED SENSE LOG--------------", JSON.stringify(sense, null, 2));
    */

    const foundWord = entry.entry || "N/A";
    const foundPartOfSpeech = lexeme?.partOfSpeech || "N/A";
    const foundDefinition = sense?.definition || "No definition provided.";
    const foundAudio = entry.pronunciations?.[0]?.audio?.url || null;
    const foundForms = lexeme?.forms?.map((f: any) => f.form) || [];
    const foundPronunciations = entry.pronunciations?.map(
      (p: any) => p.transcriptions?.[0]?.transcription || ""
      ) || [];
    const foundSynonyms = entry.lexemes
      ?.flatMap((lexeme: any) =>
      lexeme.synonymSets?.flatMap((set: any) => set.synonyms) || []
      ) || [];
    const foundAntonyms = entry.lexemes
      ?.flatMap((lexeme: any) =>
      lexeme.antonymSets?.flatMap((set: any) => set.antonyms) || []
      ) || [];
    const foundUsageExamples: string[] = lexeme?.senses?.flatMap((s: any) => s.usageExamples || []) || [];

    return {
      word: foundWord || "N/A",
      partOfSpeech: foundPartOfSpeech || "N/A",
      definition: foundDefinition || "No definition provided.",
      pronunciations: foundPronunciations || [],
      forms: foundForms || [],
      synonyms: foundSynonyms || [],
      antonyms: foundAntonyms || [],
      audioUrl: foundAudio || null,
      usageExamples: foundUsageExamples || [],
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      word,
      partOfSpeech: "",
      definition: "",
      pronunciations: [],
      forms: [],
      synonyms: [],
      antonyms: [],
      audioUrl: null,
      usageExamples: [],
      error: "An unexpected error occurred."
    };
  }
}