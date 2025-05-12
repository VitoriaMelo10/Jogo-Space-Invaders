// Seleciona o canvas onde o jogo será desenhado
let canvas = document.getElementById('gameCanvas');
// Obtém o contexto 2D para desenhar no canvas
let ctx = canvas.getContext('2d');


// Guarda a largura e altura do canvas
let larguraCanvas = canvas.width;
let alturaCanvas = canvas.height;

// Variáveis para pontuação e vidas do jogador
let score = 0;
let lives = 3;

// Objeto que representa a nave do jogador
let imagemJogador = new Image();
imagemJogador.src = 'img/nave.png'; // imagem da nave

imagemJogador.onload = () => {
  console.log('Imagem da nave carregada');
  desenharJogador();
}
let jogador = {
  imagem: imagemJogador, // imagem da nave
  largura: 200,          // largura da nave
  altura: 130,           // altura da nave
  x: larguraCanvas / 2.5 - 11,   // posição horizontal inicial (centro do canvas)
  y: alturaCanvas - 130,         // posição vertical fixa na parte inferior
  velocidade: 5,        // velocidade de movimento da nave
  movendoEsquerda: false,  // flag se o jogador está movendo para esquerda
  movendoDireita: false,   // flag se o jogador está movendo para direita
  tiroAtivo: false,        // flag se o tiro está ativo na tela
  tiroX: 0,                // posição horizontal do tiro
  tiroY: 0,                // posição vertical do tiro
  tiroVelocidade: 15       // velocidade do tiro para cima
}

//objeto que representa o inimigo
let imagemInvasor = new Image();
imagemInvasor.src = 'img/ovn.png';

//objeto que representa o tiro
let imagemTiro = new Image();
imagemTiro.src = 'img/missel.png';


// Imagem de fundo
let imagemFundo = new Image();
imagemFundo.src = 'img/fundo.jpg'; // imagem de fundo do jogo

// Define os invasores (inimigos)
let invasores = [];
let invasorLargura = 40;   // largura de cada invasor
let invasorAltura = 30;    // altura de cada invasor
let invasorLinhas = 3;     // número de linhas de invasores
let invasorColunas = 10;    // número de colunas de invasores
let invasoresVelocidadeX = 3;    // velocidade horizontal inicial dos invasores
let invasoresVelocidadeY = 15;   // distância que descem ao mudar direção
let confettiInstance = confetti;

//vsriavel para som
let tiroSom = document.getElementById('tiroSom');
let explosaoSom = document.getElementById('explosaoSom');
let gameoverSom = document.getElementById('gameoverSom');
let fundoSom = document.getElementById('fundoSom');
let levelup1Som = document.getElementById('levelup1Som');


explosaoSom.onload = () => {
  console.log("Som de explosão carregado");
};


// Criar os invasores e posicioná-los inicialemnte
for(let linha = 0; linha < invasorLinhas; linha++) {
  for(let col = 0; col < invasorColunas; col++) {
    invasores.push({
      x: col * (invasorLargura + 10) + 30,   // espaço horizontal + margem
      y: linha * (invasorAltura + 10) + 30,  // espaço vertical + margem
      largura: invasorLargura,
      altura: invasorAltura,
      vivo: true   // flag para saber se o invasor está vivo
    });
  }
}

// Atualiza os textos de pontuação e vidas na página
function atualizarInfos() {
  document.getElementById('score').textContent = score;
  document.getElementById('lives').textContent = lives;
}

function desenhar() {
  // Desenha a imagem de fundo antes de tudo
  ctx.clearRect(0, 0, larguraCanvas, alturaCanvas); // limpa o canvas
  ctx.drawImage(imagemFundo, 0, 0, larguraCanvas, alturaCanvas);

  desenharJogador();
  desenharInvasores();
  desenharTiro();
}
  
// Função para tocar o som de fundo
function tocarSomTiro() {
  tiroSom.play();
}

// Tocar som de explosão
function tocarSomExplosao() {
    explosaoSom.play();
    };
  


// Tocar som de game over
function tocarSomGameOver() {
  gameoverSom.play();
}
// Tocar som de level up
function tocarSomLevelUp1() {
  levelup1Som.play();
}
function tocarSomLevelUp2() {
  levelup2Som.play();
}
// Tocar som de fundo
function tocarSomFundo() {
  fundoSom.volume = 0.1; // Ajuste o volume conforme necessário
  fundoSom.play();
}
// parar som de fundo
function pararSomFundo() {
  fundoSom.pause();
  fundoSom.currentTime = 0; // Reinicia o som
}     


