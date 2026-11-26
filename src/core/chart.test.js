import { describe, expect, it } from "vitest";
import { barGeometry, ticks, valueToY } from "./chart.js";

const plot = { left: 40, top: 10, width: 400, height: 150 };

describe("ticks", () => {
    it("gradue l'axe de 5 en 5 jusqu'à 15", () => {
        expect(ticks(15)).toEqual([0, 5, 10, 15]);
    });
});

describe("barGeometry", () => {
    it("donne une barre pleine hauteur pour 15 / 15", () => {
        const bar = barGeometry(15, 15, 0, 4, plot);
        expect(bar.height).toBe(150);
        expect(bar.y).toBe(10);
    });

    it("donne une barre vide pour 0 / 15, posée sur l'axe", () => {
        const bar = barGeometry(0, 15, 0, 4, plot);
        expect(bar.height).toBe(0);
        expect(bar.y).toBe(160);
    });

    it("donne une hauteur proportionnelle au score", () => {
        expect(barGeometry(9, 15, 1, 4, plot).height).toBeCloseTo(90);
    });

    it("place les barres côte à côte, centrées dans leur colonne", () => {
        const first = barGeometry(5, 15, 0, 4, plot);
        const second = barGeometry(5, 15, 1, 4, plot);
        expect(second.x - first.x).toBe(100);
        expect(first.x).toBe(40 + (100 - first.width) / 2);
    });

    it("borne un score hors limites", () => {
        expect(barGeometry(20, 15, 0, 4, plot).height).toBe(150);
        expect(barGeometry(-3, 15, 0, 4, plot).height).toBe(0);
    });
});

describe("valueToY", () => {
    it("place 0 en bas et le maximum en haut", () => {
        expect(valueToY(0, 15, plot)).toBe(160);
        expect(valueToY(15, 15, plot)).toBe(10);
    });
});
