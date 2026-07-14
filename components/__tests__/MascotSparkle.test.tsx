import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';

const mockUseReduceMotion = jest.fn(() => false);
jest.mock('../../utils/useReduceMotion', () => ({
  useReduceMotion: () => mockUseReduceMotion(),
}));

import MascotSparkle from '../MascotSparkle';

const hasTestId = (getAllByType: (type: any) => any[], testID: string) =>
  getAllByType(View).some((n: any) => n.props.testID === testID);

describe('MascotSparkle', () => {
  beforeEach(() => {
    mockUseReduceMotion.mockReturnValue(false);
  });

  it('renders the lottie sparkle by default', () => {
    const { UNSAFE_getAllByType } = render(<MascotSparkle testID="sparkle" />);
    expect(hasTestId(UNSAFE_getAllByType, 'sparkle')).toBe(true);
    expect(hasTestId(UNSAFE_getAllByType, 'lottie-view')).toBe(true);
  });

  it('renders nothing when reduced motion is preferred', () => {
    mockUseReduceMotion.mockReturnValue(true);
    const { toJSON } = render(<MascotSparkle testID="sparkle" />);
    expect(toJSON()).toBeNull();
  });
});
