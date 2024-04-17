import { render, screen } from '@testing-library/react';
import MessageBubble from '../components/Message';
import React from "react";
import '@testing-library/jest-dom'

const ref = React.createRef();

describe('MessageBubble component', () => {
  it('renders user message', () => {
    render(<MessageBubble
      ref={ref}
      message={{
        id: 'random-id',
        content: 'Hello',
        role: 'user'
      }}
    />);

    const message = screen.getByText('Hello');
    expect(message).toBeInTheDocument();

    expect(message).toHaveClass('user');

    expect(ref.current).toHaveClass('float-right');
  });

  it('renders assistant message', () => {
    render(<MessageBubble
      ref={ref}
      message={{
        id: 'random-id-2',
        content: {
          emoji: '🙂',
          text: 'Hello there!'
        },
        role: 'assistant'
      }}
    />);

    const message = screen.getByText('Hello there!');
    expect(message).toBeInTheDocument();

    expect(ref.current).toHaveClass('float-left');

  });

  it('renders emoji message correctly', () => {
    render(<MessageBubble
      ref={ref}
      message={{
        id: 'random-id-2',
        content: {
          emoji: '🤖',
          text: 'I am an AI assistant'
        },
        role: 'assistant'
      }}
    />);

    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('I am an AI assistant')).toBeInTheDocument();
  });

  it('renders string content', () => {
    render(<MessageBubble
      ref={ref}
      message={{
        id: 'random-id-3',
        content: 'Hello',
        role: 'user'
      }}
    />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders object content', () => {
    render(<MessageBubble
      ref={ref}
      message={{
        id: 'random-id-4',
        content: {
          emoji: '🙂',
          text: 'Hello there!'
        },
        role: 'assistant'
      }}
    />);

    expect(screen.getByText('🙂')).toBeInTheDocument();
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
  });
});
