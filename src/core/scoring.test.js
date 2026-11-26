import { describe, expect, it } from "vitest";
import questions from "../data/questions.json";
import { CATEGORIES, addAnswer, computeScores, createEmptyScores } from "./scoring.js";

describe("questions.json", () => {
    it("contient les 60 questions numérotées de 1 à 60", () => {
        expect(questions.map((q) => q.id)).toEqual(Array.from({ length: 60 }, (_, i) => i + 1));
    });

    it("répartit 15 questions dans chacune des 4 postures", () => {
        for (const category of CATEGORIES) {
            expect(questions.filter((q) => q.category === category)).toHaveLength(15);
        }
    });

    it("garde la grille de correction du livre", () => {
        const idsOf = (category) =>
            questions.filter((q) => q.category === category).map((q) => q.id);
        expect(idsOf("flight")).toEqual([1, 7, 15, 16, 17, 25, 26, 35, 36, 37, 50, 51, 52, 59, 60]);
        expect(idsOf("aggression")).toEqual([
            4, 6, 10, 11, 20, 21, 28, 29, 30, 39, 40, 48, 49, 55, 56,
        ]);
        expect(idsOf("manipulation")).toEqual([
            3, 5, 9, 12, 13, 19, 22, 31, 32, 41, 42, 46, 47, 54, 57,
        ]);
        expect(idsOf("assertiveness")).toEqual([
            2, 8, 14, 18, 23, 24, 27, 33, 34, 38, 43, 44, 45, 53, 58,
        ]);
    });
});

describe("addAnswer", () => {
    const question = { id: 2, category: "assertiveness" };

    it("ajoute un point pour « plutôt vrai »", () => {
        expect(addAnswer(createEmptyScores(), question, true).assertiveness).toBe(1);
    });

    it("n'ajoute rien pour « plutôt faux »", () => {
        expect(addAnswer(createEmptyScores(), question, false)).toEqual(createEmptyScores());
    });

    it("ne modifie pas les scores reçus", () => {
        const scores = createEmptyScores();
        addAnswer(scores, question, true);
        expect(scores.assertiveness).toBe(0);
    });

    it("refuse une catégorie inconnue", () => {
        expect(() => addAnswer(createEmptyScores(), { id: 99, category: "x" }, true)).toThrow();
    });
});

describe("computeScores", () => {
    it("donne 15 partout quand tout est « plutôt vrai »", () => {
        const answers = Object.fromEntries(questions.map((q) => [q.id, true]));
        expect(computeScores(questions, answers)).toEqual({
            flight: 15,
            aggression: 15,
            manipulation: 15,
            assertiveness: 15,
        });
    });

    it("donne 0 partout quand tout est « plutôt faux »", () => {
        const answers = Object.fromEntries(questions.map((q) => [q.id, false]));
        expect(computeScores(questions, answers)).toEqual(createEmptyScores());
    });

    it("ignore les questions sans réponse", () => {
        expect(computeScores(questions, { 1: true, 2: true, 3: false })).toEqual({
            flight: 1,
            aggression: 0,
            manipulation: 0,
            assertiveness: 1,
        });
    });
});
