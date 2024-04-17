import PromptSuggestionButton from "./PromptSuggestionBox";

const PromptSuggestionRow = ({ onPromptClick }: { onPromptClick: (prompt: string) => void }) => {
  const prompts = [
    'What is the rental price?',
    'In what currency is the rent?',
    'Who do I pay rent to?',
    'How frequently do I have to pay rent?',
  ];

  return (
    <div className="flex flex-row flex-wrap justify-start items-center py-4 gap-2">
      {prompts.map((prompt, index) => (
        <PromptSuggestionButton key={`suggestion-${index}`} text={prompt} onClick={() => onPromptClick(prompt)} />
      ))}
    </div>
  );
};

export default PromptSuggestionRow;
