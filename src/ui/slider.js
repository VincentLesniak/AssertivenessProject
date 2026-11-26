/**
 * Diaporama du test : accueil, règles, puis une diapositive par question.
 * v0.1.0 reproduit le comportement de l'ancienne version (app/assets/js/script.js).
 * Les corrections (fin du test, retour arrière) arrivent en v0.2.0.
 */
import { addAnswer, createEmptyScores } from "../core/scoring.js";

/** Construit la liste des diapositives à partir des données. */
export function buildSlides(content, questions) {
    const questionSlides = questions.map((question) => ({
        title: `QUESTION ${question.id}`,
        text: question.text,
        question,
    }));
    // La dernière diapositive vide reproduit la fin actuelle du test.
    return [...content.introSlides, ...questionSlides, {}];
}

export function startSlider(root, content, questions) {
    const el = {
        left: root.querySelector("#leftButton"),
        right: root.querySelector("#rightButton"),
        title: root.querySelector("#h1"),
        subtitle: root.querySelector("#h2"),
        text: root.querySelector("#p"),
        note: root.querySelector("#h3"),
        credit: root.querySelector("#h42"),
    };

    const falseButton = document.createElement("button");
    falseButton.id = "buttonFalse";
    const trueButton = document.createElement("button");
    trueButton.id = "buttonTrue";
    root.append(falseButton, trueButton);

    const slides = buildSlides(content, questions);
    const firstQuestionIndex = content.introSlides.length;
    let index = 0;
    let hasStarted = false;
    let scores = createEmptyScores();

    function show(element, visible) {
        element.style.display = visible ? "inline-block" : "none";
    }

    function render() {
        const slide = slides[index];
        el.title.textContent = slide.title ?? "";
        el.subtitle.textContent = slide.subtitle ?? "";
        el.text.textContent = slide.text ?? "";
        el.note.textContent = slide.note ?? "";
        el.credit.textContent = hasStarted ? content.credit : "";

        const isQuestionArea = index >= firstQuestionIndex;
        falseButton.textContent = slide.question ? content.answers.false : "";
        trueButton.textContent = slide.question ? content.answers.true : "";

        show(el.left, index > 0);
        show(el.right, !isQuestionArea);
        show(falseButton, isQuestionArea);
        show(trueButton, isQuestionArea);
    }

    function goTo(newIndex) {
        if (newIndex < 0 || newIndex > slides.length - 1) {
            return;
        }
        index = newIndex;
        if (index > 0) {
            hasStarted = true;
        }
        render();
    }

    function answer(isTrue) {
        const { question } = slides[index];
        if (!question) {
            return;
        }
        scores = addAnswer(scores, question, isTrue);
        // Comme avant, les scores ne sont visibles que dans la console.
        console.log(`Question ${question.id} :`, scores);
        goTo(index + 1);
    }

    el.right.addEventListener("click", () => goTo(index + 1));
    el.left.addEventListener("click", () => goTo(index - 1));
    trueButton.addEventListener("click", () => answer(true));
    falseButton.addEventListener("click", () => answer(false));

    render();
}
