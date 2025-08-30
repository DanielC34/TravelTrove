import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccommodationPreferences } from "../AccommodationPreferences";
import { FormProvider, useForm } from "react-hook-form";

// Mock react-hook-form
vi.mock("react-hook-form", () => ({
  useForm: vi.fn(),
  FormProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("AccommodationPreferences", () => {
  const mockRegister = vi.fn();
  const mockSetValue = vi.fn();
  const mockGetValues = vi.fn();
  const mockWatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementation
    (useForm as any).mockReturnValue({
      register: mockRegister,
      setValue: mockSetValue,
      getValues: mockGetValues,
      watch: mockWatch,
      formState: {
        errors: {},
      },
    });
  });

  it("renders all accommodation preference inputs", () => {
    render(<AccommodationPreferences />);

    // Check if all inputs are rendered
    expect(screen.getByLabelText("Hotel")).toBeInTheDocument();
    expect(screen.getByLabelText("Hostel")).toBeInTheDocument();
    expect(screen.getByLabelText("Apartment")).toBeInTheDocument();
    expect(screen.getByLabelText("Bed & Breakfast")).toBeInTheDocument();
    expect(screen.getByLabelText("Resort")).toBeInTheDocument();
    expect(screen.getByLabelText("Camping")).toBeInTheDocument();
  });

  it("renders accommodation type checkboxes", () => {
    render(<AccommodationPreferences />);

    // Check if all type checkboxes are rendered
    expect(screen.getByLabelText("Luxury")).toBeInTheDocument();
    expect(screen.getByLabelText("Mid-range")).toBeInTheDocument();
    expect(screen.getByLabelText("Budget")).toBeInTheDocument();
  });

  it("registers all inputs with react-hook-form", () => {
    render(<AccommodationPreferences />);

    // Check if register was called for each input
    expect(mockRegister).toHaveBeenCalledTimes(9); // 6 accommodation types + 3 price ranges
  });

  it("handles checkbox changes correctly", () => {
    render(<AccommodationPreferences />);

    // Click a checkbox
    const hotelCheckbox = screen.getByLabelText("Hotel");
    fireEvent.click(hotelCheckbox);

    // Check if setValue was called with correct parameters
    expect(mockSetValue).toHaveBeenCalledWith(
      "accommodation.types.hotel",
      true,
      { shouldValidate: true }
    );
  });

  it("handles price range selection correctly", () => {
    render(<AccommodationPreferences />);

    // Click a price range checkbox
    const midRangeCheckbox = screen.getByLabelText("Mid-range");
    fireEvent.click(midRangeCheckbox);

    // Check if setValue was called with correct parameters
    expect(mockSetValue).toHaveBeenCalledWith(
      "accommodation.priceRange.midRange",
      true,
      { shouldValidate: true }
    );
  });

  it("displays validation errors when required", () => {
    const mockErrors = {
      "accommodation.types": {
        message: "Please select at least one accommodation type",
      },
    };

    (useForm as any).mockReturnValue({
      register: mockRegister,
      setValue: mockSetValue,
      getValues: mockGetValues,
      watch: mockWatch,
      formState: {
        errors: mockErrors,
      },
    });

    render(<AccommodationPreferences required />);

    // Check if error message is displayed
    expect(
      screen.getByText("Please select at least one accommodation type")
    ).toBeInTheDocument();
  });

  it("renders in read-only mode when specified", () => {
    render(<AccommodationPreferences readOnly />);

    // Check if inputs are disabled
    const inputs = screen.getAllByRole("checkbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-class";
    render(<AccommodationPreferences className={customClass} />);

    // Check if custom class is applied
    const container = screen.getByTestId("accommodation-preferences");
    expect(container).toHaveClass(customClass);
  });

  it("renders with correct label and description", () => {
    const label = "Custom Label";
    const description = "Custom Description";

    render(
      <AccommodationPreferences label={label} description={description} />
    );

    // Check if label and description are rendered
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("handles multiple selections correctly", () => {
    render(<AccommodationPreferences />);

    // Select multiple accommodation types
    const hotelCheckbox = screen.getByLabelText("Hotel");
    const apartmentCheckbox = screen.getByLabelText("Apartment");
    const resortCheckbox = screen.getByLabelText("Resort");

    fireEvent.click(hotelCheckbox);
    fireEvent.click(apartmentCheckbox);
    fireEvent.click(resortCheckbox);

    // Check if setValue was called for each selection
    expect(mockSetValue).toHaveBeenCalledWith(
      "accommodation.types.hotel",
      true,
      { shouldValidate: true }
    );
    expect(mockSetValue).toHaveBeenCalledWith(
      "accommodation.types.apartment",
      true,
      { shouldValidate: true }
    );
    expect(mockSetValue).toHaveBeenCalledWith(
      "accommodation.types.resort",
      true,
      { shouldValidate: true }
    );
  });

  it("handles amenity preferences correctly", () => {
    render(<AccommodationPreferences />);

    // Check if amenity checkboxes are rendered
    expect(screen.getByLabelText("WiFi")).toBeInTheDocument();
    expect(screen.getByLabelText("Pool")).toBeInTheDocument();
    expect(screen.getByLabelText("Gym")).toBeInTheDocument();
    expect(screen.getByLabelText("Restaurant")).toBeInTheDocument();
    expect(screen.getByLabelText("Parking")).toBeInTheDocument();

    // Select an amenity
    const wifiCheckbox = screen.getByLabelText("WiFi");
    fireEvent.click(wifiCheckbox);

    // Check if setValue was called with correct parameters
    expect(mockSetValue).toHaveBeenCalledWith(
      "accommodation.amenities.wifi",
      true,
      { shouldValidate: true }
    );
  });
});
