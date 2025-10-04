# Vendy UI Mode Guide

## Overview
The Vendy application supports three UI modes:
- **Dev Mode** (default): Full dashboard with transcripts, logs, and debugging tools
- **User Mode 1**: Clean fullscreen interface showing only Vendy's face and payment UI
- **User Mode 2**: Split view with Vendy on left and shopping cart display on right

## How to Use

### Access User Mode 1 (Fullscreen Vendy)
Add `?mode=user1` to your URL:
```
http://localhost:3001?mode=user1
http://localhost:3001?mode=user1&agentConfig=v3
http://localhost:3001?mode=user1&agentConfig=v1
```

### Access User Mode 2 (Cart View)
Add `?mode=user2` to your URL:
```
http://localhost:3001?mode=user2
http://localhost:3001?mode=user2&agentConfig=v3
http://localhost:3001?mode=user2&agentConfig=v1
```

### Access Dev Mode (Default)
No parameter needed, or explicitly use `?mode=dev`:
```
http://localhost:3001
http://localhost:3001?mode=dev
```

## User Mode 1 Features (Fullscreen)

### Dynamic Vendy Face States
Vendy's face changes based on the conversation state:

1. **Neutral** (`vendy_neutral.png`)
   - Default state when idle or listening
   - Shown when no interaction is happening

2. **Speaking** (`vendy_speaking.png`)
   - Active when Vendy is talking
   - Triggered by audio response events

3. **Payment Complete** (`payment_complete.png`)
   - Shown after successful payment
   - Happy Vendy celebrating the transaction
   - Reverts to neutral after 10 seconds

### Payment UI (on Vendy's Cheek)
Located in the bottom-right corner (grey cube area):
- **Price Display**: Shows current cart total in SAR
- **QR Code**: Placeholder for future payment QR implementation
- **Pay Button**: Triggers payment processing
- **Connection Status**: Subtle indicator when disconnected
- **PTT Control**: Push-to-talk toggle and button at bottom

## User Mode 2 Features (Cart View)

### Split Layout
- **Left Half**: Vendy's face (all face states work same as User Mode 1)
- **Right Half**: Shopping cart panel with detailed item breakdown

### Shopping Cart Panel
- **Cart Header**: "Your Cart" title in green
- **Scrollable Items List**: Shows all line items from `show_price`
  - Product image placeholder (80x80px, currently using `vendy_neutral.png`)
  - Product name
  - Unit price (SAR per item)
  - Quantity (e.g., "2x")
  - Subtotal (SAR for that line item)
- **Empty State**: "Your cart is empty" when no items
- **QR Code**: Placeholder shown when cart has items
- **Total Display**: Large SAR total at bottom
- **Pay Button**: Full-width payment button
- **Connection Status**: Shows when disconnected

### Dynamic Updates
- Cart updates instantly when LLM calls `show_price`
- Shows accurate quantities, prices, and product names
- Total recalculates automatically
- Payment button resets when new order starts

### Product Display
- Each cart item shows:
  - `name`: Full product name
  - `unitPrice`: Price per single item
  - `quantity`: How many of this item (e.g., 2x, 3x)
  - `subtotal`: Total for this line (unitPrice × quantity)
- All pricing pulled from `line_items` array in `show_price` response

## Technical Details

### Component Structure
- `VendyUserView.tsx`: User Mode 1 component (fullscreen)
- `VendyCartView.tsx`: User Mode 2 component (cart view)
- `App.tsx`: Mode detection and conditional rendering

### Data Flow (User Mode 2)
1. LLM calls `show_price` tool with cart items
2. `show_price` returns JSON with `line_items` array
3. App.tsx parses response and stores in `cartItems` state
4. VendyCartView receives `cartItems` prop and renders

### Event Listeners
Both user modes listen to the same events as dev mode:
- `response.audio.delta` / `response.audio_transcript.delta` → Speaking
- `response.audio.done` → Back to neutral
- `conversation.item.created` (process_payment) → Payment complete

### Maintained Functionality
- All realtime connection logic
- Payment processing
- Agent configurations
- Audio handling
- Event system

### Image Placeholders (User Mode 2)
- Currently: `getProductImage()` returns `/vendy_neutral.png` for all products
- Ready for future: Function accepts `productId` parameter
- To implement real images: Create product ID to image path mapping in `getProductImage()`

## Future Enhancements
- [ ] Implement product-specific images (replace placeholder logic)
- [ ] Implement actual QR code generation
- [ ] Add animation transitions between face states
- [ ] Voice activity visualization
- [ ] Multiple payment method support
- [ ] Error state UI
- [ ] Cart item removal/editing
- [ ] Stock quantity warnings in cart
