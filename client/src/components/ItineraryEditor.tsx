import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Clock,
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  GripVertical,
} from "lucide-react";
import { ItineraryDay } from "@/services/aiService";
import { toast } from "sonner";

interface ItineraryEditorProps {
  days: ItineraryDay[];
  onSave: (updatedDays: ItineraryDay[]) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function ItineraryEditor({
  days,
  onSave,
  onCancel,
  isEditing,
}: ItineraryEditorProps) {
  const [editedDays, setEditedDays] = useState<ItineraryDay[]>(days);
  const [editingActivity, setEditingActivity] = useState<{
    dayIndex: number;
    activityIndex: number;
  } | null>(null);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const newDays = [...editedDays];

      // Handle moving activities within the same day
      if (source.droppableId === destination.droppableId) {
        const dayIndex = parseInt(source.droppableId);
        const day = newDays[dayIndex];
        const activities = [...day.activities];
        const [removed] = activities.splice(source.index, 1);
        activities.splice(destination.index, 0, removed);
        newDays[dayIndex] = { ...day, activities };
      } else {
        // Handle moving activities between days
        const sourceDayIndex = parseInt(source.droppableId);
        const destDayIndex = parseInt(destination.droppableId);
        const sourceDay = newDays[sourceDayIndex];
        const destDay = newDays[destDayIndex];

        const sourceActivities = [...sourceDay.activities];
        const destActivities = [...destDay.activities];
        const [removed] = sourceActivities.splice(source.index, 1);
        destActivities.splice(destination.index, 0, removed);

        newDays[sourceDayIndex] = {
          ...sourceDay,
          activities: sourceActivities,
        };
        newDays[destDayIndex] = { ...destDay, activities: destActivities };
      }

      setEditedDays(newDays);
    },
    [editedDays]
  );

  const handleEditActivity = (dayIndex: number, activityIndex: number) => {
    setEditingActivity({ dayIndex, activityIndex });
  };

  const handleSaveActivity = (updatedActivity: any) => {
    if (!editingActivity) return;

    const { dayIndex, activityIndex } = editingActivity;
    const newDays = [...editedDays];
    newDays[dayIndex].activities[activityIndex] = updatedActivity;
    setEditedDays(newDays);
    setEditingActivity(null);
    toast.success("Activity updated successfully!");
  };

  const handleDeleteActivity = (dayIndex: number, activityIndex: number) => {
    const newDays = [...editedDays];
    newDays[dayIndex].activities.splice(activityIndex, 1);
    setEditedDays(newDays);
    toast.success("Activity deleted successfully!");
  };

  const handleAddActivity = (dayIndex: number) => {
    const newActivity = {
      name: "New Activity",
      description: "",
      location: { name: "Location" },
      startTime: "09:00",
      endTime: "10:00",
      duration: 60,
      category: "activity" as const,
      cost: { amount: 0, currency: "USD" },
      notes: "",
      isFlexible: true,
      priority: "recommended" as const,
    };

    const newDays = [...editedDays];
    newDays[dayIndex].activities.push(newActivity);
    setEditedDays(newDays);
    setEditingActivity({
      dayIndex,
      activityIndex: newDays[dayIndex].activities.length - 1,
    });
  };

  const handleSave = () => {
    onSave(editedDays);
    toast.success("Itinerary saved successfully!");
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "attraction":
        return "🏛️";
      case "restaurant":
        return "🍽️";
      case "transport":
        return "🚗";
      case "accommodation":
        return "🏨";
      case "activity":
        return "🎯";
      default:
        return "📍";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "must-see":
        return "bg-red-100 text-red-800";
      case "recommended":
        return "bg-blue-100 text-blue-800";
      case "optional":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isEditing) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Itinerary</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {editedDays.map((day, dayIndex) => (
            <Card key={dayIndex}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Day {day.dayNumber}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddActivity(dayIndex)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={dayIndex.toString()}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {day.activities.map((activity, activityIndex) => (
                        <Draggable
                          key={activityIndex}
                          draggableId={`${dayIndex}-${activityIndex}`}
                          index={activityIndex}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border rounded-lg p-4 bg-white"
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-1 cursor-grab"
                                >
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-lg">
                                          {getCategoryIcon(activity.category)}
                                        </span>
                                        <h4 className="font-semibold">
                                          {activity.name}
                                        </h4>
                                        <Badge
                                          className={getPriorityColor(
                                            activity.priority
                                          )}
                                        >
                                          {activity.priority}
                                        </Badge>
                                      </div>

                                      {activity.description && (
                                        <p className="text-sm text-gray-600 mb-2">
                                          {activity.description}
                                        </p>
                                      )}

                                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span className="flex items-center">
                                          <Clock className="mr-1 h-3 w-3" />
                                          {formatTime(
                                            activity.startTime
                                          )} - {formatTime(activity.endTime)}
                                        </span>
                                        <span className="flex items-center">
                                          <MapPin className="mr-1 h-3 w-3" />
                                          {activity.location.name}
                                        </span>
                                        {activity.cost && (
                                          <span className="flex items-center">
                                            <DollarSign className="mr-1 h-3 w-3" />
                                            ${activity.cost.amount}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleEditActivity(
                                            dayIndex,
                                            activityIndex
                                          )
                                        }
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleDeleteActivity(
                                            dayIndex,
                                            activityIndex
                                          )
                                        }
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>

      {/* Activity Edit Modal */}
      {editingActivity && (
        <ActivityEditModal
          activity={
            editedDays[editingActivity.dayIndex].activities[
              editingActivity.activityIndex
            ]
          }
          onSave={handleSaveActivity}
          onCancel={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
}

interface ActivityEditModalProps {
  activity: any;
  onSave: (activity: any) => void;
  onCancel: () => void;
}

function ActivityEditModal({
  activity,
  onSave,
  onCancel,
}: ActivityEditModalProps) {
  const [editedActivity, setEditedActivity] = useState(activity);

  const handleSave = () => {
    onSave(editedActivity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Edit Activity</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={editedActivity.name}
              onChange={(e) =>
                setEditedActivity({ ...editedActivity, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              value={editedActivity.description || ""}
              onChange={(e) =>
                setEditedActivity({
                  ...editedActivity,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input
              value={editedActivity.location.name}
              onChange={(e) =>
                setEditedActivity({
                  ...editedActivity,
                  location: {
                    ...editedActivity.location,
                    name: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Time
              </label>
              <Input
                type="time"
                value={editedActivity.startTime}
                onChange={(e) =>
                  setEditedActivity({
                    ...editedActivity,
                    startTime: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <Input
                type="time"
                value={editedActivity.endTime}
                onChange={(e) =>
                  setEditedActivity({
                    ...editedActivity,
                    endTime: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cost</label>
            <Input
              type="number"
              value={editedActivity.cost?.amount || 0}
              onChange={(e) =>
                setEditedActivity({
                  ...editedActivity,
                  cost: {
                    ...editedActivity.cost,
                    amount: parseFloat(e.target.value) || 0,
                  },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea
              value={editedActivity.notes || ""}
              onChange={(e) =>
                setEditedActivity({ ...editedActivity, notes: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}
