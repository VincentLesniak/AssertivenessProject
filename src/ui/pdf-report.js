/**
 * PDF des résultats, téléchargé directement (une page A4).
 * jsPDF n'est chargé qu'au clic sur le bouton, pour garder le site léger au chargement.
 */
import { ticks } from "../core/chart.js";
import { CATEGORIES } from "../core/scoring.js";
import { frenchSpacing } from "../core/typography.js";

const PAGE = { width: 210, height: 297, margin: 16 };
const CONTENT_WIDTH = PAGE.width - 2 * PAGE.margin;
const PT_TO_MM = 25.4 / 72;
const LINE_FACTOR = 1.4;

/** Couleur d'un jeton CSS (tokens.css) au format [r, g, b]. */
function tokenColor(name) {
    const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = parseInt(hex.slice(1), 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/**
 * Crée le PDF et lance son téléchargement.
 * `report` : { scores, maximum, results, credit, date, fileName }.
 */
export async function downloadReport(report) {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    drawReport(doc, report);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(doc.output("blob"));
    link.download = `${report.fileName}.pdf`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function drawReport(doc, { scores, maximum, results, credit, date }) {
    const { print, categoryLabels: labels, postures, conclusion } = results;
    const colors = {
        text: tokenColor("--color-text"),
        muted: tokenColor("--color-muted"),
        line: tokenColor("--color-line"),
    };
    for (const category of CATEGORIES) {
        colors[category] = tokenColor(`--color-${category}`);
    }
    const left = PAGE.margin;
    const right = PAGE.width - PAGE.margin;

    // Texte sur plusieurs lignes ; retourne la hauteur occupée
    const paragraph = (
        text,
        x,
        y,
        width,
        { size = 9.5, bold = false, color = colors.text } = {},
    ) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        doc.setTextColor(...color);
        // Les espaces insécables empêchent la coupure, puis redeviennent des espaces
        // ordinaires pour que jsPDF puisse justifier la ligne correctement
        const lines = doc
            .splitTextToSize(frenchSpacing(text), width)
            .map((line) => line.replaceAll("\u00a0", " "));
        const lineHeight = size * PT_TO_MM * LINE_FACTOR;
        doc.text(lines, x, y + size * PT_TO_MM, {
            maxWidth: width,
            align: lines.length > 1 ? "justify" : "left",
            lineHeightFactor: LINE_FACTOR,
        });
        return lines.length * lineHeight;
    };
    const heading = (text, y) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...colors.text);
        doc.text(text.toUpperCase(), left, y + 11 * PT_TO_MM);
        return 11 * PT_TO_MM * LINE_FACTOR + 2;
    };

    // En-tête : titre, date, filet
    let y = PAGE.margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...colors.text);
    doc.text(frenchSpacing(print.title), left, y + 18 * PT_TO_MM);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.muted);
    doc.text(print.date.replace("{date}", date), right, y + 18 * PT_TO_MM, { align: "right" });
    y += 10;
    doc.setDrawColor(...colors.line);
    doc.setLineWidth(0.3);
    doc.line(left, y, right, y);
    y += 6;

    // Histogramme
    y += drawChart(doc, { scores, maximum, colors, top: y });
    y += 6;

    // Les 4 postures, sur deux colonnes
    y += heading(print.postures, y);
    const gap = 6;
    const columnWidth = (CONTENT_WIDTH - gap) / 2;
    for (let row = 0; row < 2; row++) {
        let rowHeight = 0;
        for (let column = 0; column < 2; column++) {
            const category = CATEGORIES[row * 2 + column];
            const x = left + column * (columnWidth + gap);
            const textX = x + 3.5;
            const textWidth = columnWidth - 3.5;
            let height = paragraph(postures[category].title, textX, y, textWidth, {
                size: 10,
                bold: true,
            });
            height += 1;
            height += paragraph(postures[category].text, textX, y + height, textWidth);
            height += 1;
            height += paragraph(
                `${labels[category]} · ${scores[category]} / ${maximum}`,
                textX,
                y + height,
                textWidth,
                { size: 9, bold: true, color: colors[category] },
            );
            doc.setFillColor(...colors[category]);
            doc.rect(x, y, 1, height, "F");
            rowHeight = Math.max(rowHeight, height);
        }
        y += rowHeight + 5;
    }

    // Conclusion
    y += 1;
    y += heading(conclusion.title, y);
    y += paragraph(conclusion.subtitle, left, y, CONTENT_WIDTH, { bold: true }) + 2;
    for (const text of conclusion.paragraphs) {
        y += paragraph(text, left, y, CONTENT_WIDTH) + 2;
    }

    // Crédit du livre, en bas de page
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.muted);
    doc.text(frenchSpacing(credit), PAGE.width / 2, Math.max(y + 6, PAGE.height - PAGE.margin), {
        align: "center",
    });
}

/** Dessine l'histogramme centré et retourne sa hauteur. */
function drawChart(doc, { scores, maximum, colors, top }) {
    const width = 110;
    const height = 55;
    const axisLeft = (PAGE.width - width) / 2 + 8;
    const plotWidth = width - 8;
    const bottom = top + height;
    const toY = (value) => bottom - (value / maximum) * height;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setLineWidth(0.2);
    for (const value of ticks(maximum)) {
        const y = toY(value);
        doc.setDrawColor(...(value === 0 ? colors.muted : colors.line));
        doc.setLineWidth(value === 0 ? 0.4 : 0.2);
        doc.line(axisLeft, y, axisLeft + plotWidth, y);
        doc.setTextColor(...colors.muted);
        doc.text(String(value), axisLeft - 2, y + 1, { align: "right" });
    }

    const slot = plotWidth / CATEGORIES.length;
    const barWidth = slot * 0.6;
    CATEGORIES.forEach((category, index) => {
        const score = scores[category];
        const x = axisLeft + index * slot + (slot - barWidth) / 2;
        const y = toY(score);
        const barHeight = bottom - y;
        if (barHeight > 0) {
            // Coins du haut arrondis, base plate sur l'axe
            const radius = Math.min(1.2, barHeight);
            doc.setFillColor(...colors[category]);
            doc.roundedRect(x, y, barWidth, barHeight, radius, radius, "F");
            doc.rect(x, y + radius, barWidth, barHeight - radius, "F");
        }
        const inside = barHeight >= 7;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...(inside ? [255, 255, 255] : colors.text));
        doc.text(String(score), x + barWidth / 2, inside ? y + 4.5 : y - 1.5, { align: "center" });
    });
    return height + 2;
}
