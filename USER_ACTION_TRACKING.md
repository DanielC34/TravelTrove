# User Action Tracking System

## 🎯 Overview

A comprehensive user action tracking system that records, stores, and analyzes user interactions with the Travel Trove application. This system tracks user behavior to provide insights, improve recommendations, and enhance the user experience.

## 🚀 Features Implemented

### Backend (Node.js/Express/MongoDB)

#### 1. **User Action Model** (`server/src/models/userAction.model.ts`)

- **Action Types**: `search`, `add_poi`, `like`, `view_place`, `add_to_itinerary`, `remove_from_itinerary`, `share`, `bookmark`
- **Rich Metadata**: Query strings, place details, coordinates, trip information, source tracking
- **Analytics Methods**: Built-in aggregation for user stats, popular places, and search analytics
- **Indexing**: Optimized database indexes for efficient queries

#### 2. **User Action Service** (`server/src/services/userAction.service.ts`)

- **Record Actions**: Single and batch action recording
- **Analytics Queries**: User statistics, popular places, search analytics
- **Data Management**: Recent actions, place-specific actions, cleanup utilities
- **Error Handling**: Comprehensive error handling and logging

#### 3. **User Action Controller** (`server/src/controllers/userAction.controller.ts`)

- **RESTful API**: Full CRUD operations for user actions
- **Authentication**: All endpoints require user authentication
- **Validation**: Input validation and sanitization
- **Response Formatting**: Consistent API response structure

#### 4. **API Routes** (`server/src/routes/userAction.routes.ts`)

```
POST   /api/user-actions                    # Record single action
POST   /api/user-actions/batch              # Record multiple actions
GET    /api/user-actions/stats              # Get user statistics
GET    /api/user-actions/recent             # Get recent actions
GET    /api/user-actions/counts             # Get action counts by type
GET    /api/user-actions/place/:placeId     # Get place-specific actions
GET    /api/user-actions/analytics/popular-places  # Get popular places
GET    /api/user-actions/analytics/search   # Get search analytics
```

### Frontend (React/TypeScript)

#### 1. **User Action Service** (`client/src/services/userActionService.ts`)

- **Action Recording**: Easy-to-use methods for recording different action types
- **Batch Processing**: Automatic batching and queue management
- **Session Tracking**: Unique session IDs for user session analysis
- **Offline Support**: Queue actions when offline, sync when online
- **Error Handling**: Graceful error handling and retry logic

#### 2. **Integrated Components**

##### **PlacesMap Component** (`client/src/components/map/PlacesMap.tsx`)

- **Search Tracking**: Records search queries and result counts
- **Place Selection**: Tracks when users select places
- **Like Functionality**: Heart button to like/unlike places
- **Visual Feedback**: Red heart for liked places, toast notifications

##### **AddToItineraryDialog** (`client/src/components/map/AddToItineraryDialog.tsx`)

- **Itinerary Tracking**: Records when places are added to itineraries
- **Metadata Capture**: Trip ID, day number, priority, source tracking

#### 3. **Analytics Dashboard** (`client/src/components/analytics/UserActionAnalytics.tsx`)

- **User Statistics**: Action counts and last activity timestamps
- **Popular Places**: Most interacted-with places
- **Search History**: Search queries and result analytics
- **Visual Design**: Clean, responsive UI with icons and badges
- **Real-time Updates**: Refresh button for latest data

#### 4. **Analytics Page** (`client/src/pages/Analytics.tsx`)

- **Protected Route**: Requires authentication
- **Navigation Integration**: Added to main navigation menu
- **Responsive Design**: Works on desktop and mobile

## 📊 Tracked Actions

### 1. **Search Actions**

```typescript
{
  actionType: 'search',
  metadata: {
    query: 'restaurants in Paris',
    resultCount: 15,
    source: 'map',
    coordinates: { lat: 48.8566, lng: 2.3522 }
  }
}
```

### 2. **Add POI Actions**

```typescript
{
  actionType: 'add_poi',
  metadata: {
    placeId: 'place_123',
    placeName: 'Eiffel Tower',
    placeCategory: 'landmark',
    source: 'map',
    coordinates: { lat: 48.8584, lng: 2.2945 }
  }
}
```

### 3. **Like Actions**

```typescript
{
  actionType: 'like',
  metadata: {
    placeId: 'place_123',
    placeName: 'Eiffel Tower',
    placeCategory: 'landmark',
    source: 'map'
  }
}
```

### 4. **Add to Itinerary Actions**

