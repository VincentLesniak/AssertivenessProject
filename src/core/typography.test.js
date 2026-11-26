import { describe, expect, it } from "vitest";
import { frenchSpacing } from "./typography.js";

const NBSP = " ";

describe("frenchSpacing", () => {
    it("colle les guillemets à leur contenu", () => {
        expect(frenchSpacing("nos « pensées automatiques ».")).toBe(
            `nos «${NBSP}pensées automatiques${NBSP}».`,
        );
    });

    it("colle : ; ? ! au mot qui précède", () => {
        expect(frenchSpacing("Clavier : V ; oui ? non !")).toBe(
            `Clavier${NBSP}: V${NBSP}; oui${NBSP}? non${NBSP}!`,
        );
    });

    it("laisse intact un texte sans ponctuation double", () => {
        expect(frenchSpacing("Je suis à l’aise")).toBe("Je suis à l’aise");
    });

    it("accepte un texte vide", () => {
        expect(frenchSpacing(undefined)).toBe("");
    });
});
