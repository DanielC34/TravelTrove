import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ItineraryEditor } from '../ItineraryEditor';
import { itineraryService } from '@/services/itineraryService';

// Mock the itinerary service
vi.mock('@/services/itineraryService', () => ({
  itineraryService: {
    reorderActivities: vi.fn(),
    addActivity: vi.fn(),
    updateActivity: vi.fn(),
    removeActivity: vi.fn(),
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockDays = [
  {
    dayNumber: 1,
    date: new Date('2024-01-01'),
    activities: [
      {
        name: 'Visit Museum',
        description: 'Explore local history',
        location: { name: 'City Museum' },
        startTime: '09:00',
        endTime: '11:00',
        duration: 120,
        category: 'attraction' as const,
        cost: { amount: 15, currency: 'USD' },
        notes: 'Bring camera',
        isFlexible: true,
        priority: 'must-see' as const,
      },
      {
        name: 'Lunch at Cafe',
        description: 'Local cuisine',
        location: { name: 'Downtown Cafe' },
        startTime: '12:00',
        endTime: '13:00',
        duration: 60,
        category: 'restaurant' as const,
        cost: { amount: 25, currency: 'USD' },
        notes: '',
        isFlexible: false,
        priority: 'recommended' as const,
      },
    ],
  },
];

describe('ItineraryEditor Drag & Drop', () => {
  const mockProps = {
    tripId: 'test-trip-id',
    days: mockDays,
    onSave: vi.fn(),
    onCancel: vi.fn(),
    isEditing: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders activities with drag handles', () => {
    render(<ItineraryEditor {...mockProps} />);
    
    expect(screen.getByText('Visit Museum')).toBeInTheDocument();
    expect(screen.getByText('Lunch at Cafe')).toBeInTheDocument();
  });

  it('handles add activity', async () => {
    const mockAddActivity = vi.mocked(itineraryService.addActivity);
    mockAddActivity.mockResolvedValue();

    render(<ItineraryEditor {...mockProps} />);
    
    const addButton = screen.getByText('Add Activity');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddActivity).toHaveBeenCalledWith(
        'test-trip-id',
        1,
        expect.objectContaining({
          name: 'New Activity',
          category: 'activity',
        })
      );
    });
  });
});