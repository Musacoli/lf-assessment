

const PromptSuggestionButton = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="prompt-button text-sm py-2 px-4 rounded-lg overflow-hidden whitespace-nowrap focus:outline-none focus:shadow-outline"
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
