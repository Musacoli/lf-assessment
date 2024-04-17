import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import MessageBubble from './components/Message'
import { Message, AssistantMessage, UserMessage } from "./types";
import ThemeSwitcher from "./components/ThemeSwitcher";
import PromptSuggestionRow from "./components/PromptSuggestions";

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const submitChatRequest = async (prompt: string) => {
    // create the user message
    const userMessage: UserMessage = {
      id: uuidv4(),
      content: prompt,
      role: 'user'
    }

    // add the new user message to the chat ui
    setMessages([...messages, userMessage])

    setLoading(true)

    try {

      const result = await axios.post('http://localhost:3001/chat', { prompt });

      // transform the response into an assistant message
      const assistantMessage: AssistantMessage = {id: uuidv4(), role: 'assistant', content: result.data.response };

      // add the new assistant message to the ui
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error);
      toast.error('Error sending message. Try again !');
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // store the user prompt and clear the state and input
    const userPrompt = prompt;
    setPrompt('')

    // send the prompt to the BE
    await submitChatRequest(userPrompt)
  };

  // TODO: Make this look and feel like a chatbot

  return (
    <>
      <main className='flex h-screen flex-col items-center justify-center'>
        <div
          className='chatbot-section flex flex-col origin:w-[800px] w-full origin:h-[735px] h-full rounded-md p-2 md:p-6'>
          <div className='chatbot-header pb-6'>
            <div className='flex justify-between'>
              <div className="flex h-12">
                <svg height="65" viewBox="0 0 252 65" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className="h-10">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M157.287 29.2104V0H147.431V35.8832C150.757 33.9197 154.057 31.705 157.287 29.2104ZM140.362 39.6773V29.568C140.362 20.416 135.114 15.232 125.834 15.232C116.682 15.232 110.73 19.968 110.73 27.2H118.922C118.922 24.32 121.162 22.72 125.322 22.72C128.842 22.72 130.762 24.384 130.762 27.52V28.032L121.802 28.736C114.122 29.312 109.962 32.96 109.962 38.848C109.962 43.2472 112.04 46.513 115.622 48.071C123.347 46.4579 131.837 43.8194 140.362 39.6773ZM165.897 21.6851C171.728 15.928 177.163 9.0642 181.899 0.896H165.897V21.6851ZM10.6397 38.656V0.896H0.271729V48.256H29.3277V38.656H10.6397ZM32.2652 32.192C32.2652 42.048 39.1772 49.088 48.8412 49.088C57.6092 49.088 63.9452 44.544 65.0972 37.44H56.0732C55.3692 39.744 52.7452 41.088 49.0332 41.088C44.6812 41.088 42.3132 39.104 41.7372 34.88L64.9692 34.752V32.256C64.9692 21.824 58.6972 15.232 48.6492 15.232C38.9852 15.232 32.2652 22.208 32.2652 32.192ZM41.8652 28.8C42.6332 24.96 44.8092 23.232 48.7132 23.232C52.6812 23.232 55.1772 25.408 55.1772 28.8H41.8652ZM69.2057 31.68C69.2057 21.952 75.5417 15.168 84.5657 15.168C88.9177 15.168 92.3737 16.832 94.1017 19.456L94.6137 16.256H103.894V46.208C103.894 57.664 97.3017 64.576 86.3577 64.576C76.5657 64.576 69.9737 59.008 69.0777 49.92H79.0617C79.2537 53.504 81.9417 55.616 86.2937 55.616C91.0297 55.616 94.0377 52.8 94.0377 48.256V44.096C92.1177 46.4 88.5337 47.872 84.3737 47.872C75.4137 47.872 69.2057 41.28 69.2057 31.68ZM79.1257 31.424C79.1257 36.032 82.1977 39.296 86.5497 39.296C91.0297 39.296 94.0377 36.16 94.0377 31.424C94.0377 26.752 91.0297 23.744 86.4857 23.744C82.1337 23.744 79.1257 26.88 79.1257 31.424ZM130.826 36.288C130.826 39.936 128.202 41.792 124.426 41.792C121.418 41.792 120.01 40.704 120.01 38.4C120.01 36.352 121.546 35.392 125.834 35.008L130.826 34.56V36.288Z"
                        fill="#FDF2EE"/>
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M166 39.7883V48.512H176.368V30.016H193.008V20.672H179.872C175.245 28.4642 170.261 34.8909 166 39.7883ZM185.149 10.752H196.144V1.15201H189.137C187.93 4.50177 186.586 7.704 185.149 10.752ZM211.89 48.512H202.034V0.256012H211.89V48.512ZM216.724 55.616V63.872C218.644 64.448 220.884 64.768 223.252 64.768C228.884 64.768 232.468 62.016 235.156 55.488L251.412 16.512H241.172L233.428 37.056L226.452 16.512H215.892L228.756 49.6L228.18 51.136C226.9 54.592 225.492 55.616 222.164 55.616H216.724Z"
                        fill="#FDE7B0"/>
                </svg>
                <svg width="24" height="25" viewBox="0 0 24 25">
                  <path
                    d="M20 9.96057V7.96057C20 6.86057 19.1 5.96057 18 5.96057H15C15 4.30057 13.66 2.96057 12 2.96057C10.34 2.96057 9 4.30057 9 5.96057H6C4.9 5.96057 4 6.86057 4 7.96057V9.96057C2.34 9.96057 1 11.3006 1 12.9606C1 14.6206 2.34 15.9606 4 15.9606V19.9606C4 21.0606 4.9 21.9606 6 21.9606H18C19.1 21.9606 20 21.0606 20 19.9606V15.9606C21.66 15.9606 23 14.6206 23 12.9606C23 11.3006 21.66 9.96057 20 9.96057ZM7.5 12.4606C7.5 11.6306 8.17 10.9606 9 10.9606C9.83 10.9606 10.5 11.6306 10.5 12.4606C10.5 13.2906 9.83 13.9606 9 13.9606C8.17 13.9606 7.5 13.2906 7.5 12.4606ZM16 17.9606H8V15.9606H16V17.9606ZM15 13.9606C14.17 13.9606 13.5 13.2906 13.5 12.4606C13.5 11.6306 14.17 10.9606 15 10.9606C15.83 10.9606 16.5 11.6306 16.5 12.4606C16.5 13.2906 15.83 13.9606 15 13.9606Z"/>
                </svg>
              </div>
              <ThemeSwitcher/>
            </div>
            <p className='chatbot-text-secondary-inverse text-sm md:text-base mt-2 md:mt-4'>
              Chatting with the LegalFly bot. Ask any questions about your contract
            </p>
          </div>
          <div className='flex-1 relative overflow-y-auto my-4 md:my-6'>
            <div className='absolute w-full overflow-x-hidden'>
              {messages.map((message, index) => <MessageBubble ref={messagesEndRef} key={`message-${index}`}
                                                               message={message}/>)}
              {loading && <div className="w-6 h-6 flex items-center justify-center">
                <div className="dot-flashing"/>
              </div>}
            </div>
          </div>
          <PromptSuggestionRow onPromptClick={submitChatRequest} />
          <form className='flex h-[40px] gap-2' onSubmit={handleSubmit}>
            <input
              type='text'
              value={prompt}
              onChange={handleInputChange}
              className='chatbot-input flex-1 text-sm md:text-base outline-none bg-transparent rounded-md p-2'
              placeholder='Ask what the rental price is.'
            />
            <button
              type='submit'
              className='chatbot-send-button flex rounded-md items-center justify-center px-2.5 origin:px-3'
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path
                  d="M2.925 5.025L9.18333 7.70833L2.91667 6.875L2.925 5.025ZM9.175 12.2917L2.91667 14.975V13.125L9.175 12.2917ZM1.25833 2.5L1.25 8.33333L13.75 10L1.25 11.6667L1.25833 17.5L18.75 10L1.25833 2.5Z"/>
              </svg>
              Send
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default App;
