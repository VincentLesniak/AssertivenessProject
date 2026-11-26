/**
 * Affichage du test : accueil, règles, 60 questions, puis les écrans de résultats.
 * Toute la logique (réponses, navigation, scores) est dans core/quiz.js.
 */
import { CATEGORIES } from "../core/scoring.js";
import * as Quiz from "../core/quiz.js";
import { renderConclusion, renderGrid, renderScores } from "./results-screens.js";

export function startSlider(root, content, questions) {
    const el = {
        previous: root.querySelector("#leftButton"),
        next: root.querySelector("#rightButton"),
        title: root.querySelector("#h1"),
        subtitle: root.querySelector("#h2"),
        text: root.querySelector("#p"),
        note: root.querySelector("#h3"),
        credit: root.querySelector("#h42"),
        progress: root.querySelector("#progress"),
        progressBar: root.querySelector("#progressBar"),
        progressText: root.querySelector("#progressText"),
        panel: root.querySelector("#panel"),
        answerFalse: root.querySelector("#buttonFalse"),
        answerTrue: root.querySelector("#buttonTrue"),
    };

    const { results } = content;
    const maximum = questions.length / CATEGORIES.length;
    let quiz = Quiz.createQuiz(content.introSlides.length, questions);
    let selectedPosture = null;

    function show(element, visible) {
        element.hidden = !visible;
    }

    function renderAnswerButton(button, label, selected) {
        button.textContent = label;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    }

    function titleFor(kind, question) {
        switch (kind) {
            case "intro":
                return content.introSlides[quiz.index].title;
            case "question":
                return `QUESTION ${question.id}`;
            case "grid":
                return results.analysisGrid.title;
            case "scores":
                return results.scoresTitle;
            default:
                return results.conclusion.title;
        }
    }

    function renderPanel(kind) {
        if (kind === "grid") {
            renderGrid(el.panel, results.analysisGrid);
        } else if (kind === "scores") {
            renderScores(el.panel, {
                scores: Quiz.scores(quiz),
                maximum,
                results,
                selected: selectedPosture,
                onSelect: (category) => {
                    selectedPosture = selectedPosture === category ? null : category;
                    render();
                },
            });
        } else if (kind === "conclusion") {
            renderConclusion(el.panel, {
                conclusion: results.conclusion,
                restartLabel: results.restart,
                onRestart: () => update(Quiz.restart(quiz)),
            });
        } else {
            el.panel.replaceChildren();
        }
    }

    function render() {
        const kind = Quiz.currentKind(quiz);
        const question = Quiz.currentQuestion(quiz);
        const intro = kind === "intro" ? content.introSlides[quiz.index] : {};
        const isResult = Quiz.isResultScreen(quiz);

        el.title.textContent = titleFor(kind, question);
        el.subtitle.textContent = intro.subtitle ?? "";
        el.text.textContent = question ? question.text : "";
        el.note.textContent = intro.note ?? "";
        el.credit.textContent = content.credit;

        const position = Quiz.progress(quiz);
        show(el.progress, position !== null);
        if (position) {
            el.progressBar.max = position.total;
            el.progressBar.value = position.current;
            el.progressText.textContent = `Question ${position.current} / ${position.total}`;
        }

        show(el.panel, isResult);
        renderPanel(kind);

        const answered = Quiz.currentAnswer(quiz);
        show(el.answerFalse, kind === "question");
        show(el.answerTrue, kind === "question");
        renderAnswerButton(el.answerFalse, content.answers.false, answered === false);
        renderAnswerButton(el.answerTrue, content.answers.true, answered === true);

        show(el.previous, Quiz.canGoPrevious(quiz));
        show(el.next, Quiz.canGoNext(quiz));
    }

    function update(newQuiz) {
        quiz = newQuiz;
        selectedPosture = null;
        el.panel.scrollTop = 0;
        render();
    }

    el.previous.addEventListener("click", () => update(Quiz.goPrevious(quiz)));
    el.next.addEventListener("click", () => update(Quiz.goNext(quiz)));
    el.answerFalse.addEventListener("click", () => update(Quiz.answer(quiz, false)));
    el.answerTrue.addEventListener("click", () => update(Quiz.answer(quiz, true)));

    render();
}
