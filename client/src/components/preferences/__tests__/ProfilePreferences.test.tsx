import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProfilePreferences } from "../ProfilePreferences";
import { usePreferences } from "../../../context/PreferencesContext";

// Mock the usePreferences hook
vi.mock("../../../context/PreferencesContext", () => ({
  usePreferences: vi.fn(),
}));

describe("ProfilePreferences", () => {
  const mockOnCancel = vi.fn();

  // Mock data for testing
  const mockPreferences = {
    dietary: {
      restrictions: {
        vegetarian: true,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        nutFree: false,
        halal: false,
        kosher: false,
      },
      preferences: {
        spicy: true,
        local: true,
        organic: false,
        streetFood: true,
      },
      spiceLevel: 75,
    },
    mobility: {
      level: "low",
      requirements: {
        wheelchair: false,
        walker: false,
        cane: false,
        crutches: false,
      },
      limitations: {
        walkingDistance: 50,
        standingTime: 50,
        stairs: 50,
      },
    },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementation
    (usePreferences as any).mockReturnValue({
      preferences: mockPreferences,
      isLoading: false,
      error: null,
      updatePreferences: vi.fn(),
      loadPreferences: vi.fn(),
    });
  });

  it("renders preferences in view mode by default", () => {
    render(<ProfilePreferences onCancel={mockOnCancel} />);

    // Check if the title is rendered
    expect(screen.getByText("Travel Preferences")).toBeInTheDocument();

    // Check if edit and wizard buttons are present
    expect(screen.getByText("Start Wizard")).toBeInTheDocument();
    expect(screen.getByText("Edit Preferences")).toBeInTheDocument();
  });

  it("shows loading state when preferences are loading", () => {
    (usePreferences as any).mockReturnValue({
      preferences: null,
      isLoading: true,
      error: null,
      updatePreferences: vi.fn(),
      loadPreferences: vi.fn(),
    });

    render(<ProfilePreferences onCancel={mockOnCancel} />);

    // Check if loading spinner is present
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays error message when there is an error", () => {
    const errorMessage = "Failed to load preferences";
    (usePreferences as any).mockReturnValue({
      preferences: null,
      isLoading: false,
      error: errorMessage,
      updatePreferences: vi.fn(),
      loadPreferences: vi.fn(),
    });

    render(<ProfilePreferences onCancel={mockOnCancel} />);

    // Check if error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("switches to edit mode when Edit button is clicked", () => {
    render(<ProfilePreferences onCancel={mockOnCancel} />);

    // Click the Edit button
    const editButton = screen.getByText("Edit Preferences");
    fireEvent.click(editButton);

    // Check if we're in edit mode
    expect(screen.getByText("Edit Preferences")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("switches to wizard mode when Start Wizard button is clicked", () => {
    render(<ProfilePreferences onCancel={mockOnCancel} />);

    // Click the Start Wizard button
    const wizardButton = screen.getByText("Start Wizard");
    fireEvent.click(wizardButton);

    // Check if wizard is rendered
    expect(screen.getByText("Step 1 of 9")).toBeInTheDocument();
  });

  it("calls onCancel when Cancel button is clicked in edit mode", () => {
    render(<ProfilePreferences onCancel={mockOnCancel} />);

    // Enter edit mode
    const editButton = screen.getByText("Edit Preferences");
    fireEvent.click(editButton);

    // Click Cancel
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Check if onCancel was called
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("saves changes when Save Changes is clicked", async () => {
    const mockUpdatePreferences = vi.fn();
    (usePreferences as any).mockReturnValue({
      preferences: mockPreferences,
      isLoading: false,
      error: null,
      updatePreferences: mockUpdatePreferences,
      loadPreferences: vi.fn(),
    });

    render(<ProfilePreferences onCancel={mockOnCancel} />);

    // Enter edit mode
    const editButton = screen.getByText("Edit Preferences");
    fireEvent.click(editButton);

    // Make a change
    const vegetarianCheckbox = screen.getByLabelText("Vegetarian");
    fireEvent.click(vegetarianCheckbox);

    // Save changes
    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    // Check if updatePreferences was called
    await waitFor(() => {
      expect(mockUpdatePreferences).toHaveBeenCalled();
    });
  });

  it("displays all preference sections in view mode", () => {
    render(<ProfilePreferences onCancel={mockOnCancel} />);

    // Check if all sections are rendered
    expect(screen.getByText("Dietary Preferences")).toBeInTheDocument();
    expect(screen.getByText("Mobility & Accessibility")).toBeInTheDocument();
    expect(screen.getByText("Interests & Activities")).toBeInTheDocument();
    expect(screen.getByText("Budget Preferences")).toBeInTheDocument();
    expect(screen.getByText("Accommodation Preferences")).toBeInTheDocument();
    expect(screen.getByText("Activity Comfort Levels")).toBeInTheDocument();
    expect(screen.getByText("Transportation Preferences")).toBeInTheDocument();
    expect(screen.getByText("Travel Style")).toBeInTheDocument();
    expect(screen.getByText("Special Requirements")).toBeInTheDocument();
  });

  it("loads preferences when component mounts", () => {
    const mockLoadPreferences = vi.fn();
    (usePreferences as any).mockReturnValue({
      preferences: null,
      isLoading: false,
      error: null,
      updatePreferences: vi.fn(),
      loadPreferences: mockLoadPreferences,
    });

    render(<ProfilePreferences onCancel={mockOnCancel} />);

    // Check if loadPreferences was called
    expect(mockLoadPreferences).toHaveBeenCalled();
  });
});
