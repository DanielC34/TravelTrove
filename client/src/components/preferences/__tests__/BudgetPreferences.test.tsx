import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BudgetPreferences } from "../BudgetPreferences";
import { FormProvider, useForm } from "react-hook-form";

// Mock react-hook-form
vi.mock("react-hook-form", () => ({
  useForm: vi.fn(),
  FormProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("BudgetPreferences", () => {
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

  it("renders all budget preference inputs", () => {
    render(<BudgetPreferences />);

    // Check if all inputs are rendered
    expect(screen.getByLabelText("Daily Budget")).toBeInTheDocument();
    expect(screen.getByLabelText("Accommodation Budget")).toBeInTheDocument();
    expect(screen.getByLabelText("Food Budget")).toBeInTheDocument();
    expect(screen.getByLabelText("Activities Budget")).toBeInTheDocument();
    expect(screen.getByLabelText("Transportation Budget")).toBeInTheDocument();
  });

  it("registers all inputs with react-hook-form", () => {
    render(<BudgetPreferences />);

    // Check if register was called for each input
    expect(mockRegister).toHaveBeenCalledTimes(5); // 5 budget inputs
  });

  it("handles input changes correctly", () => {
    render(<BudgetPreferences />);

    // Change a budget value
    const dailyBudgetInput = screen.getByLabelText("Daily Budget");
    fireEvent.change(dailyBudgetInput, { target: { value: "100" } });

    // Check if setValue was called with correct parameters
    expect(mockSetValue).toHaveBeenCalledWith("budget.daily", 100, {
      shouldValidate: true,
    });
  });

  it("displays validation errors when required", () => {
    const mockErrors = {
      "budget.daily": {
        message: "Daily budget is required",
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

    render(<BudgetPreferences />);

    // Check if error message is displayed
    expect(screen.getByText("Daily budget is required")).toBeInTheDocument();
  });

  it("renders in read-only mode when specified", () => {
    render(<BudgetPreferences readOnly />);

    // Check if inputs are disabled
    const inputs = screen.getAllByRole("spinbutton");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-class";
    render(<BudgetPreferences className={customClass} />);

    // Check if custom class is applied
    const container = screen.getByTestId("budget-preferences");
    expect(container).toHaveClass(customClass);
  });

  it("renders with correct label and description", () => {
    const label = "Custom Label";
    const description = "Custom Description";

    render(<BudgetPreferences label={label} description={description} />);

    // Check if label and description are rendered
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("validates minimum budget values", () => {
    render(<BudgetPreferences />);

    // Try to set a negative value
    const dailyBudgetInput = screen.getByLabelText("Daily Budget");
    fireEvent.change(dailyBudgetInput, { target: { value: "-50" } });

    // Check if setValue was called with the minimum value (0)
    expect(mockSetValue).toHaveBeenCalledWith("budget.daily", 0, {
      shouldValidate: true,
    });
  });

  it("validates maximum budget values", () => {
    render(<BudgetPreferences />);

    // Try to set a value above the maximum
    const dailyBudgetInput = screen.getByLabelText("Daily Budget");
    fireEvent.change(dailyBudgetInput, { target: { value: "1000000" } });

    // Check if setValue was called with the maximum value
    expect(mockSetValue).toHaveBeenCalledWith("budget.daily", 100000, {
      shouldValidate: true,
    });
  });

  it("updates total budget when individual budgets change", () => {
    render(<BudgetPreferences />);

    // Set individual budget values
    const accommodationBudgetInput = screen.getByLabelText(
      "Accommodation Budget"
    );
    const foodBudgetInput = screen.getByLabelText("Food Budget");
    const activitiesBudgetInput = screen.getByLabelText("Activities Budget");
    const transportationBudgetInput = screen.getByLabelText(
      "Transportation Budget"
    );

    fireEvent.change(accommodationBudgetInput, { target: { value: "100" } });
    fireEvent.change(foodBudgetInput, { target: { value: "50" } });
    fireEvent.change(activitiesBudgetInput, { target: { value: "75" } });
    fireEvent.change(transportationBudgetInput, { target: { value: "25" } });

    // Check if total budget is updated
    expect(screen.getByText("Total Daily Budget: $250")).toBeInTheDocument();
  });
});
