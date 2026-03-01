# Who Wants to Be a Millionaire

A trivia quiz game built with Next.js where players answer multiple-choice questions to climb the prize ladder and win up to $1,000,000.

## Features

- 12 trivia questions with increasing difficulty
- Prize ladder with milestone checkpoints (safe zones)
- 30-second timer per question
- Answer reveal animation with suspense
- Game state persistence (resume interrupted games)
- Mobile-responsive design with collapsible prize ladder
- Accessible UI with ARIA support

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** CSS Modules
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint (Airbnb config)
- **Git Hooks:** Husky + lint-staged

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production server |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ci` | Run tests with coverage |

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── features/
│   └── game/
│       ├── Game.tsx        # Main game component
│       ├── domain/         # Types, state machine, validation
│       ├── hooks/          # useGame, useTimer
│       └── components/     # UI components
│           ├── StartScreen/
│           ├── GameScreen/
│           ├── GameOverScreen/
│           ├── ErrorScreen/
│           ├── AnswerOption/
│           ├── PrizeLadder/
│           └── MobileMenu/
└── shared/
    ├── components/         # Reusable components (Button)
    ├── config/
    │   └── questions.json  # Game questions and prize levels
    └── utils/              # Helpers (localStorage, formatCurrency)
```

## Customizing Questions

Edit `src/shared/config/questions.json` to modify questions and prize levels:

```json
{
  "questions": [
    {
      "id": "q1",
      "text": "Your question here?",
      "answers": [
        { "id": "q1a1", "text": "Option A", "isCorrect": false },
        { "id": "q1a2", "text": "Option B", "isCorrect": true },
        { "id": "q1a3", "text": "Option C", "isCorrect": false },
        { "id": "q1a4", "text": "Option D", "isCorrect": false }
      ],
      "timeLimit": 30
    }
  ],
  "prizeLevels": [
    { "questionIndex": 0, "amount": 500, "isMilestone": false },
    { "questionIndex": 4, "amount": 8000, "isMilestone": true }
  ]
}
```

**Requirements:**
- Each question must have exactly one correct answer
- All IDs must be unique
- Number of prize levels must match number of questions
- Milestone levels are "safe zones" - players keep that amount if they answer incorrectly

## Game Flow

1. **Start Screen** - Click "Start" to begin
2. **Playing** - Select an answer before time runs out
3. **Revealing** - Suspense animation before showing result
4. **Correct/Incorrect** - See result and continue or end game
5. **Game Over/Won** - View final score and play again

## License

MIT
