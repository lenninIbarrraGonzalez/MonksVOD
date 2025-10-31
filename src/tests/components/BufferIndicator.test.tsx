import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BufferIndicator } from '../../components/BufferIndicator/BufferIndicator';

describe('BufferIndicator', () => {
  it('should render when visible', () => {
    render(<BufferIndicator isVisible={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    const { container } = render(<BufferIndicator isVisible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should have correct styling classes when visible', () => {
    render(<BufferIndicator isVisible={true} />);
    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toHaveClass('animate-pulse');
  });
});
