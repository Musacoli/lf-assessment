import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'

import PromptSuggestionBox from '../components/PromptSuggestionBox';

describe('PromptSuggestionBox', () => {
  it('renders the button with the provided text', () => {
    render(<PromptSuggestionBox text="Button Text" onClick={jest.fn()} />);

    expect(screen.getByRole('button')).toHaveTextContent('Button Text');
  });

  it('calls the onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<PromptSuggestionBox text="Click me" onClick={onClick} />);

    userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
