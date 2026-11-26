/**
 * Écrans de résultats : grille d'analyse, histogramme avec détail par posture, conclusion.
 * Chaque fonction remplit le conteneur `panel` et ne garde aucun état global.
 */
import { barGeometry, ticks, valueToY } from "../core/chart.js";
import { CATEGORIES } from "../core/scoring.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEW = { width: 320, height: 200 };
const PLOT = { left: 30, top: 12, width: 280, height: 176 };

function create(tag, attributes = {}, text) {
    const element = document.createElement(tag);
    Object.assign(element, attributes);
    if (text !== undefined) {
        element.textContent = text;
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
    panel.replaceChildren(
        create("p", { className: "panel-lead" }, grid.subtitle),
        create("ul", { className: "grid-list" }, undefined),
    );
    panel
        .querySelector(".grid-list")
        .append(...grid.items.map((item) => create("li", {}, `- ${item}`)));
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
            svg("text", { x: PLOT.left - 8, y: y + 4, class: "chart-tick" }, String(value)),
        );
    }

    CATEGORIES.forEach((category, index) => {
        const bar = barGeometry(scores[category], maximum, index, CATEGORIES.length, PLOT);
        chart.append(
            svg("rect", {
                x: bar.x,
                y: bar.y,
                width: bar.width,
                height: bar.height,
                class: "chart-bar",
            }),
            svg(
                "text",
                {
                    x: bar.x + bar.width / 2,
                    y: bar.height >= 22 ? bar.y + 16 : bar.y - 6,
                    class: "chart-value",
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
export function renderScores(panel, { scores, maximum, results, selected, onSelect }) {
    const labels = results.categoryLabels;

    const srList = create("ul", { className: "visually-hidden" });
    srList.append(
        ...CATEGORIES.map((category) =>
            create("li", {}, `${labels[category]} : ${scores[category]} / ${maximum}`),
        ),
    );

    let main;
    if (selected) {
        const posture = results.postures[selected];
        main = create("article", { className: "posture-card" });
        main.setAttribute("aria-live", "polite");
        main.append(create("h3", {}, posture.title), create("p", {}, posture.text));
    } else {
        main = create("div", { className: "chart-wrapper" });
        main.append(buildChart(scores, maximum, labels));
    }

    const buttons = create("div", { className: "posture-buttons" });
    buttons.append(
        ...CATEGORIES.map((category) => {
            const button = create("button", { type: "button" }, labels[category]);
            const isSelected = category === selected;
            button.classList.toggle("is-selected", isSelected);
            button.classList.toggle("is-dimmed", selected !== null && !isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
            button.addEventListener("click", () => onSelect(category));
            return button;
        }),
    );

    const hint = create("p", { className: "panel-hint" }, selected ? "" : results.chartHint);
    panel.replaceChildren(srList, main, buttons, hint);
}

export function renderConclusion(panel, { conclusion, restartLabel, onRestart }) {
    const restartButton = create("button", { type: "button", className: "restart" }, restartLabel);
    restartButton.addEventListener("click", onRestart);
    panel.replaceChildren(
        create("p", { className: "panel-lead" }, conclusion.subtitle),
        ...conclusion.paragraphs.map((text) => create("p", {}, text)),
        restartButton,
    );
}
