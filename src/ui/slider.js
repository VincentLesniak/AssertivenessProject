/**
 * Affichage du test : accueil, règles, 60 questions, puis écran de résultats.
 * Toute la logique (réponses, navigation, scores) est dans core/quiz.js.
 */
import { CATEGORIES } from "../core/scoring.js";
import * as Quiz from "../core/quiz.js";

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
        scores: root.querySelector("#scores"),
        answerFalse: root.querySelector("#buttonFalse"),
        answerTrue: root.querySelector("#buttonTrue"),
    };

    let quiz = Quiz.createQuiz(content.introSlides.length, questions);

    function show(element, visible) {
        element.hidden = !visible;
    }

    function renderAnswerButton(button, label, selected) {
        button.textContent = label;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    }

    function renderScores() {
        const values = Quiz.scores(quiz);
        const maximum = questions.length / CATEGORIES.length;
        el.scores.replaceChildren(
            ...CATEGORIES.map((category) => {
                const item = document.createElement("li");
                item.textContent = `${content.results.categoryLabels[category]} : ${values[category]} / ${maximum}`;
                return item;
            }),
        );
    }

    function render() {
        const kind = Quiz.currentKind(quiz);
        const question = Quiz.currentQuestion(quiz);
        const intro = kind === "intro" ? content.introSlides[quiz.index] : {};

        el.title.textContent =
            kind === "intro"
                ? intro.title
                : kind === "question"
                  ? `QUESTION ${question.id}`
                  : content.results.scoresTitle;
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

        show(el.scores, kind === "results");
        if (kind === "results") {
            renderScores();
        }

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
        render();
    }

    el.previous.addEventListener("click", () => update(Quiz.goPrevious(quiz)));
    el.next.addEventListener("click", () => update(Quiz.goNext(quiz)));
    el.answerFalse.addEventListener("click", () => update(Quiz.answer(quiz, false)));
    el.answerTrue.addEventListener("click", () => update(Quiz.answer(quiz, true)));

    render();
}
