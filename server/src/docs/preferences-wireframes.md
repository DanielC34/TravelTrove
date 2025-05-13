# User Preferences UI Flow & Wireframes

## Navigation Structure
```
User Profile
└── Preferences
    ├── Basic Info
    ├── Travel Style
    ├── Dietary Needs
    ├── Mobility & Accessibility
    ├── Budget & Accommodations
    └── Activity Preferences
```

## Multi-Step Form Layout
Each step includes:
- Progress indicator
- Clear section title
- Save & Continue button
- Back button (except first step)
- Skip option (where applicable)

## Step-by-Step Screens

### 1. Basic Info & Travel Style
```
┌────────────────────────────┐
│ Your Travel Preferences    │
├────────────────────────────┤
│ [Progress: 1/6]           │
│                           │
│ Travel Style              │
│ ○ Adventure              │
│ ○ Relaxation            │
│ ○ Cultural              │
│ ○ Foodie               │
│                           │
│ Must-Have Experiences     │
│ □ Outdoor Activities     │
│ □ Cultural Events       │
│ □ Local Cuisine         │
│ □ Shopping              │
│                           │
│ [Continue]               │
└────────────────────────────┘
```

### 2. Dietary Preferences
```
┌────────────────────────────┐
│ Dietary Requirements       │
├────────────────────────────┤
│ [Progress: 2/6]           │
│                           │
│ Dietary Restrictions      │
│ □ Vegetarian            │
│ □ Vegan                │
│ □ Gluten-Free          │
│ □ Other                │
│                           │
│ Allergies                │
│ [Add Allergy +]          │
│                           │
│ Additional Notes         │
│ [Text Area]              │
│                           │
│ [Back] [Continue]        │
└────────────────────────────┘
```

### 3. Mobility & Accessibility
```
┌────────────────────────────┐
│ Mobility Requirements      │
├────────────────────────────┤
│ [Progress: 3/6]           │
│                           │
│ Mobility Level           │
│ ○ No Restrictions       │
│ ○ Some Restrictions     │
│ ○ Wheelchair Required   │
│                           │
│ Maximum Walking Distance │
│ [Slider Control]         │
│                           │
│ Additional Needs         │
│ [Text Area]              │
│                           │
│ [Back] [Continue]        │
└────────────────────────────┘
```

### 4. Budget & Accommodations
```
┌────────────────────────────┐
│ Budget Preferences         │
├────────────────────────────┤
│ [Progress: 4/6]           │
│                           │
│ Daily Budget Range        │
│ Min: [Input] Max: [Input] │
│                           │
│ Preferred Accommodation   │
│ □ Hotels                │
│ □ Hostels              │
│ □ Apartments           │
│ □ Resorts              │
│                           │
│ Comfort Level           │
│ [1-5 Star Selection]     │
│                           │
│ [Back] [Continue]        │
└────────────────────────────┘
```

### 5. Activity Preferences
```
┌────────────────────────────┐
│ Activity Comfort Levels    │
├────────────────────────────┤
│ [Progress: 5/6]           │
│                           │
│ Rate Your Comfort (1-5)   │
│                           │
│ Hiking Difficulty        │
│ [Slider 1-5]             │
│                           │
│ Water Activities         │
│ [Slider 1-5]             │
│                           │
│ Heights & Adventure      │
│ [Slider 1-5]             │
│                           │
│ Crowds & Busy Places     │
│ [Slider 1-5]             │
│                           │
│ [Back] [Complete]        │
└────────────────────────────┘
```

## Component Library Usage
- Form Controls: shadcn/ui components
- Layout: Responsive grid system
- Navigation: Multi-step form with progress
- Feedback: Toast notifications
- Validation: Form validation with error messages

## Responsive Considerations
- Mobile-first design
- Touch-friendly controls
- Collapsible sections on small screens
- Sticky progress indicator
- Save progress on all devices