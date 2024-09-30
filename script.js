// Seleciona todos os botões pelo atributo name "numero"
let botoes = document.querySelectorAll('button[name="numero"]');

// Seleciona o elemento h1 pelo atributo name "display"
let display = document.querySelector('h1[name="display"]');

// Adiciona evento de clique para o botão de porcentagem (%)
let porcentagem = document.querySelector('button[name="porcentagem"]');

// Seleciona o botão de +/- (inverter sinal)
let inverterSinal = document.querySelector('button[name="inverter"]');

// Identifica se o botão operação foi clicado
let operacao = document.querySelectorAll('button[name="operacao"]');
let operador = "";
let operacaoActive = false;
let resultadoCalculado = false;

// Variáveis para repetição da última operação
let ultimoOperador = "";
let ultimoValor = 0;

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

// Variável de controle para indicar se um número decimal está sendo inserido
let decimalInserido = false;

// Função para limpar o display e resetar o estado
function limpar() {
    display.textContent = "0";
    operacaoActive = false;
    resultadoCalculado = false;
    valorDisplay = "";
    valorSemFormato = "";
    decimalInserido = false; // Reseta o estado do número decimal
    ac.textContent = "AC";
    ultimoOperador = "";
    ultimoValor = 0;
}

// Função cálculo de porcentagem
function calcularPorcentagem(valor) {
    return converter(valor) / 100;
}

porcentagem.addEventListener('click', function() {
    let valorAtual = display.textContent.replace(/\./g, '').replace(',', '.');
    let resultadoPorcentagem = calcularPorcentagem(valorAtual);
    display.textContent = formatarValor(resultadoPorcentagem);
});

// Função para converter valores do display em números
function converter(valor) {
    if (valor.includes('.') || valor.includes(',')) {
        return parseFloat(valor.replace(',', '.'));
    } else {
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
            return valor2 !== 0 ? valor1 / valor2 : "Erro"; // Evita divisão por zero
        case "*":
            return valor1 * valor2;
        default:
            return 0;
    }
}

// Função para formatar o valor no padrão brasileiro
function formatarValor(valor) {
    if (valor.toString().length > 12) {
        return Number.isInteger(valor) ?
            valor.toExponential(6).replace('.', ',').replace('e+', 'E') :
            valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
    } else {
        return Number.isInteger(valor) ?
            valor.toLocaleString('pt-BR') :
            valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

// Adiciona evento de clique para limpar a calculadora
ac.addEventListener('click', function() {
    limpar();
});

// Adiciona um evento de clique para cada botão de número
botoes.forEach(function(botao) {
    botao.addEventListener('click', function() {
        ac.textContent = "C";
        if (resultadoCalculado) {
            display.textContent = "0";
            resultadoCalculado = false;
            decimalInserido = false;
        }

        if ((display.textContent.length === 1 && display.textContent === "0") || operacaoActive) {
            // Reinicia o display para o número novo
            if (botao.textContent === ',') {
                display.textContent = '0' + botao.textContent;
                decimalInserido = true; // Marca que um decimal foi inserido
            } else {
                display.textContent = botao.textContent;
            }
            operacaoActive = false;
        } else if (display.textContent.length <= 11) {
            if (botao.textContent === ",") {
                if (!decimalInserido) {
                    display.textContent += botao.textContent;
                    decimalInserido = true; // Marca que a vírgula foi inserida
                }
            } else {
                display.textContent += botao.textContent; // Adiciona os números ao display
            }
        }
    });
});

// Adiciona evento de clique para operações (+, -, *, /)
operacao.forEach(function(operacao) {
    operacao.addEventListener('click', function() {
        operador = operacao.dataset.operador;
        valorDisplay = display.textContent.replace(/\./g, '').replace(',', '.');
        operacaoActive = true;
        decimalInserido = false; // Reseta o estado do número decimal
    });
});

// Adiciona evento de clique para o botão de igualdade (=)
resultado.addEventListener('click', function() {
    if (!resultadoCalculado) {
        // Calcula o resultado da operação pela primeira vez
        valorSemFormato = calculo(operador, valorDisplay, display.textContent.replace(/\./g, '').replace(',', '.'));
        valorDisplay = valorSemFormato.toString();

        // Armazena o último operador e valor para repetir a operação
        ultimoOperador = operador;
        ultimoValor = display.textContent.replace(/\./g, '').replace(',', '.');
    } else {
        // Reaplica a última operação com o valor anterior
        valorSemFormato = calculo(ultimoOperador, valorDisplay, ultimoValor);
        valorDisplay = valorSemFormato.toString();
    }

    if (valorSemFormato === "Erro" || isNaN(valorSemFormato)) {
        display.textContent = "Erro"; // Mensagem de erro em caso de divisão por zero
    } else {
        display.textContent = formatarValor(valorSemFormato);
    }
    
    operacaoActive = true;
    resultadoCalculado = true;
});

// Adiciona evento de clique para o botão de inverter sinal (+/-)
inverterSinal.addEventListener('click', function() {
    let valorAtual = display.textContent.replace(/\./g, '').replace(',', '.');
    
    if (valorAtual !== "0") {
        let valorInvertido = -converter(valorAtual); // Inverte o valor
        display.textContent = formatarValor(valorInvertido); // Atualiza o display com o valor invertido
    }
});
