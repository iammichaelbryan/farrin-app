# Farrin Travel Companion - Appendix

## Questionnaire Questions and Options

This appendix provides a comprehensive list of all questionnaire questions and their available options in the Farrin Travel Companion application.

---

## Step 1: Travel Interest & Budget

### Primary Travel Interest (Single Selection Required)
**Question**: What is your primary travel interest?

**Options**:
1. **Adventure** 🏔️
   - Description: Hiking, extreme sports, outdoor activities
   - Value: `ADVENTURE`

2. **Relaxation** 🧘‍♀️
   - Description: Spas, beaches, peaceful retreats
   - Value: `RELAXATION`

3. **Cultural Experience** 🏛️
   - Description: Museums, local traditions, history
   - Value: `CULTURAL_EXPERIENCE`

4. **Nature** 🌿
   - Description: Wildlife, national parks, natural wonders
   - Value: `NATURE`

---

### Travel Style (Single Selection Required)
**Question**: What describes your travel style best?

**Options**:
1. **Casual Explorer**
   - Description: Relaxed pace, spontaneous
   - Value: `CASUAL`

2. **Frequent Traveler**
   - Description: Regular trips, experienced
   - Value: `FREQUENT`

3. **Business Traveler**
   - Description: Efficient, professional
   - Value: `BUSINESS`

4. **Travel Enthusiast**
   - Description: Deep experiences, immersive
   - Value: `ENTHUSIAST`

5. **Travel Organizer**
   - Description: Detailed planning, group coordination
   - Value: `ORGANIZER`

---

### Average Travel Duration (Slider Input Required)
**Question**: What's your typical trip duration?

**Input Type**: Range slider
- **Minimum**: 1 day
- **Maximum**: 30 days
- **Default**: 7 days
- **Display**: Shows selected value in days
- **Value**: Integer (1-30)

---

### Transportation Preference (Single Selection Required)
**Question**: What is your preferred transportation method?

**Options**:
1. **Flights** ✈️
   - Description: Air travel for faster long-distance trips
   - Value: `FLIGHTS`

*Note: Currently, only flights are supported as a transportation option.*

---

### Budget Information (Numeric Input Required)

#### Accommodation Budget
**Question**: What is your accommodation budget per trip?
- **Input Type**: Number field
- **Currency**: USD ($)
- **Placeholder**: $2000
- **Required**: Either accommodation or transportation budget must be provided

#### Transportation Budget
**Question**: What is your transportation budget per trip?
- **Input Type**: Number field
- **Currency**: USD ($)
- **Placeholder**: $1500
- **Required**: Either accommodation or transportation budget must be provided

#### Total Budget (Auto-calculated)
- **Calculation**: Accommodation Budget + Transportation Budget
- **Display**: Shown in highlighted summary box when both values are entered

---

## Step 2: Climate & Season Preferences

### Preferred Climate (Single Selection Required)
**Question**: What climate do you prefer when traveling?

**Options**:
1. **Tropical** 🌴
   - Description: Warm, humid, year-round heat
   - Value: `TROPICAL`

2. **Mediterranean** ☀️
   - Description: Mild winters, warm summers
   - Value: `MEDITERRANEAN`

3. **Continental** 🍂
   - Description: Four distinct seasons
   - Value: `CONTINENTAL`

4. **Arid/Desert** 🏜️
   - Description: Dry, hot days, cool nights
   - Value: `ARID`

5. **Polar/Arctic** ❄️
   - Description: Cold, snow, northern lights
   - Value: `POLAR`

6. **Monsoon** 🌧️
   - Description: Wet and dry seasons
   - Value: `MONSOON`

*Additional climate types available in the system but not shown in questionnaire:*
- `DRY`
- `SEMI_ARID`
- `TUNDRA`

---

### Preferred Travel Season (Single Selection Required)
**Question**: Which season do you prefer to travel in?

**Options**:
1. **Spring** 🌸
   - Description: Mild temperatures, blooming nature
   - Value: `SPRING`

2. **Summer** ☀️
   - Description: Warm weather, long days
   - Value: `SUMMER`

3. **Autumn** 🍁
   - Description: Cool weather, fall colors
   - Value: `AUTUMN`

4. **Winter** ⛄
   - Description: Cold weather, snow activities
   - Value: `WINTER`

---

### Preferred Accommodation Type (Single Selection Required)
**Question**: What type of accommodation do you prefer?

**Options**:
1. **Hotels** 🏨
   - Description: Traditional hotel service with amenities
   - Value: `HOTEL`

2. **AirBnBs** 🏠
   - Description: Private homes, local experience, more space
   - Value: `AIRBNB`

3. **Lodges** 🏔️
   - Description: Nature-focused, rustic charm, unique experiences
   - Value: `LODGE`

---

## Step 3: Privacy & Personalization

