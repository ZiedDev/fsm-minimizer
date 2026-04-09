import './style.css';
import { gsap } from "gsap";
import trashIcon from './assets/trashIcon.svg'

const transitionTableBody = document.querySelector(".transition-table");
const transitionTable = document.querySelector("#transition-table-content");

const isMooreCheck = document.querySelector<HTMLInputElement>("#is-moore-check");

const addRowButton = document.querySelector<HTMLInputElement>("#add-row-button");
const subheaderOutput = document.querySelector<HTMLInputElement>("#subheader-output");

const generateButton = document.querySelector<HTMLInputElement>("#generate-button");

isMooreCheck?.addEventListener("click", e => {
    transitionTable!.innerHTML = "";
    transitionTable?.appendChild(addARow());
});

addRowButton?.addEventListener("click", e => {
    gsap.fromTo(addRowButton,{
        rotation: "0deg",
    }, {
        rotation: "360deg",
        duration: 0.65,
        ease: "expo.out",
        clearProps: "all",
    });
    transitionTable?.appendChild(addARow());
});

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
    const nextStateZeroInput = document.createElement("input");
    const nextStateOneInput = document.createElement("input");

    nextState.classList.add("next-state");
    nextStateZeroInput.classList.add("next-state-zero-input");
    nextStateOneInput.classList.add("next-state-one-input");

    const [nextStateZeroVal, nextStateOneVal] = ([] as any[]).concat(nextStateVal ?? []);
    nextStateZeroInput.value = nextStateZeroVal ?? "";
    nextStateOneInput.value = nextStateOneVal ?? "";
    nextState.append(nextStateZeroInput, nextStateOneInput);

    const output = document.createElement("div");
    output.classList.add("output");

    if (isMooreCheck?.checked) {
        // Moore
        subheaderOutput!.innerHTML = '';
        subheaderOutput?.classList.remove("output-mealy");
        subheaderOutput?.classList.add("output-moore");

        const outputInput = document.createElement("input");

        output.classList.add("output-moore");
        outputInput.classList.add("output-moore-input");

        outputInput.value = ([] as any[]).concat(outputVal ?? [])[0] ?? "";
        output.append(outputInput);
    } else {
        // Mealy
        subheaderOutput!.innerHTML = '<p>X = 0</p><p>X = 1</p>';
        subheaderOutput?.classList.remove("output-moore");
        subheaderOutput?.classList.add("output-mealy");

        const outputZeroInput = document.createElement("input");
        const outputOneInput = document.createElement("input");

        output.classList.add("output-mealy");
        outputZeroInput.classList.add("output-mealy-zero-input");
        outputOneInput.classList.add("output-mealy-one-input");

        const [outputZeroVal, outputOneVal] = ([] as any[]).concat(outputVal ?? []);
        outputZeroInput.value = outputZeroVal ?? "";
        outputOneInput.value = outputOneVal ?? "";
        output.append(outputZeroInput, outputOneInput);
    }

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("trash-icon");
    const trashIconImg = document.createElement('img')
    trashIconImg.src = trashIcon;
    deleteButton.tabIndex = -1;
    deleteButton?.append(trashIconImg);
    deleteButton.addEventListener('click', e => {
        gsap.to(row, {
            "--scale": 0,
            height: 0,
            duration: .5,
            ease: "expo.out",
            onComplete: () => {
                row.remove();
            }
        });
    });

    gsap.fromTo(row, {
        "--scale": 0,
        height: 0,
    }, {
        "--scale": 1,
        height: "2rem",
        duration: .5,
        ease: "expo.out",
    }
    );

    gsap.fromTo(row.children, {
        "--scale": 0,
        height: 0,
    }, {
        "--scale": 1,
        height: "2rem",
        duration: .5,
        ease: "expo.out",
    }
    );

    row.append(presentState, nextState, output, deleteButton);

    return row;
}

transitionTable?.appendChild(addARow());


function readTable() {
    const transitionTableData: {
        presentState: string[],
        nextState: string[][],
        output: string[][]
    } = {
        presentState: [],
        nextState: [],
        output: []
    };

    const rows = document.querySelectorAll(".row");

    if (isMooreCheck?.checked) {
        // Moore
        rows.forEach(row => {
            transitionTableData.presentState.push(row.querySelector<HTMLInputElement>(".present-state-input")!.value)
            transitionTableData.nextState.push([row.querySelector<HTMLInputElement>(".next-state-zero-input")!.value, row.querySelector<HTMLInputElement>(".next-state-one-input")!.value])
            transitionTableData.output.push([row.querySelector<HTMLInputElement>(".output-moore-input")!.value]);
        });
    } else {
        // Mealy
        rows.forEach(row => {
            transitionTableData.presentState.push(row.querySelector<HTMLInputElement>(".present-state-input")!.value)
            transitionTableData.nextState.push([row.querySelector<HTMLInputElement>(".next-state-zero-input")!.value, row.querySelector<HTMLInputElement>(".next-state-one-input")!.value])
            transitionTableData.output.push([row.querySelector<HTMLInputElement>(".output-mealy-zero-input")!.value, row.querySelector<HTMLInputElement>(".output-mealy-one-input")!.value]);
        });
    }

    console.log(transitionTableData);

}

generateButton?.addEventListener("click", e => {
    readTable();
});