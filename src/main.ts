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
const implicationTableBody = document.querySelector<HTMLDivElement>("#implication-table")!;
const implicationTable = document.querySelector<HTMLDivElement>("#implication-table .content")!;
const nextButtonBody = document.querySelector<HTMLDivElement>(".implication-table-next-button")!;
const nextButton = document.querySelector<HTMLButtonElement>(".implication-table-next-button button")!;
const minimizedTable = document.querySelector<HTMLDivElement>("#minimized-table")!;

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

// States
let currentMode: "mealy" | "moore";
let currentInputNum: number;

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
    currentMode = transitionTableData.mode;
    currentInputNum = transitionTableData.inputNum;
    implicationTable.append(generateImplicationTable(transitionTableData));
    if (implicationTable.children.length > 1) implicationTable.children[0].remove();
    implicationTableBody.classList.remove("hide");
    setTimeout(() => {
        document.body.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest"
        });
    }, 0);
    nextButton.disabled = false
    minimizedTable.innerHTML = "";
    minimizedTable.classList.add("hide");
});
downloadButton.addEventListener("click", e => {
    downloadJSON(transitionTableData);
});
fileElement.addEventListener("input", e => {
    loadJSON(e);
});
nextButton.addEventListener("click", e => {
    let isFinished = !continueImplicationTable();

    if (isFinished) {
        nextButton.style.setProperty("--tip-msg", '"Table is simplified"');
        nextButton.disabled = true
        const reducedTable = reduceImplicationTable();
        minimizedTable.innerHTML = "";
        minimizedTable.append(minimizedTableGenerator(reducedTable, currentMode, currentInputNum));
        minimizedTable.classList.remove("hide");
        document.body.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest"
        });
    }
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
    const transitionTableExtractedData: TableData = {
        presentState: [],
        nextState: [],
        output: [],
        mode: isMooreCheck.checked ? "moore" : "mealy",
        inputNum: numInputs,
    };

    const rows = transitionTable.querySelectorAll(".row");

    if (isMooreCheck.checked) {
        // Moore
        rows.forEach(row => {
            transitionTableExtractedData.presentState.push(row.querySelector<HTMLInputElement>(".present-state-input")!.value)
            for (let i = 0; i < numInputs; i++) {
                transitionTableExtractedData.nextState.push([row.querySelectorAll<HTMLInputElement>(".next-input")[i * 2]!.value, row.querySelectorAll<HTMLInputElement>(".next-input")[i * 2 + 1]!.value])
            }
            transitionTableExtractedData.output.push([row.querySelector<HTMLInputElement>(".output-input")!.value]);
        });
    } else {
        // Mealy
        rows.forEach(row => {

            transitionTableExtractedData.presentState.push(row.querySelector<HTMLInputElement>(".present-state-input")!.value)

            const nextStateArr = [];
            for (let i = 0; i < numInputs; i++) {
                nextStateArr.push(row.querySelectorAll<HTMLInputElement>(".next-input")[i * 2]!.value, row.querySelectorAll<HTMLInputElement>(".next-input")[i * 2 + 1]!.value)
            }
            transitionTableExtractedData.nextState.push(nextStateArr);

            const outputArr = [];
            for (let i = 0; i < numInputs; i++) {
                outputArr.push(row.querySelectorAll<HTMLInputElement>(".output-input")[i * 2]!.value, row.querySelectorAll<HTMLInputElement>(".output-input")[i * 2 + 1]!.value);
            }
            transitionTableExtractedData.output.push(outputArr);
        });
    }

    return transitionTableExtractedData;
}
function downloadJSON(tableData: TableData) {
    let blob = new Blob([JSON.stringify(tableData)], { type: "application/json" });
    const a = document.createElement("a");
    const todayDate = new Date().toISOString().slice(0, 10);
    a.download = `My Table ${todayDate}.json`;
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
function generateImplicationTable(tableData: TableData): HTMLDivElement {
    const table = document.createElement("div");
    const sideColumn = document.createElement("div");
    sideColumn.classList.add("implication-side-column");
    const footerRow = document.createElement("div");
    footerRow.classList.add("implication-footer-row");

    for (let i = 0; i < tableData.presentState.length; i++) {
        if (i == 0) continue;
        const row = document.createElement("div");
        row.classList.add("implication-row");

        const sideElement = document.createElement("p");
        sideElement.textContent = tableData.presentState[i];
        sideColumn.append(sideElement);

        for (let j = 0; j < i; j++) {
            const rowElement = document.createElement("div");
            rowElement.classList.add("implication-row-element");
            rowElement.dataset.coords = JSON.stringify([tableData.presentState[i], tableData.presentState[j]].sort());
            rowElement.dataset.val = "[]";

            if (JSON.stringify(tableData.output[i]) == JSON.stringify(tableData.output[j])) {
                let equivalence = 0;
                for (let z = 0; z < tableData.nextState[j].length; z++) {
                    if (tableData.nextState[i][z] == tableData.nextState[j][z]) {
                        equivalence++;

                        if (equivalence == tableData.nextState[i].length) {
                            const element = document.createElement("p");
                            rowElement.innerHTML = "";
                            element.classList.add("correct");
                            element.textContent = "✓";
                            rowElement.dataset.val = "✓";
                            rowElement.append(element);
                            break;
                        } else continue;
                    }

                    const element = document.createElement("p");
                    element.textContent = `${[tableData.nextState[j][z], tableData.nextState[i][z]].sort()[0]}-${[tableData.nextState[j][z], tableData.nextState[i][z]].sort()[1]}\n`;
                    rowElement.dataset.val = JSON.stringify([...JSON.parse(rowElement.dataset.val), [tableData.nextState[j][z], tableData.nextState[i][z]].sort()].sort());
                    if (rowElement.dataset.coords == rowElement.dataset.val.substring(1, rowElement.dataset.val.length - 1)) {
                        rowElement.innerHTML = "";
                        element.classList.add("correct");
                        element.textContent = "✓";
                        rowElement.dataset.val = "✓";
                        rowElement.append(element);
                        break;
                    }
                    rowElement.append(element);
                }
            } else {
                const element = document.createElement("p");
                element.classList.add("wrong");
                element.textContent = "x";
                rowElement.dataset.val = "x";
                rowElement.append(element);
            }
            row.append(rowElement);

            if (j + 1 == i) {
                const footerElement = document.createElement("p");
                footerElement.textContent = tableData.presentState[j];
                footerRow.append(footerElement);
            }

            setTimeout(() => {
                sideElement.style.height = `${rowElement.getBoundingClientRect().height}px`;
            }, 0);
        }

        table.append(row);
    }
    table.append(sideColumn, footerRow);
    gsap.fromTo([table.querySelectorAll(".implication-row-element"), table.querySelectorAll(".implication-side-column p"), table.querySelectorAll(".implication-footer-row p"), table.querySelectorAll(".implication-row-element p"), nextButtonBody], {
        opacity: 0,
        y: 15,
    }, {
        stagger: 0.06,
        duration: 0.8,
        ease: "elastic.out",
        opacity: 1,
        y: 0,
        clearProps: "transform",
        onComplete: function () {
            this.kill();
        }
    });

    return table;
}
function continueImplicationTable() {
    const tableContent = implicationTable.children[0];
    const stage: HTMLElement[][] = [];
    let change = false;
    tableContent.querySelectorAll<HTMLElement>(".implication-row").forEach(row => {
        Array.from(row.children as HTMLCollectionOf<HTMLElement>).forEach(child => {
            const elementVal = child.getAttribute("data-val")!;
            if (elementVal == "x" || elementVal == "✓") return;

            const elementValArr = JSON.parse(elementVal);

            let foundWrong = false;
            let foundCorrect = false;
            elementValArr.forEach((element: string[]) => {
                let auxElement = tableContent.querySelector<HTMLElement>(`[data-coords='${JSON.stringify(element.sort())}']`);

                const auxElementVal = auxElement!.getAttribute("data-val")!;
                if (auxElementVal != "x" && auxElementVal != "✓") return;

                foundWrong = auxElement?.dataset.val == "x";
                foundCorrect = auxElement?.dataset.val == "✓";
            });

            if (foundCorrect) {
                const correctElement = document.createElement("p");
                correctElement.textContent = "✓";
                correctElement.classList.add("correct-next-element");
                stage.push([child, correctElement]);
                change = true;
            } else if (foundWrong) {
                const wrongElement = document.createElement("p");
                wrongElement.textContent = "x";
                wrongElement.classList.add("wrong-next-element");
                stage.push([child, wrongElement]);
                change = true;
            }

            stage.forEach(element => {
                element[0].dataset.val = element[1].textContent;
                element[0].append(element[1]);
            });

            gsap.fromTo(stage.map(pair => pair[1]), {
                opacity: 0,
                y: 15,
            }, {
                stagger: 0.06,
                duration: 0.8,
                ease: "elastic.out",
                opacity: 1,
                y: 0,
                clearProps: "all",
                onComplete: function () {
                    this.kill();
                }
            });

        });
    });
    return change;
}
function reduceImplicationTable() {
    const tableContent = implicationTable.children[0];
    const states = transitionTableData.presentState;
    const compatiblePairs: [string, string][] = [];
    tableContent.querySelectorAll<HTMLElement>(".implication-row-element").forEach(cell => {
        if (cell.dataset.val == "x") return;
        const coords: [string, string] = JSON.parse(cell.dataset.coords!);
        compatiblePairs.push(coords);
    });

    const array: string[][] = [];

    states.forEach(element => {
        for (let i = 0; i < compatiblePairs.length; i++) {
            const pair = compatiblePairs[i];
            if (!pair.includes(element)) continue;

            const otherElement = pair[0] == element ? pair[1] : pair[0];

            const elementGroupIdx = array.findIndex(subArray => subArray.includes(element));
            const otherGroupIdx = array.findIndex(subArray => subArray.includes(otherElement));

            if (elementGroupIdx == -1 && otherGroupIdx == -1) {
                array.push([...pair]);
            } else if (elementGroupIdx == -1) {
                array[otherGroupIdx].push(element);
            } else if (otherGroupIdx == -1) {
                array[elementGroupIdx].push(otherElement);
            } else if (elementGroupIdx != otherGroupIdx) {
                array[elementGroupIdx].push(...array[otherGroupIdx]);
                array.splice(otherGroupIdx, 1);
            }
        }

        if (array.findIndex(subArray => subArray.includes(element)) == -1) {
            array.push([element]);
        }
    });

    return array;
}
function generateLabels(width: number): string[] {
    const result: string[] = [];

    for (let i = 0; i < width; i++) {
        let label = "";
        let n = i;

        do {
            label = String.fromCharCode(65 + (n % 26)) + label;
            n = Math.floor(n / 26) - 1;
        } while (n >= 0);

        result.push(label);
    }

    return result;
}
function minimizedTableGenerator(reducedImplicationTable: string[][], mode: "mealy" | "moore", inputNum: number): HTMLDivElement {
    const table = document.createElement("div");
    const minimizedTableData: TableData = {
        presentState: [],
        nextState: [],
        output: [],
        mode,
        inputNum,
    }
    const labels = generateLabels(reducedImplicationTable.length);

    for (let i = 0; i < reducedImplicationTable.length; i++) {
        minimizedTableData.presentState.push(labels[i]);
    }

    for (let i = 0; i < reducedImplicationTable.length; i++) {
        const representativeState = reducedImplicationTable[i][0];
        const originalStateIndex = transitionTableData.presentState.indexOf(representativeState);

        const nextStateTemp = transitionTableData.nextState[originalStateIndex];
        const nextStateArr: string[] = [];

        for (let j = 0; j < nextStateTemp.length; j++) {
            const targetGroup = reducedImplicationTable.findIndex(subArray => subArray.includes(nextStateTemp[j]));
            nextStateArr.push(minimizedTableData.presentState[targetGroup]);
        }

        minimizedTableData.nextState.push(nextStateArr);
        minimizedTableData.output.push(transitionTableData.output[originalStateIndex]);
    }

    console.log(minimizedTableData);

    const presentStateColumn = document.createElement("div");
    presentStateColumn.classList.add("present-state-column");
    minimizedTableData.presentState.forEach(state => {
        const element = document.createElement("div");
        element.classList.add("minimized-row");
        const subElement = document.createElement("div");
        const text = document.createElement("p");
        text.textContent = state;
        subElement.append(text);
        element.append(subElement);
        presentStateColumn.append(element);
    });

    const nextStateColumn = document.createElement("div");
    nextStateColumn.classList.add("next-state-column");
    minimizedTableData.nextState.forEach(state => {
        const element = document.createElement("div");
        element.classList.add("minimized-row");
        state.forEach(subState => {
            const subElement = document.createElement("div");
            const text = document.createElement("p");
            text.textContent = subState;
            subElement.append(text);
            element.append(subElement);
        });
        nextStateColumn.append(element);
    });

    const outputColumn = document.createElement("div");
    outputColumn.classList.add("output-column");
    minimizedTableData.output.forEach(state => {
        const element = document.createElement("div");
        element.classList.add("minimized-row");
        state.forEach(subState => {
            const subElement = document.createElement("div");
            const text = document.createElement("p");
            text.textContent = subState;
            subElement.append(text);
            element.append(subElement);
        });
        outputColumn.append(element);
    });

    table.append(presentStateColumn, nextStateColumn, outputColumn);

    gsap.fromTo([table.querySelectorAll(".minimized-row div"), table.querySelectorAll(".minimized-row div p")], {
        opacity: 0,
        y: 15,
    }, {
        delay: 0.25,
        stagger: 0.06,
        duration: 0.8,
        ease: "elastic.out",
        opacity: 1,
        y: 0,
        clearProps: "transform",
        onComplete: function () {
            this.kill();
        }
    });

    return table;
}

// Sample 1
transitionTable.appendChild(addARow({
    presentStateVal: "a", nextStateVal: ["h", "c"], outputVal: ["1", "0"]
}));
transitionTable.appendChild(addARow({
    presentStateVal: "b", nextStateVal: ["c", "d"], outputVal: ["0", "1"]
}));
transitionTable.appendChild(addARow({
    presentStateVal: "c", nextStateVal: ["h", "b"], outputVal: ["0", "0"]
}));
transitionTable.appendChild(addARow({
    presentStateVal: "d", nextStateVal: ["f", "h"], outputVal: ["0", "0"]
}));
transitionTable.appendChild(addARow({
    presentStateVal: "e", nextStateVal: ["c", "f"], outputVal: ["0", "1"]
}));
transitionTable.appendChild(addARow({
    presentStateVal: "f", nextStateVal: ["f", "g"], outputVal: ["0", "0"]
}));
transitionTable.appendChild(addARow({
    presentStateVal: "g", nextStateVal: ["g", "c"], outputVal: ["1", "0"]
}));
transitionTable.appendChild(addARow({
    presentStateVal: "h", nextStateVal: ["a", "c"], outputVal: ["1", "0"]
}));

transitionTableData = readTable();
enableDisableGenerateButton(transitionTableData);
