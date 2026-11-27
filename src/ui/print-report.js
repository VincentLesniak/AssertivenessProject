/**
 * Page de résultats imprimable, enregistrée en PDF depuis la fenêtre d'impression.
 * Elle n'est visible qu'à l'impression (voir @media print dans main.css).
 */
import { CATEGORIES } from "../core/scoring.js";
import { buildChart, create, postureColor } from "./results-screens.js";

/** Remplit `container` avec le rapport : titre, date, histogramme, postures, conclusion. */
export function renderReport(container, { scores, maximum, results, credit, date }) {
    const { print, categoryLabels: labels, postures, conclusion } = results;

    const header = create("header", "report-head");
    header.append(
        create("h1", "", print.title),
        create("p", "report-date", print.date.replace("{date}", date)),
    );

    const postureList = create("div", "report-postures");
    postureList.append(
        ...CATEGORIES.map((category) => {
            const card = create("article", "posture-card");
            card.style.setProperty("--posture-color", postureColor(category));
            card.append(
                create("h3", "", postures[category].title),
                create("p", "", postures[category].text),
                create(
                    "p",
                    "posture-score",
                    `${labels[category]} · ${scores[category]} / ${maximum}`,
                ),
            );
            return card;
        }),
    );

    const ending = create("section", "report-conclusion");
    ending.append(
        create("h2", "", conclusion.title),
        create("p", "panel-lead", conclusion.subtitle),
        ...conclusion.paragraphs.map((text) => create("p", "", text)),
    );

    container.replaceChildren(
        header,
        buildChart(scores, maximum, labels),
        create("h2", "", print.postures),
        postureList,
        ending,
        create("p", "report-credit", credit),
    );
}

/**
 * Ouvre la fenêtre d'impression avec le rapport.
 * Le titre de la page sert de nom de fichier proposé pour le PDF.
 */
export function printReport(container, report, fileName) {
    renderReport(container, report);
    const previousTitle = document.title;
    document.title = fileName;
    document.body.classList.add("is-printing-report");
    window.addEventListener(
        "afterprint",
        () => {
            document.title = previousTitle;
            document.body.classList.remove("is-printing-report");
        },
        { once: true },
    );
    window.print();
}
