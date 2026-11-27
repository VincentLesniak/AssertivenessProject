/**
 * Écrans de résultats : grille d'analyse, histogramme avec détail par posture, conclusion.
 * Chaque fonction remplit le conteneur `panel` et ne garde aucun état global.
 */
import { barGeometry, barPath, ticks, valueToY } from "../core/chart.js";
import { CATEGORIES } from "../core/scoring.js";
import { frenchSpacing } from "../core/typography.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEW = { width: 320, height: 190 };
const PLOT = { left: 26, top: 10, width: 288, height: 170 };

/** Couleur d'une posture, définie dans tokens.css. */
export const postureColor = (category) => `var(--color-${category})`;

function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (text !== undefined) {
        element.textContent = frenchSpacing(text);
    }
    return element;
}

function svg(tag, attributes = {}, text) {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, String(value));
    }
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

export function renderGrid(panel, grid) {
    const list = create("ul", "grid-list");
    list.append(...grid.items.map((item) => create("li", "", item)));
    panel.replaceChildren(create("p", "panel-lead", grid.subtitle), list);
}

function buildChart(scores, maximum, labels) {
    const summary = CATEGORIES.map(
        (category) => `${labels[category]} ${scores[category]} sur ${maximum}`,
    ).join(", ");
    const chart = svg("svg", {
        viewBox: `0 0 ${VIEW.width} ${VIEW.height}`,
        role: "img",
        "aria-label": `Tes résultats : ${summary}`,
        class: "chart",
    });

    for (const value of ticks(maximum)) {
        const y = valueToY(value, maximum, PLOT);
        chart.append(
            svg("line", {
                x1: PLOT.left,
                x2: PLOT.left + PLOT.width,
                y1: y,
                y2: y,
                class: value === 0 ? "chart-axis" : "chart-grid",
            }),
            svg("text", { x: PLOT.left - 6, y: y + 3.5, class: "chart-tick" }, String(value)),
        );
    }

    CATEGORIES.forEach((category, index) => {
        const bar = barGeometry(scores[category], maximum, index, CATEGORIES.length, PLOT, 0.3);
        const inside = bar.height >= 22;
        chart.append(
            svg("path", {
                d: barPath(bar, 4),
                class: "chart-bar",
                style: `fill: ${postureColor(category)}`,
            }),
            svg(
                "text",
                {
                    x: bar.x + bar.width / 2,
                    y: inside ? bar.y + 15 : bar.y - 5,
                    class: "chart-value",
                    // --rise : distance parcourue par le chiffre pendant que la barre pousse
                    style: `fill: ${inside ? "var(--color-on-primary)" : "var(--color-text)"}; --rise: ${bar.height}px`,
                },
                String(scores[category]),
            ),
        );
    });
    return chart;
}

/**
 * Histogramme + boutons des postures. `selected` = posture dont on lit le détail, ou null.
 * `onSelect(category)` est appelé au clic sur un bouton.
 */
export function renderScores(panel, { scores, maximum, results, selected, onSelect, onDownload }) {
    const labels = results.categoryLabels;

    const srList = create("ul", "visually-hidden");
    srList.append(
        ...CATEGORIES.map((category) =>
            create("li", "", `${labels[category]} : ${scores[category]} / ${maximum}`),
        ),
    );

    let main;
    if (selected) {
        const posture = results.postures[selected];
        main = create("article", "posture-card");
        main.style.setProperty("--posture-color", postureColor(selected));
        main.setAttribute("aria-live", "polite");
        main.append(
            create("h2", "", posture.title),
            create("p", "", posture.text),
            create("p", "posture-score", `${labels[selected]} · ${scores[selected]} / ${maximum}`),
        );
    } else {
        main = buildChart(scores, maximum, labels);
    }

    const buttons = create("div", "posture-buttons");
    buttons.append(
        ...CATEGORIES.map((category) => {
            const button = create("button", "posture-button");
            button.type = "button";
            button.style.color = postureColor(category);
            button.append(create("span", "", labels[category]));
            const isSelected = category === selected;
            button.classList.toggle("is-active", isSelected);
            button.classList.toggle("is-dimmed", selected !== null && !isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
            button.addEventListener("click", () => onSelect(category));
            return button;
        }),
    );

    const children = [srList, main, buttons];
    if (!selected) {
        children.push(create("p", "panel-hint", results.chartHint));
    }
    children.push(downloadButton(results.print.button, onDownload));
    panel.replaceChildren(...children);
}

function downloadButton(label, onDownload) {
    const button = create("button", "btn download-button", label);
    button.type = "button";
    button.addEventListener("click", onDownload);
    return button;
}

export function renderConclusion(
    panel,
    { conclusion, restartLabel, onRestart, downloadLabel, onDownload },
) {
    const restartButton = create("button", "btn btn-primary", restartLabel);
    restartButton.type = "button";
    restartButton.classList.add("restart");
    restartButton.addEventListener("click", onRestart);
    const actions = create("div", "actions");
    actions.append(downloadButton(downloadLabel, onDownload), restartButton);
    panel.replaceChildren(
        create("p", "panel-lead", conclusion.subtitle),
        ...conclusion.paragraphs.map((text) => create("p", "", text)),
        actions,
    );
}
