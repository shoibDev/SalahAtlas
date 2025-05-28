# Jummah Detail Page Features

This document explains the features added to the Jummah Detail page.

## Overview

The Jummah Detail page has been updated to include the following features:
- Join/Leave buttons for attendees
- Remove attendee functionality for the organizer
- Delete Jummah functionality for the organizer

## Implementation Details

### User Identification

The implementation uses a placeholder for the current user's ID. This should be replaced with the actual user ID from authentication.

```typescript
// TODO: Replace this with actual user ID from authentication
// This is a placeholder and should be replaced with the actual user ID
const currentUserId = "placeholder-user-id";
```

### Join/Leave Functionality

Non-organizers can join or leave a Jummah event:
- If the user is not an attendee, a "Join Jummah" button is displayed
- If the user is already an attendee, a "Leave Jummah" button is displayed

The implementation uses the following API functions:
- `joinJummah(jummahId, accountId)` - Adds the user as an attendee
- `leaveJummah(jummahId, accountId)` - Removes the user from attendees

### Remove Attendee Functionality

The organizer can remove attendees from the Jummah event:
- In the attendees modal, a "Remove" button is displayed next to each attendee (except the organizer)
- Clicking the button removes the attendee from the Jummah event

The implementation uses the `removeAttendee(jummahId, accountId)` API function.

### Delete Jummah Functionality

The organizer can delete the Jummah event:
- A "Delete Jummah" button is displayed only for the organizer
- Clicking the button shows a confirmation modal
- Confirming the deletion deletes the Jummah event and navigates back

The implementation uses the `deleteJummah(jummahId)` API function.

## UI Components

### Action Buttons

Action buttons (Join, Leave, Delete) are styled with appropriate colors:
- Join button: Green
- Leave button: Orange
- Delete button: Red

### Modals

Two modals are implemented:
1. Attendees Modal - Shows the list of attendees with remove buttons for the organizer
2. Delete Confirmation Modal - Confirms the deletion of a Jummah event

## Future Improvements

1. Replace the placeholder user ID with the actual user ID from authentication
2. Add error handling with more specific error messages
3. Add confirmation for leaving a Jummah event
4. Add loading indicators for all actions