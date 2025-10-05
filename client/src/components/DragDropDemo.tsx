import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Clock, MapPin, DollarSign } from 'lucide-react';

interface DemoActivity {
  id: string;
  name: string;
  location: string;
  startTime: string;
  endTime: string;
  category: string;
  cost: number;
  priority: 'must-see' | 'recommended' | 'optional';
}

const initialActivities: DemoActivity[] = [
  {
    id: '1',
    name: 'Visit Eiffel Tower',
    location: 'Champ de Mars',
    startTime: '09:00',
    endTime: '11:00',
    category: 'attraction',
    cost: 25,
    priority: 'must-see'
  },
  {
    id: '2',
    name: 'Lunch at Bistro',
    location: 'Latin Quarter',
    startTime: '12:00',
    endTime: '13:30',
    category: 'restaurant',
    cost: 45,
    priority: 'recommended'
  },
  {
    id: '3',
    name: 'Seine River Cruise',
    location: 'Port de la Bourdonnais',
    startTime: '15:00',
    endTime: '16:30',
    category: 'activity',
    cost: 15,
    priority: 'optional'
  },
  {
    id: '4',
    name: 'Louvre Museum',
    location: 'Rue de Rivoli',
    startTime: '17:00',
    endTime: '19:00',
    category: 'attraction',
    cost: 17,
    priority: 'must-see'
  }
];

export function DragDropDemo() {
  const [activities, setActivities] = useState(initialActivities);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(activities);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setActivities(items);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'attraction': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'activity': return '🎯';
      default: return '📍';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'must-see': return 'bg-red-100 text-red-800';
      case 'recommended': return 'bg-blue-100 text-blue-800';
      case 'optional': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Day 1 - Paris Itinerary (Drag to Reorder)</CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="activities">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {activities.map((activity, index) => (
                  <Draggable key={activity.id} draggableId={activity.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border rounded-lg p-4 bg-white transition-shadow ${
                          snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            {...provided.dragHandleProps}
                            className="mt-1 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">
                                {getCategoryIcon(activity.category)}
                              </span>
                              <h4 className="font-semibold">{activity.name}</h4>
                              <Badge className={getPriorityColor(activity.priority)}>
                                {activity.priority}
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {activity.startTime} - {activity.endTime}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {activity.location}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="mr-1 h-3 w-3" />
                                ${activity.cost}
                              </span>
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
        </DragDropContext>
      </CardContent>
    </Card>
  );
}