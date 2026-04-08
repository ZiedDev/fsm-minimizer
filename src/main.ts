import './style.css';
import trashIcon from './assets/trashIcon.svg'

const transitionTable = document.querySelector("#transition-table-content");
const isMooreCheck = document.querySelector<HTMLInputElement>("#is-moore-check");
const addRowButton = document.querySelector<HTMLInputElement>("#add-row-button");
const subheaderOutput = document.querySelector<HTMLInputElement>("#subheader-output");

isMooreCheck?.addEventListener("click", e => {
    transitionTable!.innerHTML = "";
    transitionTable?.appendChild(addARow());
});

addRowButton?.addEventListener("click", e => {
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
    presentStateInput.value = presentStateVal ?? "";
    presentState.append(presentStateInput);

    const nextState = document.createElement("div");
    nextState.classList.add("next-state");
    const nextStateZeroInput = document.createElement("input");
    const nextStateOneInput = document.createElement("input");
    const [nextStateZeroVal, nextStateOneVal] = ([] as any[]).concat(nextStateVal ?? []);
    nextStateZeroInput.value = nextStateZeroVal ?? "";
    nextStateOneInput.value = nextStateOneVal ?? "";
    nextState.append(nextStateZeroInput, nextStateOneInput);

    const output = document.createElement("div");
    output.classList.add("output");

    if (isMooreCheck?.checked) {
        subheaderOutput!.innerHTML = '';
        subheaderOutput?.classList.remove("output-mealy");
        subheaderOutput?.classList.add("output-moore");

        const outputInput = document.createElement("input");
        output.classList.add("output-moore");
        outputInput.value = ([] as any[]).concat(outputVal ?? [])[0] ?? "";
        output.append(outputInput);
    } else {
        subheaderOutput!.innerHTML = '<p>X = 0</p><p>X = 1</p>';
        subheaderOutput?.classList.remove("output-moore");
        subheaderOutput?.classList.add("output-mealy");

        output.classList.add("output-mealy");
        const outputZeroInput = document.createElement("input");
        const outputOneInput = document.createElement("input");
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
    deleteButton.addEventListener('click', e=> {
        row.parentElement!.removeChild(row);
    });

    row.append(presentState, nextState, output, deleteButton);

    return row;
}

transitionTable?.appendChild(addARow());
