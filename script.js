// Seleciona todos os botões pelo atributo name "numero"
let botoes = document.querySelectorAll('button[name="numero"]');

// Seleciona o elemento h1 pelo atributo name "display"
let display = document.querySelector('h1[name="display"]');

// Identifica se o botão operação foi clicado
let operacao = document.querySelectorAll('button[name="operacao"]');
let operador = "";
let operacaoActive = false;

// Seleciona o botão de limpar
let ac = document.querySelector('button[name="ac"]');

// Seleciona o botão de igualdade
let resultado = document.querySelector('button[name="resultado"]');

// Armazenar valores que estão no display
let valorDisplay = "";

// Variáveis para cálculos e formatação
let numeroConvertido;
let valorSemFormato;
let valorFormatado;

// Função para limpar o display e resetar o estado
function limpar() {
    // Limpa o display ou a memória inteira
    if(ac.textContent === 'C') {
        display.textContent = "0";
        valorSemFormato = "";
        ac.textContent = "AC";
    } else {
        display.textContent = "0";
        operacaoActive = false;
        valorDisplay = "";
        valorSemFormato = "";
    }
    
}

// Função para converter valores do display em números (inteiros ou floats)
function converter(valor) {
    if (valor.includes('.') || valor.includes(',')) {
        // Se houver vírgula ou ponto, converte para float
        return parseFloat(valor.replace(',', '.')); // Substitui vírgula por ponto
    } else {
        // Se não houver vírgula ou ponto, converte para inteiro
        return parseInt(valor, 10);
    }
}

// Função para realizar cálculos com base na operação
function calculo(operador, valor1, valor2) {
    valor1 = converter(valor1);
    valor2 = converter(valor2);

    if (isNaN(valor1) || isNaN(valor2)) {
        return 0; // Evita NaN nos cálculos
    }

    switch (operador) {
        case "+":
            return valor1 + valor2;
        case "-":
            return valor1 - valor2;
        case "/":
            return valor2 !== 0 ? valor1 / valor2 : 0; // Evita divisão por zero
        case "*":
            return valor1 * valor2;
        default:
            return 0;
    }
}

// Função para formatar o valor no padrão brasileiro
function formatarValor(valor) {
    return Number.isInteger(valor) ?
        valor.toLocaleString('pt-BR') :
        valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Adiciona evento de clique para limpar a calculadora
ac.addEventListener('click', function() {
    limpar();
});

// Adiciona um evento de clique para cada botão de número
botoes.forEach(function(botao) {
    botao.addEventListener('click', function() {
        ac.textContent = "C";
        if ((display.textContent.length === 1 && display.textContent === "0") || operacaoActive) {
            if(botao.textContent === ','){
                display.textContent = '0' + botao.textContent;
            } else{
                display.textContent = botao.textContent;
            }
            
            operacaoActive = false;
        } else {
            if (botao.textContent === ",") {
                // Evita adicionar mais de uma vírgula
                if (!display.textContent.includes(",")) {
                    display.textContent += botao.textContent;
                }
            } else {
                // Remove separadores de milhares e adiciona novo dígito
                valorSemFormato = display.textContent.replace(/\./g, '').replace(',', '.');
                valorSemFormato += botao.textContent;

                // Atualiza o display com o valor formatado
                valorFormatado = parseFloat(valorSemFormato).toLocaleString('pt-BR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 20
                });
                display.textContent = valorFormatado;
            }
        }
    });
});

// Adiciona evento de clique para operações (+, -, *, /)
operacao.forEach(function(operacao) {
    operacao.addEventListener('click', function() {
        operador = operacao.dataset.operador;
        valorDisplay = display.textContent.replace(/\./g, '').replace(',', '.'); // Remove a formatação para uso numérico
        operacaoActive = true; // Habilita o estado de operação ativa
    });
});

// Adiciona evento de clique para o botão de igualdade (=)
resultado.addEventListener('click', function() {

    // Calcula o resultado com o valor do display
    valorSemFormato = calculo(operador, valorDisplay, display.textContent.replace(/\./g, '').replace(',', '.'));
        
    // Atualiza o valor do display para operações futuras
    valorDisplay = valorSemFormato.toString(); // Salva o resultado sem formatação

   // Mostra o valor no display formatado, evita mostrar NaN
   if (isNaN(valorSemFormato) || valorSemFormato === null || valorSemFormato === undefined) {
        display.textContent = "0"; // Valor padrão se houver erro
    } else {
        display.textContent = formatarValor(valorSemFormato);
    }

    operacaoActive = true; // Permite continuar operando com o resultado
    
});
