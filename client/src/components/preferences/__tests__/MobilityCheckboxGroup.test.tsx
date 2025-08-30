import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobilityCheckboxGroup } from "../MobilityCheckboxGroup";
import { FormProvider, useForm } from "react-hook-form";

// Mock react-hook-form
vi.mock("react-hook-form", () => ({
  useForm: vi.fn(),
  FormProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("MobilityCheckboxGroup", () => {
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

  it("renders all mobility requirement checkboxes", () => {
    render(
      <MobilityCheckboxGroup
        name="mobility.requirements"
        label="Mobility Requirements"
      />
    );

    // Check if all requirement checkboxes are rendered
    expect(screen.getByLabelText("Wheelchair")).toBeInTheDocument();
    expect(screen.getByLabelText("Walker")).toBeInTheDocument();
    expect(screen.getByLabelText("Cane")).toBeInTheDocument();
    expect(screen.getByLabelText("Crutches")).toBeInTheDocument();
  });

  it("renders mobility level radio buttons", () => {
    render(
      <MobilityCheckboxGroup name="mobility.level" label="Mobility Level" />
    );

    // Check if all level radio buttons are rendered
    expect(screen.getByLabelText("Low")).toBeInTheDocument();
    expect(screen.getByLabelText("Medium")).toBeInTheDocument();
    expect(screen.getByLabelText("High")).toBeInTheDocument();
  });

  it("registers all inputs with react-hook-form", () => {
    render(
      <MobilityCheckboxGroup
        name="mobility.requirements"
        label="Mobility Requirements"
      />
    );

    // Check if register was called for each checkbox
    expect(mockRegister).toHaveBeenCalledTimes(4); // 4 requirement checkboxes
  });

  it("handles checkbox changes correctly", () => {
    render(
      <MobilityCheckboxGroup
        name="mobility.requirements"
        label="Mobility Requirements"
      />
    );

    // Click a checkbox
    const wheelchairCheckbox = screen.getByLabelText("Wheelchair");
    fireEvent.click(wheelchairCheckbox);

    // Check if setValue was called with correct parameters
    expect(mockSetValue).toHaveBeenCalledWith(
      "mobility.requirements.wheelchair",
      true,
      { shouldValidate: true }
    );
  });

  it("handles radio button changes correctly", () => {
    render(
      <MobilityCheckboxGroup name="mobility.level" label="Mobility Level" />
    );

    // Click a radio button
    const mediumRadio = screen.getByLabelText("Medium");
    fireEvent.click(mediumRadio);

    // Check if setValue was called with correct parameters
    expect(mockSetValue).toHaveBeenCalledWith("mobility.level", "medium", {
      shouldValidate: true,
    });
  });

  it("displays validation errors when required", () => {
    const mockErrors = {
      "mobility.requirements": {
        message: "Please select at least one requirement",
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

    render(
      <MobilityCheckboxGroup
        name="mobility.requirements"
        label="Mobility Requirements"
        required
      />
    );

    // Check if error message is displayed
    expect(
      screen.getByText("Please select at least one requirement")
    ).toBeInTheDocument();
  });

  it("renders in read-only mode when specified", () => {
    render(
      <MobilityCheckboxGroup
        name="mobility.requirements"
        label="Mobility Requirements"
        readOnly
      />
    );

    // Check if inputs are disabled
    const inputs = screen.getAllByRole("checkbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-class";
    render(
      <MobilityCheckboxGroup
        name="mobility.requirements"
        label="Mobility Requirements"
        className={customClass}
      />
    );

    // Check if custom class is applied
    const container = screen.getByTestId("mobility-checkbox-group");
    expect(container).toHaveClass(customClass);
  });

  it("renders with correct label and description", () => {
    const label = "Custom Label";
    const description = "Custom Description";

    render(
      <MobilityCheckboxGroup
        name="mobility.requirements"
        label={label}
        description={description}
      />
    );

    // Check if label and description are rendered
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("renders mobility limitations sliders", () => {
    render(
      <MobilityCheckboxGroup
        name="mobility.limitations"
        label="Mobility Limitations"
      />
    );

    // Check if all limitation sliders are rendered
    expect(screen.getByLabelText("Walking Distance")).toBeInTheDocument();
    expect(screen.getByLabelText("Standing Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Stairs")).toBeInTheDocument();
  });

  it("handles slider changes correctly", () => {
    render(
      <MobilityCheckboxGroup
        name="mobility.limitations"
        label="Mobility Limitations"
      />
    );

    // Change a slider value
    const walkingDistanceSlider = screen.getByLabelText("Walking Distance");
    fireEvent.change(walkingDistanceSlider, { target: { value: "75" } });

    // Check if setValue was called with correct parameters
    expect(mockSetValue).toHaveBeenCalledWith(
      "mobility.limitations.walkingDistance",
      75,
      { shouldValidate: true }
    );
  });
});
