/**
 * Mobility Requirements Interface
 * Defines the structure for user mobility and accessibility needs
 */

/**
 * Types of mobility assistance
 */
export enum MobilityAssistance {
  WHEELCHAIR = "wheelchair",
  WALKER = "walker",
  CANE = "cane",
  CRUTCHES = "crutches",
  SERVICE_ANIMAL = "service-animal",
  NONE = "none",
}

/**
 * Accessibility features
 */
export enum AccessibilityFeature {
  WHEELCHAIR_ACCESSIBLE = "wheelchair-accessible",
  ELEVATOR_ACCESS = "elevator-access",
  GROUND_FLOOR_ACCESS = "ground-floor-access",
  ACCESSIBLE_BATHROOM = "accessible-bathroom",
  ACCESSIBLE_TRANSPORTATION = "accessible-transportation",
  STEP_FREE_ACCESS = "step-free-access",
  AUDIO_GUIDANCE = "audio-guidance",
  VISUAL_ALERTS = "visual-alerts",
}

/**
 * Mobility requirements interface
 */
export interface MobilityRequirements {
  /**
   * Type of mobility assistance needed
   */
  assistanceType: MobilityAssistance[];

  /**
   * Required accessibility features
   */
  requiredFeatures: AccessibilityFeature[];

  /**
   * Maximum walking distance in meters
   */
  maxWalkingDistance?: number;

  /**
   * Maximum number of stairs acceptable
   */
  maxStairs?: number;

  /**
   * Additional mobility notes or requirements
   */
  additionalNotes?: string;

  /**
   * Importance level of mobility requirements (1-5)
   * 1 = Nice to have, 5 = Absolute requirement
   */
  importanceLevel: number;
}
