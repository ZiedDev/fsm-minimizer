# fsm-minimizer 🔥

> Minimize complex finite state machines using implication tables

FSM Minimizer is an interactive web tool for minimizing finite state machines (FSM) using implication tables. It supports both **Moore** and **Mealy** machine types and provides a visual, step-by-step reduction process.

## ✨ Features

- 🎯 **Dual Mode Support**: Works with both Moore and Mealy state machines
- 📊 **Interactive Tables**: Visualize transition tables, implication tables, and minimized results
- 🔄 **Step-by-Step Reduction**: Watch the implication table evolve as equivalences are discovered
- 💾 **Save & Load**: Export/import your state machines as JSON files
- 🎨 **Smooth Animations**: Beautiful GSAP-powered transitions and interactions
- ⚡ **Dynamic Input Configuration**: Support for multiple inputs (X₀, X₁, X₂, ...)
- ✅ **Real-time Validation**: Instant feedback on duplicate states and incomplete data

## 🚀 Cloning the Project

### Prerequisites

- Node.js
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/ZiedDev/fsm-minimizer/

# Navigate to project directory
cd fsm-minimizer

# Install dependencies
npm install
# or
yarn install
# or
bun install

# Start development server
npm run dev
# or
yarn dev
# or
bun dev
```

### Build for Production

```bash
# Build the project
npm run build
# or
yarn build
# or
bun run build

# Preview production build
npm run preview
# or
yarn preview
# or
bun preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
# or
yarn deploy
# or
bun run deploy
```

## 📖 How to Use

### 1. **Set Up Your Machine**
   - Choose machine type: **Moore** or **Mealy**
   - Set the number of inputs (default: 1)
   - Click **+** to add state rows

### 2. **Enter State Information**
   - **Present State**: Current state name (e.g., a, b, c, d)
   - **Next State**: Transition states for each input combination (X₀=0, X₀=1, etc.)
   - **Output**: Output values (single for Moore, per-transition for Mealy)

### 3. **Generate Implication Table**
   - Click **Generate** to create the implication table
   - The table shows which state pairs are equivalent or incompatible

### 4. **Step Through Reduction**
   - Click **Next** to progressively simplify the implication table
   - Compatible states are marked with <span style="color:green">**✓**</span>
   - Incompatible states are marked with <span style="color:red">**×**</span>

### 5. **View Minimized Result**
   - Once complete, see your minimized state machine
   - States are relabeled (A, B, C, ...)
   - View the reduction summary (e.g., "8 → 3 states")

## 🎓 Example

Here's a sample Mealy machine included in the code:

| Present State | X₀=0 | X₀=1 | Output (X₀=0) | Output (X₀=1) |
|---------------|------|------|---------------|---------------|
| a             | h    | c    | 1             | 0             |
| b             | c    | d    | 0             | 1             |
| c             | h    | b    | 0             | 0             |
| d             | f    | h    | 0             | 0             |
| e             | c    | f    | 0             | 1             |
| f             | f    | g    | 0             | 0             |
| g             | g    | c    | 1             | 0             |
| h             | a    | c    | 1             | 0             |

After minimization, this reduces to fewer equivalent states using the implication table method.

## 💾 Import/Export

### Export
Click the **Download** button to save your current table as a JSON file. The file will be named `My Table [DATE].json`.

### Import
Click **Choose File** to load a previously saved JSON file.

**JSON Format:**
```json
{
  "presentState": ["a", "b", "c"],
  "nextState": [["b", "c"], ["a", "b"], ["c", "a"]],
  "output": [["0", "1"], ["1", "0"], ["0", "0"]],
  "mode": "mealy",
  "inputNum": 1
}
```

## 🛠️ Tech Stack

- **TypeScript** (~6.0.2) - Type-safe development
- **Vite** (^8.0.4) - Fast build tool and dev server
- **GSAP** (^3.14.2) - Professional-grade animations with SplitText plugin
- **CSS Grid** - Responsive table layouts
- **HTML5** - Modern semantic markup
- **Mona Sans** - Custom font for UI

## 📁 Project Structure

```
fsm-minimizer/
├── src/
│   ├── main.ts              # Core application logic
│   ├── style.css            # Styling and animations
│   └── assets/
│       ├── fonts/
│       │   └── Mona Sans/   # Custom font files
│       │       ├── LICENSE
│       │       ├── Mona-Sans.ttf
│       │       └── TTF/     # Individual font weights
│       └── trashIcon.svg    # Delete button icon
├── public/
│   └── favicon.svg          # App favicon
├── dist/                    # Production build (generated)
├── index.html               # Main HTML file
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── bun.lock                 # Lock file
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🎯 Algorithm Overview

FSM Minimizer uses the **implication table method** for FSM minimization:

1. **Build Implication Table**: Create a triangular matrix comparing all state pairs
2. **Mark Incompatible Pairs**: States with different outputs are incompatible (marked with <span style="color:red">**×**</span>)
3. **Check Implications**: For each pair, check if their next states are compatible
   - If states transition to incompatible pairs, mark them as incompatible
   - If states transition to the same states, mark them as compatible (<span style="color:green">**✓**</span>)
4. **Iterate**: Click "Next" to repeat until no new incompatibilities are found
5. **Group Compatible States**: Merge all compatible state pairs into equivalence classes
6. **Generate Minimized FSM**: Create new transition table using merged states with new labels (A, B, C...)

## 🎨 Features in Detail

### Animations
- GSAP-powered smooth transitions for all UI interactions
- SplitText animations for character-by-character text reveals
- Elastic easing for natural, playful motion
- Smooth scrolling to new content sections

### Validation
- Real-time input validation
- Duplicate state detection
- Empty field detection
- Visual feedback with tooltips on disabled buttons

### User Experience
- Responsive design with CSS Grid
- Mona Sans typography
- Interactive row deletion with animation
- Auto-scrolling to relevant content
- Dynamic table headers based on input count

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Implication table algorithm from digital logic design theory
- **GSAP** for smooth, professional animations
- **Vite** for blazing-fast development experience
- **Mona Sans** font by GitHub
- Solar Icons by 480 Design (CC BY 4.0)

## 📧 Contact

Discord: [ohzied](https://discord.com/users/484808856128585750)

---

**Made with ❤️ for digital logic enthusiasts**