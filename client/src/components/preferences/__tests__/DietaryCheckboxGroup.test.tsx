import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DietaryCheckboxGroup } from "../DietaryCheckboxGroup";
import { FormProvider, useForm } from "react-hook-form";

// Mock react-hook-form
vi.mock("react-hook-form", () => ({
  useForm: vi.fn(),
  FormProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("DietaryCheckboxGroup", () => {
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

  it("renders all dietary restriction checkboxes", () => {
    render(
      <DietaryCheckboxGroup
        name="dietary.restrictions"
        label="Dietary Restrictions"
      />
    );

    // Check if all restriction checkboxes are rendered
    expect(screen.getByLabelText("Vegetarian")).toBeInTheDocument();
    expect(screen.getByLabelText("Vegan")).toBeInTheDocument();
    expect(screen.getByLabelText("Gluten Free")).toBeInTheDocument();
    expect(screen.getByLabelText("Dairy Free")).toBeInTheDocument();
    expect(screen.getByLabelText("Nut Free")).toBeInTheDocument();
    expect(screen.getByLabelText("Halal")).toBeInTheDocument();
    expect(screen.getByLabelText("Kosher")).toBeInTheDocument();
  });

  it("renders all dietary preference checkboxes", () => {
    render(
      <DietaryCheckboxGroup
        name="dietary.preferences"
        label="Dietary Preferences"
      />
    );

    // Check if all preference checkboxes are rendered
    expect(screen.getByLabelText("Spicy")).toBeInTheDocument();
    expect(screen.getByLabelText("Local")).toBeInTheDocument();
    expect(screen.getByLabelText("Organic")).toBeInTheDocument();
    expect(screen.getByLabelText("Street Food")).toBeInTheDocument();
  });

  it("registers all checkboxes with react-hook-form", () => {
    render(
      <DietaryCheckboxGroup
        name="dietary.restrictions"
        label="Dietary Restrictions"
      />
    );

    // Check if register was called for each checkbox
    expect(mockRegister).toHaveBeenCalledTimes(7); // 7 restriction checkboxes
  });

  it("handles checkbox changes correctly", () => {
    render(
      <DietaryCheckboxGroup
        name="dietary.restrictions"
        label="Dietary Restrictions"
      />
    );

    // Click a checkbox
    const vegetarianCheckbox = screen.getByLabelText("Vegetarian");
    fireEvent.click(vegetarianCheckbox);

    // Check if setValue was called with correct parameters
    expect(mockSetValue).toHaveBeenCalledWith(
      "dietary.restrictions.vegetarian",
      true,
      { shouldValidate: true }
    );
  });

  it("displays validation errors when required", () => {
    const mockErrors = {
      "dietary.restrictions": {
        message: "At least one restriction must be selected",
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
      <DietaryCheckboxGroup
        name="dietary.restrictions"
        label="Dietary Restrictions"
        required
      />
    );

    // Check if error message is displayed
    expect(
      screen.getByText("At least one restriction must be selected")
    ).toBeInTheDocument();
  });

  it("renders in read-only mode when specified", () => {
    render(
      <DietaryCheckboxGroup
        name="dietary.restrictions"
        label="Dietary Restrictions"
        readOnly
      />
    );

    // Check if checkboxes are disabled
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-class";
    render(
      <DietaryCheckboxGroup
        name="dietary.restrictions"
        label="Dietary Restrictions"
        className={customClass}
      />
    );

    // Check if custom class is applied
    const container = screen.getByTestId("dietary-checkbox-group");
    expect(container).toHaveClass(customClass);
  });

  it("renders with correct label and description", () => {
    const label = "Custom Label";
    const description = "Custom Description";

    render(
      <DietaryCheckboxGroup
        name="dietary.restrictions"
        label={label}
        description={description}
      />
    );

    // Check if label and description are rendered
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });
});
