# Vendy User Mode Guide

## Overview
The Vendy application now supports two UI modes:
- **Dev Mode** (default): Full dashboard with transcripts, logs, and debugging tools
- **User Mode**: Clean, simplified interface showing only Vendy's face and payment UI

## How to Use

### Access User Mode
Add `?mode=user` to your URL:
```
http://localhost:3000?mode=user
http://localhost:3000?mode=user&agentConfig=v3
http://localhost:3000?mode=user&agentConfig=v1
```

### Access Dev Mode (Default)
No parameter needed, or explicitly use `?mode=dev`:
```
http://localhost:3000
http://localhost:3000?mode=dev
```

## User Mode Features

### Dynamic Vendy Face States
Vendy's face changes based on the conversation state:

1. **Neutral** (`vendy_neutral_.png`)
   - Default state when idle or listening
   - Shown when no interaction is happening

2. **Speaking** (`vendy_speaking.png`)
   - Active when Vendy is talking
   - Triggered by audio response events

3. **Payment Complete** (`payment_complete.png`)
   - Shown after successful payment
   - Happy Vendy celebrating the transaction

### Payment UI (on Vendy's Cheek)
Located in the bottom-right corner (grey cube area):
- **Price Display**: Shows current cart total in SAR
- **QR Code**: Placeholder for future payment QR implementation
- **Pay Button**: Triggers payment processing
- **Connection Status**: Subtle indicator when disconnected

## Technical Details

### Component Structure
- `VendyUserView.tsx`: New user-facing UI component
- `App.tsx`: Mode detection and conditional rendering
- All backend logic remains unchanged

### Event Listeners
The user mode listens to the same events as dev mode:
- `response.audio.delta` / `response.audio_transcript.delta` → Speaking
- `response.audio.done` / `response.done` → Back to neutral
- `conversation.item.created` (process_payment) → Payment complete

### Maintained Functionality
- All realtime connection logic
- Payment processing
- Agent configurations
- Audio handling
- Event system

## Future Enhancements
- [ ] Implement actual QR code generation
- [ ] Add animation transitions between face states
- [ ] Voice activity visualization
- [ ] Multiple payment method support
- [ ] Error state UI
