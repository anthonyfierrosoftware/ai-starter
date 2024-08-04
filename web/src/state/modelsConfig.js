export const models = [
  {
    name: "GPT3.5",
    config: {
      llm: "OPEN_AI",
      chat_model: "gpt-3.5-turbo",
    },
  },
  {
    name: "GPT4.0",
    config: {
      llm: "OPEN_AI",
      // chat_model: "gpt-4-turbo",
      chat_model: "gpt-4o-mini",
    },
  },
  {
    name: "Claude",
    config: {
      llm: "CLAUDE",
      // chat_model: "claude-3-opus-20240229",
      chat_model: "claude-3-haiku-20240307",
    },
  },
  {
    name: "Llama",
    config: {
      llm: "HUGGINGFACE",
      // chat_model: "meta-llama/Llama-2-70b-chat-hf",
      chat_model: "meta-llama/Llama-2-7b-chat-hf",
    },
  },
  {
    name: "Mistral",
    config: {
      llm: "MISTRAL",
      // chat_model: "mistral-large-latest",
      chat_model: "open-mistral-nemo",
    },
  },
];

export const getModelConfig = (id) => {
  const model = models.find((model) => model.name === id);
  return model ? model.config : null;
};