// Desenha a nave do jogador no canvas
function desenharJogador(){
  ctx.drawImage(imagemJogador, jogador.x, jogador.y, jogador.largura, jogador.altura);
}

// Desenha todos os invasores vivos no canvas
function desenharInvasores() {
  invasores.forEach(invasor => {
    if(invasor.vivo) {
      ctx.drawImage(imagemInvasor, invasor.x, invasor.y, invasor.largura, invasor.altura);
    }
  });
}


// Desenha o tiro se ele estiver ativo
function desenharTiro() {
  if (jogador.tiroAtivo) {
    ctx.drawImage(imagemTiro, jogador.tiroX, jogador.tiroY, 40, 40); // ajuste o tamanho conforme sua imagem
    tiroSom.currentTime = 0;
    tiroSom.play();
  }
}


// Move o jogador para esquerda ou direita conforme as flags
function moverJogador() {
  if(jogador.movendoEsquerda && jogador.x > 0) {
    jogador.x -= jogador.velocidade;  // move para esquerda sem sair da tela
  }
  if(jogador.movendoDireita && jogador.x + jogador.largura < larguraCanvas) {
    jogador.x += jogador.velocidade;  // move para direita sem sair da tela
  }
}

// Move os invasores e verifica se precisam descer e inverter direção
function moverInvasores() {
  let moverParaBaixo = false;

  // Pega a posição mais à direita e mais à esquerda dos invasores vivos
  let direitaMaior = Math.max(...invasores.filter(i => i.vivo).map(i => i.x + i.largura));
  let esquerdaMenor = Math.min(...invasores.filter(i => i.vivo).map(i => i.x));

  // Se um invasor encostar na borda do canvas, inverte a direção e desce
  if(direitaMaior + invasoresVelocidadeX > larguraCanvas) {
    invasoresVelocidadeX = -invasoresVelocidadeX;
    moverParaBaixo = true;
  } else if(esquerdaMenor + invasoresVelocidadeX < 0) {
    invasoresVelocidadeX = -invasoresVelocidadeX;
    moverParaBaixo = true;
  }

  // Atualiza a posição de cada invasor
  invasores.forEach(invasor => {
    if(invasor.vivo) {
      invasor.x += invasoresVelocidadeX;
      if(moverParaBaixo) {
        invasor.y += invasoresVelocidadeY;
        // Se invasor chegar à altura do jogador, o jogador perde vida
        if(invasor.y + invasor.altura >= jogador.y) {
          perderVida();
        }
      }
    }
  });
}

// Atualiza a posição do tiro e verifica colisões
function atualizarTiro() {
  if(jogador.tiroAtivo) {
    jogador.tiroY -= jogador.tiroVelocidade; // atira para cima

    // Verifica se o tiro acertou algum invasor
    invasores.forEach(invasor => {
      if(invasor.vivo && colisao(jogador.tiroX, jogador.tiroY, 4, 10, invasor.x, invasor.y, invasor.largura, invasor.altura)) {
        invasor.vivo = false;     // invasor destruído
        jogador.tiroAtivo = false; // tiro some
        score += 10;              // aumenta pontuação
        atualizarInfos();         // atualiza página com nova pontuação
        console.log('Explosão!');  // Verifique no console se isso aparece

        // Verifica se o áudio está carregado e toca
        explosaoSom.volume = 0.3;  // Ajuste de volume, se necessário
        explosaoSom.currentTime = 0;
        explosaoSom.play();        // Toca o som de explosão
      
      }
    });

    // Se o tiro sair do topo da tela, desativa
    if(jogador.tiroY < 0) {
      jogador.tiroAtivo = false;
    }
  }
}

// Função para detectar colisão entre dois retângulos (tiro e invasor)
function colisao(x1, y1, w1, h1, x2, y2, w2, h2) {
  // Retorna true se há sobreposição nas posições e tamanhos
  return !(x1 > x2 + w2 || x1 + w1 < x2 || y1 > y2 + h2 || y1 + h1 < y2);
}