```typescript
{
  actionType: 'add_to_itinerary',
  metadata: {
    placeId: 'place_123',
    placeName: 'Eiffel Tower',
    placeCategory: 'landmark',
    tripId: 'trip_456',
    dayNumber: 1,
    priority: 'must-see',
    source: 'itinerary_dialog'
  }
}
```

## 🎨 User Interface

### **Like Button Integration**

- **Visual Design**: Heart icon that fills when liked
- **Color Coding**: Red color for liked places
- **Toast Feedback**: Success messages for like/unlike actions
- **State Management**: Local state tracking of liked places

### **Analytics Dashboard**

- **Action Statistics**: Cards showing action counts with icons
- **Popular Places**: Ranked list of most interacted places
- **Search History**: Recent searches with result counts
- **Responsive Layout**: Grid layout that adapts to screen size

## 🔧 Technical Implementation

### **Backend Architecture**

- **MongoDB**: Document-based storage for flexible metadata
- **Mongoose**: ODM with schema validation and middleware
- **Express**: RESTful API with middleware for auth and validation
- **TypeScript**: Type-safe development with interfaces

### **Frontend Architecture**

- **React**: Component-based UI with hooks
- **TypeScript**: Type-safe development
- **Zustand**: State management for user actions
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library for consistent UI

### **Data Flow**

1. **User Action** → Frontend component
2. **Action Recording** → userActionService
3. **Queue Management** → Batch processing
4. **API Call** → Backend controller
5. **Database Storage** → MongoDB
6. **Analytics** → Aggregation queries
7. **Dashboard Display** → React components

## 🚀 Usage

### **Recording Actions**

```typescript
// Search action
await userActionService.recordSearch("restaurants in Paris", 15, "map");

// Like action
await userActionService.recordLike(place, "map");

// Add to itinerary
await userActionService.recordAddToItinerary(
  place,
  tripId,
  dayNumber,
  priority,
  "dialog"
);
```

### **Viewing Analytics**

1. Navigate to `/analytics` page
2. View your action statistics
3. See popular places you've interacted with
4. Review your search history
5. Refresh for latest data

## 🔮 Future Enhancements

### **Potential Features**

- **Recommendation Engine**: Use action data for personalized recommendations
- **Heat Maps**: Visual representation of user activity
- **Export Data**: Download user action data
- **Privacy Controls**: User settings for data collection
- **Real-time Analytics**: Live updates of user actions
- **A/B Testing**: Track feature usage and effectiveness

### **Advanced Analytics**

- **User Journey Mapping**: Track complete user flows
- **Conversion Funnels**: Analyze action-to-conversion rates
- **Cohort Analysis**: Group users by behavior patterns
- **Predictive Analytics**: ML-based user behavior prediction

## 🧪 Testing

### **Test Script**

Run `node test-user-actions.js` to verify the system structure and endpoints.

### **Manual Testing**

1. Start the server: `npm run dev`
2. Navigate to `/map-test` page
3. Perform searches, like places, add to itinerary
4. Check `/analytics` page for recorded actions
5. Verify data persistence across sessions

## 📈 Benefits

### **For Users**

- **Personalized Experience**: Better recommendations based on behavior
- **Activity Tracking**: See your travel planning progress
- **Favorites Management**: Easy like/unlike functionality

### **For Developers**

- **User Insights**: Understand how users interact with the app
- **Feature Usage**: Track which features are most popular
- **Performance Metrics**: Monitor user engagement
- **Data-Driven Decisions**: Make informed product decisions

### **For Business**

- **User Engagement**: Measure and improve user retention
- **Feature Adoption**: Track new feature usage
- **Content Optimization**: Identify popular places and content
- **Growth Analytics**: Monitor user growth and activity patterns

## 🔒 Privacy & Security

### **Data Protection**

- **User Authentication**: All actions tied to authenticated users
- **Data Minimization**: Only collect necessary metadata
- **Secure Storage**: Encrypted data in MongoDB
- **Access Control**: User can only see their own data

### **Compliance**

- **GDPR Ready**: User data can be exported/deleted
- **Transparent**: Clear about what data is collected
- **Consent**: Users can control their data collection

---

## 🎉 Summary

The User Action Tracking System provides a comprehensive solution for recording, storing, and analyzing user interactions with the Travel Trove application. It includes both backend infrastructure and frontend integration, with a beautiful analytics dashboard for users to view their activity data.

The system is designed to be scalable, maintainable, and privacy-conscious, providing valuable insights while respecting user privacy and data protection requirements.
