# Vizio TV Remote App

A beautiful Vue 3 + Nuxt 3 application for controlling your Vizio TV remotely.

## Features

- **Pairing Screen**: Connect to your Vizio TV by entering the TV's IP address and PIN
- **Control Screen**: Full remote control interface with:
  - Directional pad (D-pad) for navigation
  - Volume up/down buttons
  - Channel up/down buttons
  - Enter and Return buttons

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Pairing**:
   - Enter your Vizio TV's IP address (you can find this in your TV's network settings)
   - Click "Start Pairing"
   - Enter the PIN displayed on your TV screen
   - Click "Submit PIN"

2. **Controlling**:
   - Use the directional pad to navigate menus
   - Use volume buttons to adjust sound
   - Use channel buttons to change channels
   - Use Enter to select items
   - Use Return to go back

## Requirements

- Your device and Vizio TV must be on the same network
- The TV must support SmartCast API
- The TV must be powered on during pairing and use

## Technologies

- Vue 3
- Nuxt 3
- vizio-smart-cast library

