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
        pergunta: "Qual organela é conhecida como a 'central de energia' da célula?",
        opcoes: ["Núcleo", "Ribossomo", "Mitocôndria", "Lisossomo"],
        resposta: "Mitocôndria"
    },
    {
        pergunta: "Qual é o processo pelo qual as plantas produzem seu próprio alimento?",
        opcoes: ["Respiração", "Fotossíntese", "Transpiração", "Digestão"],
        resposta: "Fotossíntese"
    },
    {
        pergunta: "Qual é a molécula que carrega a informação genética nos seres vivos?",
        opcoes: ["RNA", "Proteína", "Carboidrato", "DNA"],
        resposta: "DNA"
    },
    {
        pergunta: "O sangue humano é classificado em quantos tipos principais?",
        opcoes: ["2", "4", "6", "8"],
        resposta: "4"
    },
    {
        pergunta: "Qual destes animais é um mamífero?",
        opcoes: ["Pinguim", "Tubarão", "Baleia", "Crocodilo"],
        resposta: "Baleia"
    },
    {
        pergunta: "A camada mais externa da pele humana é chamada de:",
        opcoes: ["Derme", "Hipoderme", "Epiderme", "Endoderme"],
        resposta: "Epiderme"
    },
    {
        pergunta: "Qual gás é essencial para a respiração da maioria dos seres vivos?",
        opcoes: ["Nitrogênio", "Dióxido de Carbono", "Hidrogênio", "Oxigênio"],
        resposta: "Oxigênio"
    },
    {
        pergunta: "Quem é considerado o 'pai da genética'?",
        opcoes: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Isaac Newton"],
        resposta: "Gregor Mendel"
    },
    {
        pergunta: "Qual é o maior osso do corpo humano?",
        opcoes: ["Tíbia", "Úmero", "Fêmur", "Crânio"],
        resposta: "Fêmur"
    },
    {
        pergunta: "O processo de divisão celular que produz gametas é chamado de:",
        opcoes: ["Mitose", "Meiose", "Fissão Binária", "Fragmentação"],
        resposta: "Meiose"
    }
];

let nomeJogador = "";
let indiceQuestaoAtual = 0;
let pontuacao = 0;
let cronometro;
let tempoRestante = 5;
let temposPorQuestao = [];
let tempoInicial;


function mostrarRegras() {
    nomeJogador = inputNomeJogador.value.trim();
    if (nomeJogador === "") {
        inputNomeJogador.style.borderColor = 'red';
        return;
    }
    inputNomeJogador.style.borderColor = '#ccc';
    mensagemBoasVindas.textContent = `Boas-vindas, ${nomeJogador}!`;
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
    tempoRestante = 5;
    cronometroDisplay.textContent = tempoRestante;
    cronometro = setInterval(() => {
        tempoRestante--;
        cronometroDisplay.textContent = tempoRestante;
        if (tempoRestante <= 0) {
            clearInterval(cronometro);
            temposPorQuestao.push(5); 
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
