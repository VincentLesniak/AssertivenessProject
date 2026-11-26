import { describe, expect, it } from "vitest";
import questions from "../data/questions.json";
import { answer, createQuiz, currentKind, goNext, progress } from "./quiz.js";
import { fromSave, hasProgress, resumePoint, SAVE_VERSION, toSave } from "./save.js";

const start = () => createQuiz(2, questions);
const afterAnswers = (count) => {
    let quiz = goNext(goNext(start()));
    for (let i = 0; i < count; i++) {
        quiz = answer(quiz, i % 2 === 0);
    }
    return quiz;
};
const roundTrip = (quiz) => fromSave(JSON.parse(JSON.stringify(toSave(quiz))), 2, questions);

describe("sauvegarde", () => {
    it("ne considère pas un test sans réponse comme en cours", () => {
        expect(hasProgress(start())).toBe(false);
        expect(hasProgress(afterAnswers(1))).toBe(true);
    });

    it("retrouve la position et les réponses après un aller-retour JSON", () => {
        const quiz = afterAnswers(22);
        const restored = roundTrip(quiz);
        expect(restored.index).toBe(quiz.index);
        expect(restored.answers).toEqual(quiz.answers);
        expect(progress(restored)).toEqual({ current: 23, total: 60 });
    });

    it("ignore une sauvegarde absente, sans réponse ou d'une autre version", () => {
        expect(fromSave(null, 2, questions)).toBeNull();
        expect(fromSave(toSave(start()), 2, questions)).toBeNull();
        expect(
            fromSave({ ...toSave(afterAnswers(3)), version: SAVE_VERSION + 1 }, 2, questions),
        ).toBeNull();
    });

    it("ignore une sauvegarde incohérente", () => {
        const data = toSave(afterAnswers(3));
        expect(fromSave({ ...data, answers: { 999: true } }, 2, questions)).toBeNull();
        expect(fromSave({ ...data, answers: { 1: "oui" } }, 2, questions)).toBeNull();
        expect(fromSave({ ...data, index: 65 }, 2, questions)).toBeNull();
        expect(fromSave({ ...data, index: "4" }, 2, questions)).toBeNull();
    });
});

describe("reprise", () => {
    it("reprend sur la question sauvegardée", () => {
        const quiz = afterAnswers(10);
        expect(resumePoint(quiz)).toBe(quiz);
    });

    it("reprend sur la première question sans réponse si l'on était revenu à l'introduction", () => {
        const quiz = { ...afterAnswers(10), index: 0 };
        expect(progress(resumePoint(quiz))).toEqual({ current: 11, total: 60 });
    });

    it("reprend sur les résultats si toutes les questions ont une réponse", () => {
        const quiz = { ...afterAnswers(60), index: 1 };
        expect(currentKind(resumePoint(quiz))).toBe("grid");
    });
});
