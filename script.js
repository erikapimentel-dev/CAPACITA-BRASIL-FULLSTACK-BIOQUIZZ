const telaInicial = document.getElementById('tela-inicial');
const telaRegras = document.getElementById('tela-regras');
const telaQuiz = document.getElementById('tela-quiz');
const telaResultados = document.getElementById('tela-resultados');

const inputNomeJogador = document.getElementById('input-nome');
const botaoComecar = document.getElementById('botao-comecar');
const botaoIniciarQuiz = document.getElementById('botao-iniciar-quiz');
const botaoJogarNovamente = document.getElementById('botao-jogar-novamente');

const mensagemBoasVindas = document.getElementById('mensagem-boas-vindas');
const numeroQuestao = document.getElementById('numero-questao');
const cronometroDisplay = document.getElementById('cronometro');
const textoQuestao = document.getElementById('texto-questao');
const containerOpcoes = document.getElementById('container-opcoes');
const nomeResultado = document.getElementById('nome-resultado');
const pontuacaoFinal = document.getElementById('pontuacao-final');
const tempoMedio = document.getElementById('tempo-medio');

const perguntas = [
    {
        pergunta: "Dos constituintes celulares abaixo relacionados, marque qual está presente somente nos eucariontes.",
        opcoes: ["Envoltório nuclear", "RNA", "DNA", "Membrana celular"],
        resposta: "Envoltório nuclear"
    },
    {
        pergunta: "Em qual local da célula podemos encontrar o DNA?",
        opcoes: ["Complexo golgiense", "Citoplasma", "Mitocôndria", "Núcleo"],
        resposta: "Núcleo"
    },
    {
        pergunta: "Qual é a molécula que carrega a informação genética nos seres vivos?",
        opcoes: ["RNA", "Proteína", "Carboidrato", "DNA"],
        resposta: "DNA"
    },
    {
        pergunta: "O que é RNA?",
        opcoes: ["Um ácido desoxiribonucleico", "Um ácido nucleico", "Uma comida", "Um time de futebol"],
        resposta: "Um ácido nucleico"
    },
    {
        pergunta: "Marque a que alternativa que apressenta a única base nitrogenada AUSENTE no DNA. ",
        opcoes: ["Timina", "Uracila", "Adenina", "Citosina"],
        resposta: "Uracila"
    },
    {
        pergunta: "Uma fita de DNA apresenta a seguinte sequência: \n TCAAGT \n Marque a alternativa que indica corretamente a sequência encontrada na fita complementar: ",
        opcoes: ["ATAAUA", "AGTTCG"],
        resposta: "AGTTCG"
    },
    {
        pergunta: "Quantos cromossomos temos?",
        opcoes: ["46", " 36", "56", "47"],
        resposta: "46"
    },
    {
        pergunta: "Na mitose uma célula:",
        opcoes: ["Haploide origina duas células haploides;", "Haploide origina quatro células haploides;", "Diploide origina duas células diploides;", "Diploide origina quatro células diploides."],
        resposta: "Diploide origina duas células diploides;"
    },
    {
        pergunta: "O processo de divisão celular que produz gametas é chamado de:",
        opcoes: ["Mitose", "Meiose", "Fissão Binária", "Fragmentação"],
        resposta: "Meiose"
    },
    {
        pergunta: "O Dogma Central da Biologia Molecular explica como o fluxo de informações do código genético ocorre. De acordo com esse dogma, o fluxo da informação genética ocorre no sentido:",
        opcoes: ["RNA → DNA → Proteína", "Proteína → DNA → RNA", "DNA → RNA → Proteína"],
        resposta: "DNA → RNA → Proteína"
    }
];

let nomeJogador = "";
let indiceQuestaoAtual = 0;
let pontuacao = 0;
let cronometro;
let tempoRestante = 20;
let temposPorQuestao = [];
let tempoInicial;


function mostrarRegras() {
    nomeJogador = inputNomeJogador.value.trim();
    if (nomeJogador === "") {
        inputNomeJogador.style.borderColor = 'red';
        return;
    }
    inputNomeJogador.style.borderColor = '#ccc';
    mensagemBoasVindas.textContent = `Seja muito bem-vindo(a), ${nomeJogador} ao quiz da tia Erika!`;
    telaInicial.classList.add('escondido');
    telaRegras.classList.remove('escondido');
}

function iniciarQuiz() {
    telaRegras.classList.add('escondido');
    telaQuiz.classList.remove('escondido');
    indiceQuestaoAtual = 0;
    pontuacao = 0;
    temposPorQuestao = [];
    mostrarQuestao();
}

function mostrarQuestao() {
    resetarEstado();
    if (indiceQuestaoAtual >= perguntas.length) {
        mostrarResultados();
        return;
    }

    let questaoAtual = perguntas[indiceQuestaoAtual];
    numeroQuestao.textContent = indiceQuestaoAtual + 1;
    textoQuestao.textContent = questaoAtual.pergunta;

    questaoAtual.opcoes.forEach(opcao => {
        const botao = document.createElement('button');
        botao.textContent = opcao;
        botao.classList.add('botao-opcao');
        botao.addEventListener('click', () => selecionarResposta(botao, questaoAtual.resposta));
        containerOpcoes.appendChild(botao);
    });

    iniciarCronometro();
    tempoInicial = Date.now();
}

function resetarEstado() {
    clearTimeout(cronometro);
    while (containerOpcoes.firstChild) {
        containerOpcoes.removeChild(containerOpcoes.firstChild);
    }
}

function iniciarCronometro() {
    tempoRestante = 20;
    cronometroDisplay.textContent = tempoRestante;
    cronometro = setInterval(() => {
        tempoRestante--;
        cronometroDisplay.textContent = tempoRestante;
        if (tempoRestante <= 0) {
            clearInterval(cronometro);
            temposPorQuestao.push(20);
            proximaQuestao();
        }
    }, 1000);
}

function selecionarResposta(botaoSelecionado, respostaCorreta) {
    clearInterval(cronometro);
    const tempoGasto = (Date.now() - tempoInicial) / 1000;
    temposPorQuestao.push(tempoGasto);

    const todasOpcoes = Array.from(containerOpcoes.children);
    
    todasOpcoes.forEach(botao => {
        botao.disabled = true; 
        if (botao.textContent === respostaCorreta) {
            botao.classList.add('correto');
        }
    });

    if (botaoSelecionado.textContent === respostaCorreta) {
        pontuacao++;
    } else {
        botaoSelecionado.classList.add('incorreto');
    }

    setTimeout(proximaQuestao, 1000); 
}

function proximaQuestao() {
    indiceQuestaoAtual++;
    mostrarQuestao();
}

function mostrarResultados() {
    telaQuiz.classList.add('escondido');
    telaResultados.classList.remove('escondido');

    nomeResultado.textContent = `Parabéns, ${nomeJogador}!`;
    pontuacaoFinal.textContent = `${pontuacao} de ${perguntas.length}`;

    const tempoTotal = temposPorQuestao.reduce((acc, tempo) => acc + tempo, 0);
    const mediaTempo = (tempoTotal / temposPorQuestao.length).toFixed(2);
    tempoMedio.textContent = mediaTempo;
}

function jogarNovamente() {
    telaResultados.classList.add('escondido');
    telaInicial.classList.remove('escondido');
    inputNomeJogador.value = "";
}

botaoComecar.addEventListener('click', mostrarRegras);
botaoIniciarQuiz.addEventListener('click', iniciarQuiz);
botaoJogarNovamente.addEventListener('click', jogarNovamente);
