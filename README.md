# Calculator App

A polished, responsive calculator experience now built with Next.js. The layout mirrors the familiar four-column flow from classic handheld calculators while taking advantage of modern web styling, subtle shadows, and adaptive text sizing.

## Features

- Standard arithmetic operations (addition, subtraction, multiplication, division)
- Support for decimal input, percentage conversion, and sign toggling
- Error handling for division by zero with clear messaging
- Responsive layout that adapts to varying device sizes
- Operator indicator to show the pending operation

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [`http://localhost:3000`](http://localhost:3000) in your browser to interact with the calculator UI.

## Project Structure

- `app/` – Next.js App Router entry with the page shell and global styles.
- `components/Calculator.jsx` – Main calculator component containing UI layout and interaction logic.
- `package.json` – Project manifest with dependencies and scripts.

## Testing

Manual testing is recommended to verify input flows and operator combinations.
