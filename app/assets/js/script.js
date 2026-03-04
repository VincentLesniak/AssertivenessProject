const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const cardContent = document.getElementById("content");
const h1 = document.getElementById("h1");
const h2 = document.getElementById("h2");
const p = document.getElementById("p");
const h3 = document.getElementById("h3");
const button1 = document.createElement("button");
const button2 = document.createElement("button");
const h41 = document.getElementById("h41");
const h42 = document.getElementById("h42");
let i = 0;
const questionListFuite = [1, 7, 15, 16, 17, 25, 26, 35, 36, 37, 50, 51, 52, 59, 60];
const questionListAgressive = [4, 6, 10, 11, 20, 21, 28, 29, 30, 39, 40, 48, 49, 55, 56];
const questionListManipulation = [3, 5, 9, 12, 13, 19, 22, 31, 32, 41, 42, 46, 47, 54, 57];
const questionListAssertive = [2, 8, 14, 18, 23, 24, 27, 33, 34, 38, 43, 44, 45, 53, 58];
let fuite = 0;
let agressive = 0;
let manipulation = 0;
let assertive = 0;

const informations = [
    {h1: "TESTEZ VOTRE ASSERTIVITÉ", h2: "", p: "", h3: "", button1: "", button2: "", h41: "", h42:"",},
    {h1: "REGLES", h2: "Répondez le plus spontanément possible en répondant par plutôt vrai ou plutôt faux", p: "", h3: "« plutôt vrai » : vous pensez ou agissez de cette façon la plupart du temps « plutôt faux » : vous faîtes ou pensez rarement de cette façon", button1: "", button2: "", h41: "", h42:"",},
    {h1: "QUESTION 1", h2: "", p: "Je dis souvent oui, alors que je voudrais dire non", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 2", h2: "", p: "Je défends mes droits, sans empiéter sur ceux des autres", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 3", h2: "", p: "Je préfère dissimuler ce que je pense ou ressens, si je ne connais pas bien la personne", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 4", h2: "", p: "Je suis plutôt autoritaire et décidé", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 5", h2: "", p: "Il est en général plus facile et habile d’agir par personne interposée que directement", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 6", h2: "", p: "Je ne crains pas de critiquer et de dire aux gens ce que je pense", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 7", h2: "", p: "Je n’ose pas refuser certaines tâches qui manifestement ne relèvent pas de mes attributions", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 8", h2: "", p: "Je ne crains pas de donner mon opinion, même en face d’interlocuteurs hostiles", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 9", h2: "", p: "Quand il y a un débat, je préfère me tenir en retrait pour voir comment cela va tourner", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 10", h2: "", p: "On me reproche parfois d’avoir l’esprit de contradiction", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 11", h2: "", p: "J’ai du mal à écouter les autres", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 12", h2: "", p: "Je m’arrange pour être dans les secrets des dieux ; cela m’a bien rendu service", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 13", h2: "", p: "On me considère en général comme assez malin et habile dans les relations", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 14", h2: "", p: "J’entretiens avec les autres des rapports fondés sur la confiance plutôt que sur la domination ou le calcul", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 15", h2: "", p: "Je préfère ne pas demander de l’aide à un collègue ; il risquerait de penser que je ne suis pas compétent", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 16", h2: "", p: "Je suis timide et je me sens bloqué dès que je dois réaliser une action inhabituelle", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 17", h2: "", p: "On me dit « soupe au lait » ; je m’énerve et cela fait rire les autres", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 18", h2: "", p: "Je suis à l’aise dans les contacts de face à face", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 19", h2: "", p: "Je joue assez souvent la comédie : comment faire autrement pour arriver à ses fins ?", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 20", h2: "", p: "Je suis bavard et je coupe la parole aux autres sans m’en rendre compte à temps", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 21", h2: "", p: "J’ai de l’ambition et je suis prêt à faire ce qu’il faut pour arriver", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 22", h2: "", p: "Je sais en général qui il faut voir et quand il faut le voir : c’est important pour réussir", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 23", h2: "", p: "En cas de désaccord, je recherche les compromis réalistes sur la base des intérêts mutuels", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 24", h2: "", p: "Je préfère « jouer cartes sur table »", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 25", h2: "", p: "J’ai tendance à remettre à plus tard ce que je dois faire", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 26", h2: "", p: "Je laisse souvent un travail en train sans le terminer", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 27", h2: "", p: "En général, je me présente tel que je suis, sans dissimuler mes sentiments", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 28", h2: "", p: "Il en faut beaucoup pour m’intimider", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 29", h2: "", p: "Faire peur aux autres est souvent un bon moyen de prendre du pouvoir", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 30", h2: "", p: "Quand je me suis fait avoir une fois, je sais prendre ma revanche à l’occasion", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 31", h2: "", p: "Pour critiquer quelqu’un, il est efficace de lui reprocher de ne pas suivre ses propres principes. Il est forcément d’accord.", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 32", h2: "", p: "Je sais tirer parti du système : je suis débrouillard", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 33", h2: "", p: "Je suis capable d’être moi-même, tout en continuant d’être accepté socialement", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 34", h2: "", p: "Quand je ne suis pas d’accord, j’ose le dire sans passion et je me fais entendre", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 35", h2: "", p: "J’ai le souci de ne pas importuner les autres", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 36", h2: "", p: "J’ai du mal à prendre parti et à choisir", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 37", h2: "", p: "Je n’aime pas être la seule personne de mon avis dans un groupe : dans ce cas, je préfère me taire", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 38", h2: "", p: "Je n’ai pas peur de parler en public", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 39", h2: "", p: "La vie n’est que rapports de forces et lutte", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 40", h2: "", p: "Je n’ai pas peur de relever des défis dangereux et risqués", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 41", h2: "", p: "Créer des conflits peut être plus efficace que réduire les tensions", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 42", h2: "", p: "Jouer la franchise est un bon moyen pour mettre en confiance", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 43", h2: "", p: "Je sais écouter et je ne coupe pas la parole", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 44", h2: "", p: "Je mène jusqu’au bout ce que j’ai décidé de faire", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 45", h2: "", p: "Je n’ai pas peur d’exprimer mes sentiments tels que je les ressens", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 46", h2: "", p: "Je sais bien faire adhérer les gens et les amener à mes idées", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 47", h2: "", p: "Flatter tout un chacun reste encore un bon moyen d’obtenir ce que l’on veut", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 48", h2: "", p: "J’ai du mal à maîtriser mon temps de parole", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 49", h2: "", p: "Je sais manier l’ironie mordante", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 50", h2: "", p: "Je suis serviable et facile à vivre ; parfois même je me fais un peu exploiter", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 51", h2: "", p: "J’aime mieux observer que participer", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 52", h2: "", p: "Je préfère être dans les coulisses qu’au premier rang", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 53", h2: "", p: "Je ne pense pas que la manipulation soit une solution efficace", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 54", h2: "", p: "Il ne faut pas annoncer trop vite ses intentions, c’est maladroit", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 55", h2: "", p: "Je choque souvent les gens par mes propos", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 56", h2: "", p: "Je préfère être loup qu’agneau", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 57", h2: "", p: "Manipuler les autres est souvent le seul moyen pratique pour obtenir ce que l’on veut", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 58", h2: "", p: "Je sais en général protester avec efficacité, sans agressivité excessive", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 59", h2: "", p: "Je trouve que les problèmes ne peuvent être vraiment résolus sans en chercher les causes profondes", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {h1: "QUESTION 60", h2: "", p: "Je n’aime pas me faire mal voir", h3: "", button1: "PLUTÔT FAUX", button2: "PLUTÔT VRAI", h41: ""},
    {} 
];

h1.textContent = informations[i].h1;
h2.textContent = informations[i].h2;
p.textContent = informations[i].p;
h3.textContent = informations[i].h3;
button1.textContent = informations[i].button1;
button2.textContent = informations[i].button2;
h41.textContent = informations[i].h41;


////////////////////////////////////////////////////////
////////////////////////SLIDER//////////////////////////
////////////////////////////////////////////////////////

if (i === 0) {
    leftButton.style.display = "none";
}

rightButton.addEventListener("click", function(event) {
    if (i < informations.length - 1) {
    i = i+1;
        h1.textContent = informations[i].h1;
        h2.textContent = informations[i].h2;
        p.textContent = informations[i].p;
        h3.textContent = informations[i].h3;
        button1.textContent = informations[i].button1;
        button2.textContent = informations[i].button2;
        h41.textContent = informations[i].h41

    console.log(i)
    }

    if (i > 0) {
        h42.textContent = "Test repris du livre de Dominique CHALVIN, « Affirmation de Soi »";
    }

    if (i === 1) {
        leftButton.style.display = "inline-block";
    }

    if (i === 2) {
        rightButton.style.display = "none";
    }

    if (i > 1) {
        cardContent.appendChild(button1);
        cardContent.appendChild(button2);
        button1.id = "buttonFalse";
        button2.id = "buttonTrue";
        button1.style.display = "inline-block";
        button2.style.display = "inline-block";
    }
});

leftButton.addEventListener("click", function(event) {
    if (i > 0) {
    i = i-1;
        h1.textContent = informations[i].h1;
        h2.textContent = informations[i].h2;
        p.textContent = informations[i].p;
        h3.textContent = informations[i].h3;
        button1.textContent = informations[i].button1;
        button2.textContent = informations[i].button2;
        h41.textContent = informations[i].h41;
    console.log(i)
    }

    if (i === 0) {
        leftButton.style.display = "none";
    }

    if (i < 2) {
        rightButton.style.display = "inline-block";
    }

    if (i >= 1) {
        button1.style.display = "none";
        button2.style.display = "none";
    }

    if (i >= 2) {
        button1.style.display = "flex";
        button2.style.display = "flex";
    }
});

///////////////////
////BUTTON TRUE////
///////////////////

button2.addEventListener("click", function(event) {
    if (i < informations.length - 1) {
    i = i+1;
        h1.textContent = informations[i].h1;
        h2.textContent = informations[i].h2;
        p.textContent = informations[i].p;
        h3.textContent = informations[i].h3;
        button1.textContent = informations[i].button1;
        button2.textContent = informations[i].button2;
        h41.textContent = informations[i].h41
        if (questionListFuite.includes(i-2) === true) {
            fuite = fuite + 1;
            console.log(fuite + " Fuite");
        } else if (questionListAgressive.includes(i-2) === true) {
            agressive = agressive + 1;
            console.log(agressive + " Agressivité");
        } else if (questionListManipulation.includes(i-2) === true) {
            manipulation = manipulation + 1;
            console.log(manipulation + " Manipulation");
        } else if (questionListAssertive.includes(i-2) === true) {
            assertive = assertive + 1;
            console.log(assertive + " Assertivité");
        } else {
            console.log("Error");
        };
    };
});


//////////////////////
/////BUTTON FALSE/////
//////////////////////

button1.addEventListener("click", function(event) {
    if (i < informations.length - 1) {
    i = i+1;
        h1.textContent = informations[i].h1;
        h2.textContent = informations[i].h2;
        p.textContent = informations[i].p;
        h3.textContent = informations[i].h3;
        button1.textContent = informations[i].button1;
        button2.textContent = informations[i].button2;
        h41.textContent = informations[i].h41
        if (questionListFuite.includes(i-2) === true) {
            fuite = fuite + 0;
            console.log(fuite + " Fuite");
        } else if (questionListAgressive.includes(i-2) === true) {
            agressive = agressive + 0;
            console.log(agressive + " Agressivité");
        } else if (questionListManipulation.includes(i-2) === true) {
            manipulation = manipulation + 0;
            console.log(manipulation + " Manipulation");
        } else if (questionListAssertive.includes(i-2) === true) {
            assertive = assertive + 0;
            console.log(assertive + " Assertivité");
        } else {
            console.log("Error");
        };
    };
});

