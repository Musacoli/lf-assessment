import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import axios from 'axios';
import App from '../App';
import '@testing-library/jest-dom';
import {act} from 'react-dom/test-utils';
import toast from "react-hot-toast";

// Mock axios to prevent actual HTTP requests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock toast to prevent toast from appearing during tests
jest.mock('react-hot-toast');

describe('App', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Ask what the rental price is.')).toBeInTheDocument();
  });

  it('should display the initial chatbot header and input field', () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    expect(getByText('Chatting with the LegalFly bot. Ask any questions about your contract')).toBeInTheDocument();
    expect(getByPlaceholderText('Ask what the rental price is.')).toBeInTheDocument();
  });

  it('updates input field on change', () => {
    render(<App />);
    const input: HTMLInputElement = screen.getByPlaceholderText('Ask what the rental price is.');
    fireEvent.change(input, { target: { value: 'What is the rental price?' } });
    expect(input.value).toBe('What is the rental price?');
  });

  it('should add a new message to the chat when the form is submitted', async () => {
    const responseMock = { data: { response: {
          "text": "This is a test response",
          "emoji": "💰"
        }  } };
    mockedAxios.post.mockResolvedValue(responseMock);

    const { getByText, getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText('Ask what the rental price is.');
    const button = getByText('Send');

    fireEvent.change(input, { target: { value: 'Test prompt' } });
    fireEvent.click(button);

    await waitFor(() => getByText('Test prompt'));
    await waitFor(() => getByText('This is a test response'));
  });

  it('sends a chat request when form is submitted', async () => {
    const response = { data: { response: {
          "text": "The rental price is €1200 per month.",
          "emoji": "💰"
        } } };
    mockedAxios.post.mockResolvedValueOnce(response);

    render(<App />);
    const input = screen.getByPlaceholderText('Ask what the rental price is.');
    fireEvent.change(input, { target: { value: 'What is the rental price?' } });
    fireEvent.submit(input);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3001/chat', { prompt: 'What is the rental price?' });
    });
  });

  it('renders messages when they are added to state after an API call', async () => {
    const userMessage = {
      id: 'user-message-id',
      content: 'What is the rental price question?',
      role: 'user',
    };
    const assistantMessage = {
      id: 'assistant-message-id',
      content: {
        "text": "The rental price is €1200 per month.",
        "emoji": "💰"
      },
      role: 'assistant',
    };

    // Mock the API response
    mockedAxios.post.mockResolvedValueOnce({ data: { response: assistantMessage.content } });

    render(<App />);
    const input = screen.getByPlaceholderText('Ask what the rental price is.');
    fireEvent.change(input, {    target: { value: userMessage.content },
    });

    await act(async () => {
      fireEvent.submit(input);
    })

    // Wait for the async submitChatRequest function to resolve and the state to update
    await waitFor(() => {
      // The messages should now be in the document
      expect(screen.getByText(userMessage.content)).toBeInTheDocument();
      expect(screen.getByText(assistantMessage.content.text)).toBeInTheDocument();
    });

  });

  it('scrolls to bottom when a new message is added', async () => {
    const userMessage = {
      id: 'user-message-id',
      content: 'What is the rental price?',
      role: 'user',
    };

    // Mock the scrollIntoView function
    const scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(<App />);
    // Simulate adding a message
    act(() => {
      const input = screen.getByPlaceholderText('Ask what the rental price is.');
      fireEvent.change(input, { target: { value: userMessage.content } });
      fireEvent.submit(input);
    });

    await waitFor(() => {
      // Check if the scrollIntoView function was called
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });

  it('displays an error toast when the chat request fails', async () => {
    // Mock axios to simulate a network error
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);
    const input = screen.getByPlaceholderText('Ask what the rental price is.');
    fireEvent.change(input, { target: { value: 'What is the rental price?' } });
    fireEvent.submit(input);

    await waitFor(() => {
      // Check if the toast error function was called
      expect(toast.error).toHaveBeenCalledWith('Error sending message. Try again !');
    });
  });


});
