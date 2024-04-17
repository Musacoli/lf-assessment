import {forwardRef, JSXElementConstructor, RefObject} from "react";
import { Message } from '../types'

interface MessageProps {
  ref: React.ForwardedRef<any>;
  message: Message;
}

const MessageBubble:JSXElementConstructor<MessageProps> = forwardRef(function MessageBubble({ message }, ref) {
  const { role, content } = message;
  const isUser = role === "user"

  const displayContent = () => {
    if (typeof content === 'string') {
      return content
    } else {
      return (
        <div className="flex justify-between items-center">
          <span className="text-2xl mr-2">{content.emoji}</span>
          {" "}
          <span className="text-xl">{content.text}</span>
        </div>
      )
    }
  }

  return (
    <div ref={ref as RefObject<HTMLDivElement>} className={`block mt-4 md:mt-6 pb-[7px] clear-both ${isUser ? 'float-right' : 'float-left'}`}>
      <div className="flex justify-end">
        <div className={`talk-bubble${isUser ? ' user' : ''} p-2 md:p-4`}>
              {displayContent()}
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.730278 0.921112C-3.49587 0.921112 12 0.921112 12 0.921112V5.67376C12 6.8181 9.9396 7.23093 9.31641 6.27116C6.83775 2.45382 3.72507 0.921112 0.730278 0.921112Z" />
          </svg>
        </div>
      </div>
    </div>
  )
})

export default MessageBubble;
