import './style.css';

const transitionTable = document.querySelector("#transition-table-content");
const isMooreCheck = document.querySelector<HTMLInputElement>("#is-moore-check");
const addRowButton = document.querySelector<HTMLInputElement>("#add-row-button");

isMooreCheck?.addEventListener("click",e => {
    transitionTable!.innerHTML = "";
    transitionTable?.appendChild(addARow());
});

addRowButton?.addEventListener("click",e => {
    transitionTable?.appendChild(addARow());
});

function addARow(
    { presentStateVal, nextStateVal, outputVal }: {
        presentStateVal?: string,
        nextStateVal?: string[],
        outputVal?: number[]
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
        const outputInput = document.createElement("input");
        output.classList.add("output-moore");
        outputInput.value = ([] as any[]).concat(outputVal ?? [])[0] ?? "";
        output.append(outputInput);
    } else {
        output.classList.add("output-mealy");
        const outputZeroInput = document.createElement("input");
        const outputOneInput = document.createElement("input");
        const [outputZeroVal, outputOneVal] = ([] as any[]).concat(outputVal ?? []);
        outputZeroInput.value = outputZeroVal ?? "";
        outputOneInput.value = outputOneVal ?? "";
        output.append(outputZeroInput, outputOneInput);
    }


    row.append(presentState, nextState, output);

    console.log(outputVal);

    return row;
}

transitionTable?.appendChild(addARow());
