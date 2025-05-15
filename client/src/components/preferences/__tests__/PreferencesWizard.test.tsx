import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PreferencesWizard } from "../PreferencesWizard";
import { usePreferences } from "../../../context/PreferencesContext";

// Mock the usePreferences hook
vi.mock("../../../context/PreferencesContext", () => ({
  usePreferences: vi.fn(),
}));

describe("PreferencesWizard", () => {
  // Mock data for testing
  const mockInitialData = {
    dietary: {
      restrictions: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        nutFree: false,
        halal: false,
        kosher: false,
      },
      preferences: {
        spicy: false,
        local: false,
        organic: false,
        streetFood: false,
      },
      spiceLevel: 50,
    },
  };

  const mockOnComplete = vi.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementation
    (usePreferences as any).mockReturnValue({
      isLoading: false,
      error: null,
    });
  });

  it("renders the first step by default", () => {
    render(
      <PreferencesWizard
        onComplete={mockOnComplete}
        initialData={mockInitialData}
      />
    );

    // Check if the first step title is rendered
    expect(screen.getByText("Dietary Preferences")).toBeInTheDocument();

    // Check if the progress indicator shows correct step
    expect(screen.getByText("Step 1 of 9")).toBeInTheDocument();
  });

  it("shows loading state when preferences are loading", () => {
    (usePreferences as any).mockReturnValue({
      isLoading: true,
      error: null,
    });

    render(
      <PreferencesWizard
        onComplete={mockOnComplete}
        initialData={mockInitialData}
      />
    );

    // Check if loading spinner is present
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays error message when there is an error", () => {
    const errorMessage = "Failed to load preferences";
    (usePreferences as any).mockReturnValue({
      isLoading: false,
      error: errorMessage,
    });

    render(
      <PreferencesWizard
        onComplete={mockOnComplete}
        initialData={mockInitialData}
      />
    );

    // Check if error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("navigates to next step when Next button is clicked and validation passes", async () => {
    render(
      <PreferencesWizard
        onComplete={mockOnComplete}
        initialData={mockInitialData}
      />
    );

    // Click the Next button
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Wait for the next step to be rendered
    await waitFor(() => {
      expect(screen.getByText("Mobility & Accessibility")).toBeInTheDocument();
    });
  });

  it("navigates to previous step when Previous button is clicked", async () => {
    render(
      <PreferencesWizard
        onComplete={mockOnComplete}
        initialData={mockInitialData}
      />
    );

    // First go to the second step
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Wait for the second step
    await waitFor(() => {
      expect(screen.getByText("Mobility & Accessibility")).toBeInTheDocument();
    });

    // Click the Previous button
    const prevButton = screen.getByText("Previous");
    fireEvent.click(prevButton);

    // Check if we're back to the first step
    expect(screen.getByText("Dietary Preferences")).toBeInTheDocument();
  });

  it("shows validation errors when required fields are empty", async () => {
    render(
      <PreferencesWizard
        onComplete={mockOnComplete}
        initialData={mockInitialData}
      />
    );

    // Try to proceed without filling required fields
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  it("calls onComplete with form data when all steps are completed", async () => {
    render(
      <PreferencesWizard
        onComplete={mockOnComplete}
        initialData={mockInitialData}
      />
    );

    // Fill out the first step
    const vegetarianCheckbox = screen.getByLabelText("Vegetarian");
    fireEvent.click(vegetarianCheckbox);

    // Navigate through all steps
    for (let i = 0; i < 8; i++) {
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText("Next")).toBeInTheDocument();
      });
    }

    // Click the Complete button on the last step
    const completeButton = screen.getByText("Complete");
    fireEvent.click(completeButton);

    // Check if onComplete was called with the form data
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it("updates progress bar as steps are completed", async () => {
    render(
      <PreferencesWizard
        onComplete={mockOnComplete}
        initialData={mockInitialData}
      />
    );

    // Check initial progress
    expect(screen.getByText("11% Complete")).toBeInTheDocument();

    // Complete first step
    const vegetarianCheckbox = screen.getByLabelText("Vegetarian");
    fireEvent.click(vegetarianCheckbox);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Check updated progress
    await waitFor(() => {
      expect(screen.getByText("22% Complete")).toBeInTheDocument();
    });
  });
});