### Data Sharing Preferences (Checkbox)
**Question**: Allow Farrin to use my preferences and travel history for personalized recommendations?

**Options**:
- **Checkbox**: Checked (true) or Unchecked (false)
- **Default**: True (checked)
- **Value**: Boolean (`true`/`false`)

**Detailed Description**:
"This helps our AI provide better destination suggestions and travel planning assistance. You can change this setting anytime in your profile."

#### Benefits of Data Sharing:
When enabled, users receive:
- Personalized destination recommendations based on interests
- Budget-appropriate travel suggestions
- Climate and season-based recommendations
- Trip planning tailored to travel style
- Suggestions for places similar to previously enjoyed destinations

---

## Additional Data Types and Enumerations

### Trip Types
Used in trip creation and planning:
- `SOLO` - Solo travel
- `FAMILY` - Family trips
- `FRIENDS` - Group travel with friends

### Trip Status
Trip lifecycle management:
- `PLANNED` - Trip is planned but not started
- `ONGOING` - Trip is currently in progress
- `COMPLETED` - Trip has been completed
- `CANCELLED` - Trip has been cancelled

### Currency Codes
Supported currencies:
- `JMD` - Jamaican Dollar
- `USD` - US Dollar
- `EUR` - Euro
- `AUS` - Australian Dollar
- `GBP` - British Pound
- `CAD` - Canadian Dollar

### Gender Options
User profile configuration:
- `MALE`
- `FEMALE`
- Not specified (optional field)

### Travel History Trip Types
For recording past travel experiences:
- `BUSINESS` - Business travel
- `LEISURE` - Leisure/vacation travel
- `ADVENTURE` - Adventure-focused trips
- `CULTURAL` - Cultural exploration trips
- `RELAXATION` - Relaxation-focused trips

### Travel Goal Categories
For bucket list and goal tracking:
- `DESTINATION` - Destination-specific goals
- `EXPERIENCE` - Experience-based goals
- `BUDGET` - Budget-related goals
- `CULTURAL` - Cultural exploration goals
- `ADVENTURE` - Adventure activity goals

### Bucket List Priorities
For organizing travel wishlist:
- `LOW` - Low priority items
- `MEDIUM` - Medium priority items
- `HIGH` - High priority items

### Accommodation Properties
Additional accommodation details:
- **Room Types**: Various (string field)
- **Children Allowed**: Boolean
- **Price per Night**: Numeric
- **Rating**: 1-5 scale
- **Available Rooms**: Numeric

### Flight Classifications
Flight booking types:
- `ONE_WAY` - One-way flights
- `TWO_WAY` - Round-trip flights

### Booking Status Types
For tracking reservations:
- `BOOKED` - Confirmed booking
- `CANCELLED` - Cancelled booking
- `PENDING` - Pending confirmation

---

## Validation Rules

### Required Fields by Step

#### Step 1 Requirements:
- Primary Interest (must select one)
- Travel Style (must select one)
- Average Travel Duration (must set slider value)
- Transport Preference (must select one)
- Budget (at least one of accommodation or transportation budget)

#### Step 2 Requirements:
- Preferred Climate (must select one)
- Preferred Travel Season (must select one)
- Preferred Accommodation (must select one)

#### Step 3 Requirements:
- Data Sharing (has default value, no validation needed)

### Input Constraints:
- **Budget fields**: Must be positive numbers
- **Travel duration**: Must be between 1-30 days
- **Email addresses**: Must be valid email format
- **Dates**: Must be valid date format
- **Ratings**: Must be between 1-5

---

## Default Values

When the questionnaire initializes, these are the default values:

```javascript
{
  accommodationBudget: '', // Empty string
  transportationBudget: '', // Empty string
  totalBudget: '', // Empty string (calculated)
  primaryInterest: 'ADVENTURE',
  preferredTravelStyle: 'CASUAL',
  preferredClimate: 'MEDITERRANEAN',
  preferredTravelSeason: 'SUMMER',
  preferredAccommodation: 'HOTEL',
  avgTravelDuration: 7, // 7 days
  transportPreference: 'FLIGHTS',
  dataSharing: true // Enabled by default
}
```

---

## Integration with Backend

### API Endpoints
The questionnaire data is processed and sent to:
- **Preferences Update**: `PUT /api/preferences`
- **User Profile Update**: `PUT /api/profile`

### Data Transformation
Questionnaire responses are transformed into the backend preference format:
- Budget strings are converted to integers
- Enum values are validated against backend enums
- User ID is automatically associated with preferences

### Storage
- Preferences are stored in the user preferences table
- Questionnaire raw data is cached in localStorage
- Data sharing preferences affect recommendation algorithm behavior

---

**Version**: 1.0  
**Last Updated**: June 2025  
**© 2025 Farrin Travel Companion. All rights reserved.**