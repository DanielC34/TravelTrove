import { Schema, model, Document } from "mongoose";
import { UserPreferences } from "../interfaces/preferences";

interface PreferencesDoc extends UserPreferences, Document {}

const preferencesSchema = new Schema<PreferencesDoc>({
  userId: { type: String, required: true, unique: true },
  dietary: [String],
  mobility: [String],
  interests: [{ name: String, priority: Number }],
  budget: { type: String },
  dailyBudget: { min: Number, max: Number },
  accommodation: [String],
  activityComfort: [{ activity: String, comfortLevel: Number }],
  notes: String,
});

export const PreferencesModel = model<PreferencesDoc>(
  "Preferences",
  preferencesSchema
);
