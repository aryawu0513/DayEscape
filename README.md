# DayEscape - Alpha version

## Overview

Our Trip Planner app has successfully implemented all core features; however, there are some minor issues that need attention.

## Current Issues

1. **Trip List Refresh:** After a user saves a trip, the created trip doesn't immediately appear in the list without refreshing the app.

2. **Navigation Glitches:** Clicking on the list of trips sometimes leads to unintended jumps to the trip summary view without user interaction.

3. **Navigation Error:** When on the trip saving screen, there's a navigation error when attempting to go back to the previous transportation selection screen.

4. **Error Handling:** The note screen displays an error message returned from a promise. Need to investigate and resolve the error during promise handling.

## Changes made from revised design

1. **Note Copying:** Persistent notes are always copied to a trip's notes, removing the user's ability to choose whether to include the note related to a place.

2. **Map Interaction:** We have changed the way user create a new place on the map. Instead of entering longitude and latitude, user can click on a map pop-up and place a pin on the place they intend on adding.

## Work Plan

Since the core features are all finished and implemented in a modularized way, we will not be assigning individual work, and will be working on different parts concurrently whenever we have time.

### 12.12/13

- Finish debugging the occasional errors that our app has by going to office hours. Make sure all edge cases are checked. Clean up and comment code in an understandable way.

### 12.15

- Revise and uniform CSS styling. Improve user experience by turning error message into pop-up displays. Submit Beta Version.

### 12.20

- Implement additional features, starting with a picture database for the

- Implement additional features, starting from creating a picture database for the photo taking feature. We might also explore sharing feature between users if time permits.

### 12.22

- Final Submission.
