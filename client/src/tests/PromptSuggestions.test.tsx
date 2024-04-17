import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'

import PromptSuggestionRow from '../components/PromptSuggestions';

describe('PromptSuggestionRow', () => {

  it('renders prompt suggestion buttons', () => {
    render(<PromptSuggestionRow onPromptClick={jest.fn()} />);

    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(screen.getByText('What is the rental price?')).toBeInTheDocument();
  });

  it('calls onPromptClick when button clicked', () => {
    const onPromptClick = jest.fn();
    render(<PromptSuggestionRow onPromptClick={onPromptClick} />);

    userEvent.click(screen.getByText('What is the rental price?'));

    expect(onPromptClick).toHaveBeenCalledWith('What is the rental price?');
  });

});
