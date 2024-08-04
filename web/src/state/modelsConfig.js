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
      chat_model: "gpt-4-turbo",
    },
  },
  {
    name: "Claude",
    config: {
      llm: "CLAUDE",
      chat_model: "claude-3-opus-20240229",
    },
  },
  {
    name: "Llama",
    config: {
      llm: "HUGGINGFACE",
      chat_model: "meta-llama/Llama-2-70b-chat-hf",
    },
  },
  {
    name: "Mistral",
    config: {
      llm: "MISTRAL",
      chat_model: "mistral-large-latest",
    },
  },
];

export const getModelConfig = (id) => {
  const model = models.find((model) => model.name === id);
  return model ? model.config : null;
};
