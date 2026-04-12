import './style.css';
import trashIcon from './assets/trashIcon.svg'
import { gsap } from "gsap";
gsap.config({ nullTargetWarn: false });

// HTML Elements
const transitionTableBody = document.querySelector<HTMLDivElement>("#transition-table")!;
const transitionTable = document.querySelector<HTMLDivElement>("#transition-table-content")!;
const isMooreCheck = document.querySelector<HTMLInputElement>("#is-moore-check")!;
const subheaderNextState = document.querySelector<HTMLDivElement>("#subheader-next-state")!;
const subheaderOutput = document.querySelector<HTMLDivElement>("#subheader-output")!;
const addRowButton = document.querySelector<HTMLButtonElement>("#add-row-button")!;
const generateButton = document.querySelector<HTMLButtonElement>("#generate-button")!;
const numberOfInputsInput = document.querySelector<HTMLInputElement>('#number-of-inputs-input')!;
const downloadButton = document.querySelector<HTMLInputElement>('#download-button')!;
const fileElement = document.querySelector<HTMLInputElement>("#file")!;
const implicationTable = document.querySelector<HTMLDivElement>("#implication-table");

// Types
type TableData = {
    presentState: string[];
    nextState: string[][];
    output: string[][];
    mode: "mealy" | "moore";
    inputNum: number;
}

// Variables
let numInputs = Number(numberOfInputsInput.value);
let transitionTableData: TableData = {
    presentState: [],
    nextState: [],
    output: [],
    mode: isMooreCheck.checked ? "moore" : "mealy",
    inputNum: numInputs,
};

// Events
isMooreCheck.addEventListener("click", e => {
    transitionTable.innerHTML = "";
    transitionTable.appendChild(addARow());
});
numberOfInputsInput.addEventListener("change", e => {
    if (numberOfInputsInput.value == "") return;
    if (numInputs == Number(numberOfInputsInput.value)) return;

    numInputs = Number(numberOfInputsInput.value);
    transitionTable.innerHTML = "";
    transitionTable.appendChild(addARow());

    // update css variables
    transitionTableBody.style.setProperty("--number-of-inputs", String(numInputs));
});
addRowButton.addEventListener("click", e => {
    gsap.fromTo(addRowButton, {
        rotation: "0deg",
    }, {
        rotation: "360deg",
        duration: 0.65,
        ease: "expo.out",
        clearProps: "all",
    });
    transitionTable.appendChild(addARow());
});
generateButton.addEventListener("click", e => {
    generateImplicationTable(transitionTableData);
});
downloadButton.addEventListener("click", e => {
    downloadJSON(transitionTableData);
});
fileElement.addEventListener("input", e => {
    loadJSON(e);
});

