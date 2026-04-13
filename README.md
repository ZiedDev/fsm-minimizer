# fsm-minimizer 🔥

> Melt down complex finite state machines into their minimal form

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
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fsmelt.git

# Navigate to project directory
cd fsmelt

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📖 How to Use

### 1. **Set Up Your Machine**
   - Choose machine type: **Moore** or **Mealy**
   - Set the number of inputs (default: 1)
   - Click **+** to add state rows

### 2. **Enter State Information**
   - **Present State**: Current state name (e.g., A, B, C)
   - **Next State**: Transition states for each input combination
   - **Output**: Output values (single for Moore, per-transition for Mealy)

### 3. **Generate Implication Table**
   - Click **Generate** to create the implication table
   - The table shows which state pairs are equivalent or incompatible

### 4. **Step Through Reduction**
   - Click **Next** to progressively simplify the implication table
   - Compatible states are marked with **✓**
   - Incompatible states are marked with **x**

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

After minimization, this reduces to fewer equivalent states.

## 💾 Import/Export

### Export
Click the **Download** button to save your current table as a JSON file.

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

- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **GSAP** - Professional-grade animations
- **CSS Grid** - Responsive table layouts
- **HTML5** - Modern semantic markup

## 📁 Project Structure

```
fsmelt/
├── src/
│   ├── main.ts           # Core application logic
│   ├── style.css         # Styling and animations
│   ├── assets/
│   │   └── trashIcon.svg # Delete button icon
│   └── vite-env.d.ts     # Type definitions
├── index.html            # Main HTML file
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md            # This file
```

## 🎯 Algorithm Overview

FSMelt uses the **implication table method** for FSM minimization:

1. **Build Implication Table**: Create a triangular matrix comparing all state pairs
2. **Mark Incompatible Pairs**: States with different outputs are incompatible (marked with ✗)
3. **Check Implications**: For each pair, check if their next states are compatible
4. **Iterate**: Repeat until no new incompatibilities are found
5. **Group Compatible States**: Merge all compatible state pairs into equivalence classes
6. **Generate Minimized FSM**: Create new transition table using merged states

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Implication table algorithm from digital logic design theory
- GSAP for smooth animations
- Vite for blazing-fast development experience

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/fsmelt](https://github.com/yourusername/fsmelt)

---

**Made with ❤️ for digital logic enthusiasts**