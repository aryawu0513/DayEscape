# DayEscape - Alpha version

## Overview

Our Trip Planner app has successfully implemented all core features, and we partially implemented some additional features after the Alpha version.  

## Current Issues

No known issues in this phase of the implementation. Issues from alpha version are resolved.

## Changes made from Alpha version

1. **CSS Styling:** We did some CSS styling to a give a more unifying look. All buttons are switch to react paper buttons with unified color palette to match our figma mock up.

2. **Solved all known bugs and errors:** We solve issues remained from alpha version, like navigation errors and page jumping, as well as real-time update of new routes.

3. **Photo taking feature:** An additional feature that we implemented is adding photos to trip summary screen, user can upload multiple photos to a trip and they will be shown in a gallery mode. User can delete photos using delete icon on every image. But picture upload feature only exist locally for now and pictures are not uploaded to firebase yet.

4. **Location search using Google Places API:**  When adding a new place to saved places, in addition to putting down pins on a map, user have a search bar where they can look up a place by putting in a name or address, we make calls to Google API using `react-native-google-places-autocomplete` to give users a list of related places for them to select from. Places they select from the related places will show up as a pin on a map below the search bar, and user can change this selection by touching the map to create a new selecion, or search for another place in the search bar. User will still be prompted to create a name for their selected place, but if user selected a place from the search bar and not directly from the map, the name of that place will be retrieved from Google API and autofilled, user will be given the choice to edit the name. This feature allows more accurately location pinning when user need it, and user can choose to touch map and place pin if a place does not exist in the API. 

## Work Plan

We will be working on different additional features concurrently whenever we have time.

### 12.18

- Finish all additional features.
- Photo feature will be implemented as a remote feature using firebase.
- Modify app so that user can only view their own trips and places

### 12.21

- Finish final round of css styling
- User testing to find bugs and improve performance

### 12.22

- Final Submission