// Função chamada quando o jogador perde uma vida
function perderVida() {
  lives--;
  atualizarInfos();

  if (lives <= 0) {
    pararSomFundo();  // Para o som de fundo
    tocarSomGameOver(); //  toca som de game over

    // Exibe a pontuação final
    document.getElementById('finalScore').textContent = score;

    // Exibe o overlay de fim de jogo
    document.getElementById('gameOverOverlay').style.display = 'flex';

    // Para o loop do jogo
    cancelAnimationFrame(animacao);
  } else {
    // Reinicia os invasores
    invasores.forEach(invasor => {
      invasor.y = (Math.floor(invasores.indexOf(invasor) / invasorColunas)) * (invasorAltura + 10) + 30;
      invasor.vivo = true;
    });

    // Volta a nave para o centro
    jogador.x = larguraCanvas / 2 - jogador.largura / 2;
    jogador.tiroAtivo = false;
  }
}

// Verifica se o jogador destruiu todos os invasores
function checarFimJogo() {
  if (invasores.every(i => !i.vivo)) {
    // Exibe pontuação final
    document.getElementById('victoryScore').textContent = score;
    pararSomFundo();
    levelup1Som.currentTime = 0; 
    levelup1Som.play();
    // Mostra a tela de vitória
    document.getElementById('victoryOverlay').style.display = 'flex';


    // Exibe o canvas de confete e inicia a animação

    iniciarConfete();                        // dispara os confetes

    // Para o jogo
    cancelAnimationFrame(animacao);
  }
}

// Função para iniciar a animação de confete
function iniciarConfete() {
  let duration = 3 * 1000;
  let end = Date.now() + duration;

  (function frame() {
    confettiInstance({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confettiInstance({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}


// Atualiza tudo que precisa se mover ou mudar no jogo
function atualizar() {
  moverJogador();
  moverInvasores();
  atualizarTiro();
  checarFimJogo();
}



// Eventos do teclado para controlar o jogdor e tiro
document.addEventListener('keydown', e => {
  if(e.key === 'ArrowLeft') {
    jogador.movendoEsquerda = true;
  } else if(e.key === 'ArrowRight') {
    jogador.movendoDireita = true;
  } else if(e.key === ' ' || e.key === 'Spacebar') {
    if(!jogador.tiroAtivo) {  // só pode um tiro ativo por vez
      jogador.tiroAtivo = true;
      jogador.tiroX = jogador.x + jogador.largura / 2 - 2; // posiciona o tiro no centro da nave
      jogador.tiroY = jogador.y;
    }
  }
});

// Quando a tecla é solta, para de mover o jogador
document.addEventListener('keyup', e => {
  if(e.key === 'ArrowLeft') {
    jogador.movendoEsquerda = false;
  } else if(e.key === 'ArrowRight') {
    jogador.movendoDireita = false;
  }
});

// Começa o jogo mostrando as informações e iniciando o loop de animação
atualizarInfos();
loop();


// Reinicia o jogo quando o botão "Reiniciar" é clicado
 function reiniciarJogo() {
  // Redefine as variáveis do jogo para os valores iniciais
  score = 0;
  lives = 3;  // Garantir que as vidas comecem com 3
  invasores.forEach(invasor => {
    invasor.vivo = true; 
    invasor.y = (Math.floor(invasores.indexOf(invasor) / invasorColunas)) * (invasorAltura + 10) + 30; // reposiciona os invasores
  });
  jogador.x = larguraCanvas / 2 - jogador.largura / 2; // reposiciona a nave
  jogador.y = alturaCanvas - jogador.altura;
  jogador.tiroAtivo = false; // desativa o tiro

  // Esconde o overlay de Game Over
  document.getElementById('gameOverOverlay').style.display = 'none';
  document.getElementById('victoryOverlay').style.display = 'none';
  confettiCanvas.style.display = 'none'; // esconde o canvas de confetes
// Reinicia o som de fundo e o loop do jogo
pararSomFundo(); // Garantir que o som de fundo seja parado
tocarSomFundo();  // Recomeça o som de fundo
  // Reinicia a animação do jogo
  loop();
}

// Adiciona o evento de clique ao botão de reiniciar
let animacao;

function loop() {
  if (lives > 0) {
     // Toca o som de fundo enquanto o jogo estiver acontecendo
     if (fundoSom.paused) {
      tocarSomFundo(); // Começa o som de fundo
    }
    atualizar();
    desenhar();
    animacao = requestAnimationFrame(loop);  // continua o loop se ainda tiver vidas
  } else {
    // Se o jogador perder todas as vidas, pare o som de fundo
    pararSomFundo();
  }
}
confettiCanvas.style.display = 'block';
confettiCanvas.style.display = 'none';