// Functions
function updateHeader() {
    if (isMooreCheck.checked) {
        // Moore
        subheaderOutput!.innerHTML = "";
        subheaderOutput.classList.remove("output-mealy");
        subheaderOutput.classList.add("output-moore");
    } else {
        // Mealy
        subheaderOutput!.innerHTML = "";
        for (let i = 0; i < numInputs; i++) {
            subheaderOutput!.innerHTML += `<p>X<sub>${i}</sub>=0</p><p>X<sub>${i}</sub>=1</p>`;
        }
        subheaderOutput.classList.remove("output-moore");
        subheaderOutput.classList.add("output-mealy")
    };

    subheaderNextState!.innerHTML = ""
    for (let i = 0; i < numInputs; i++) {
        subheaderNextState!.innerHTML += `<p>X<sub>${i}</sub>=0</p><p>X<sub>${i}</sub>=1</p>`;
    }
}
function addARow(
    { presentStateVal, nextStateVal, outputVal }: {
        presentStateVal?: string,
        nextStateVal?: string[],
        outputVal?: string[]
    } = {}
): HTMLElement {
    const row = document.createElement("div");
    row.classList.add("row");

    const presentState = document.createElement("div");
    const presentStateInput = document.createElement("input");

    presentState.classList.add("present-state");
    presentStateInput.classList.add("present-state-input");
    presentStateInput.value = presentStateVal ?? "";
    presentState.append(presentStateInput);

    const nextState = document.createElement("div");

    nextState.classList.add("next-state");
    for (let i = 0; i < numInputs; i++) {
        const nextStateZeroInput = document.createElement("input");
        const nextStateOneInput = document.createElement("input");

        nextStateZeroInput.classList.add("next-input");
        nextStateOneInput.classList.add("next-input");
        nextStateZeroInput.value = nextStateVal?.[i * 2] ?? "";
        nextStateOneInput.value = nextStateVal?.[i * 2 + 1] ?? "";

        nextState.append(nextStateZeroInput, nextStateOneInput);
    }

    const output = document.createElement("div");
    output.classList.add("output");

    if (isMooreCheck.checked) {
        // Moore
        updateHeader();
        output.classList.add("output-moore");

        const outputInput = document.createElement("input");

        outputInput.classList.add("output-input");
        outputInput.value = outputVal?.[0] ?? "";

        output.append(outputInput);
    } else {
        // Mealy
        updateHeader();
        output.classList.add("output-mealy");

        for (let i = 0; i < numInputs; i++) {
            const outputZeroInput = document.createElement("input");
            const outputOneInput = document.createElement("input");

            outputZeroInput.classList.add("output-input");
            outputOneInput.classList.add("output-input");
            outputZeroInput.value = outputVal?.[i * 2] ?? "";
            outputOneInput.value = outputVal?.[i * 2 + 1] ?? "";

            output.append(outputZeroInput, outputOneInput);
        }
    }

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("trash-icon");
    const trashIconImg = document.createElement('img')
    trashIconImg.src = trashIcon;
    deleteButton.tabIndex = -1;
    deleteButton.append(trashIconImg);
    deleteButton.addEventListener('click', e => {
        gsap.to(row, {
            "--scale": 0,
            height: 0,
            marginBottom: 0,
            duration: .5,
            ease: "expo.out",
            onComplete: () => {
                row.remove();
                transitionTableData = readTable();
                enableDisableGenerateButton(transitionTableData);
            }
        });
    });
    gsap.fromTo(row, {
        "--scale": 0,
        height: 0,
        marginBottom: 0,
    }, {
        "--scale": 1,
        height: "2rem",
        marginBottom: "0.5rem",
        duration: .5,
        ease: "expo.out",
    });
    gsap.fromTo(row.children, {
        "--scale": 0,
        height: 0,
    }, {
        "--scale": 1,
        height: "2rem",
        duration: .5,
        ease: "expo.out",
    });

    row.append(deleteButton, presentState, nextState, output);
    row.querySelectorAll<HTMLInputElement>("input").forEach(input => {
        input.addEventListener("input", e => {
            transitionTableData = readTable();
            enableDisableGenerateButton(transitionTableData);
        });
    });

    transitionTableData = readTable();
    enableDisableGenerateButton(transitionTableData, { forceDisable: true });
    return row;
}
function readTable(): TableData {
    const transitionTableData: TableData = {
        presentState: [],
        nextState: [],
        output: [],
        mode: isMooreCheck.checked ? "moore" : "mealy",
        inputNum: numInputs,
    };

    const rows = document.querySelectorAll(".row");

    if (isMooreCheck.checked) {
        // Moore
        rows.forEach(row => {
            transitionTableData.presentState.push(row.querySelector<HTMLInputElement>(".present-state-input")!.value)
            for (let i = 0; i < numInputs; i++) {
                transitionTableData.nextState.push([row.querySelectorAll<HTMLInputElement>(".next-input")[i * 2]!.value, row.querySelectorAll<HTMLInputElement>(".next-input")[i * 2 + 1]!.value])
            }
            transitionTableData.output.push([row.querySelector<HTMLInputElement>(".output-input")!.value]);
        });
    } else {
        // Mealy
        rows.forEach(row => {
            transitionTableData.presentState.push(row.querySelector<HTMLInputElement>(".present-state-input")!.value)

            const nextStateArr = [];
            for (let i = 0; i < numInputs; i++) {
                nextStateArr.push(row.querySelectorAll<HTMLInputElement>(".next-input")[i * 2]!.value, row.querySelectorAll<HTMLInputElement>(".next-input")[i * 2 + 1]!.value)
            }
            transitionTableData.nextState.push(nextStateArr);

            const outputArr = [];
            for (let i = 0; i < numInputs; i++) {
                outputArr.push(row.querySelectorAll<HTMLInputElement>(".output-input")[i * 2]!.value, row.querySelectorAll<HTMLInputElement>(".output-input")[i * 2 + 1]!.value);
            }
            transitionTableData.output.push(outputArr);
        });
    }

    return transitionTableData;
}
function downloadJSON(tableData: TableData) {
    let blob = new Blob([JSON.stringify(tableData)], { type: "application/json" });
    const a = document.createElement("a");
    const todayDate = new Date().toISOString().slice(0, 10);
    a.download = `My Implication Table ${todayDate}.json`;
    a.href = window.URL.createObjectURL(blob);
    a.click(); // Trigger download
}
async function loadJSON(event: any) {
    const file = event.target.files.item(0);
    const content = await file.text();

    try {
        const parsed = JSON.parse(content);

        numberOfInputsInput!.value = parsed.inputNum;
        numInputs = parsed.inputNum;
        isMooreCheck!.checked = parsed.mode == "moore" ? true : false;

        transitionTable!.innerHTML = "";
        for (let i = 0; i < Math.max(parsed.presentState.length, parsed.nextState.length, parsed.output.length); i++) {
            transitionTable.appendChild(addARow({
                presentStateVal: parsed.presentState[i], nextStateVal: parsed.nextState[i], outputVal: parsed.output[i]
            }));
        }
        transitionTableData = readTable();
        enableDisableGenerateButton(transitionTableData);
    } catch {
        throw new Error("broken file 😔");
    }
}
function hasEmptyString(obj: object): boolean {
    for (const value of Object.values(obj)) {
        if (typeof value === "string" && value === "") {
            return true;
        }

        if (value !== null && typeof value === "object") {
            if (hasEmptyString(value)) {
                return true;
            }
        }
    }
    return false;
}
function hasDuplicateStringsInArray<T>(arr: T[], seen = new Set<string>()): boolean {
    for (const item of arr) {
        if (typeof item === 'string') {
            if (seen.has(item)) return true;
            seen.add(item);
        }
        else if (Array.isArray(item)) {
            if (hasDuplicateStringsInArray(item, seen)) return true;
        }
        else if (item !== null && typeof item === 'object') {
            const values = Object.values(item as Record<string, unknown>);
            if (hasDuplicateStringsInArray(values, seen)) return true;
        }
    }

    return false;
}
function enableDisableGenerateButton(tableData: TableData, { forceDisable }: { forceDisable?: boolean } = {}) {
    if (forceDisable === true) {
        generateButton.disabled = true;
        generateButton.style.setProperty("--tip-msg", "'You must fill all the inputs'");
        return;
    }

    if (tableData.nextState.length == 0 || hasEmptyString(tableData)) {
        generateButton.disabled = true;
        generateButton.style.setProperty("--tip-msg", "'You must fill all the inputs'");
    } else if (hasDuplicateStringsInArray(tableData.presentState)) {
        generateButton.disabled = true;
        generateButton.style.setProperty("--tip-msg", "'Present states variables can not be repeated'");
    } else {

        generateButton.disabled = false;
        generateButton.style.setProperty("--tip-msg", "");
    }
}
function generateImplicationTable(tableData: TableData) {
}

transitionTable.appendChild(addARow({
    presentStateVal: "a", nextStateVal: ["b", "c", 'd', 'e'], outputVal: ["1", "0", "0", "1"]
}));
transitionTable.appendChild(addARow({
    presentStateVal: "c", nextStateVal: ["b", "c", 'd', 'e'], outputVal: ["1", "0", "0", "1"]
}));
transitionTableData = readTable();
enableDisableGenerateButton(transitionTableData);
