// JavaScript para o site Viva Sorte

document.addEventListener('DOMContentLoaded', function() {
    // Função para mostrar spinner e redirecionar para o carrinho após delay
    function redirectToCart() {
        // Pega a quantidade selecionada (do seletor principal, se disponível)
        let quantidade = 20;
        const quantidadeInput = document.querySelector('.cota-selector .quantidade-input');
        if (quantidadeInput) {
            quantidade = parseInt(quantidadeInput.value) || 20;
        }
        
        // Verifica se a quantidade está dentro dos limites
        if (quantidade < 20 || quantidade > 100) {
            // Exibe alerta popup
            alert(mensagemAlerta);
            
            // Ajusta para os limites
            if (quantidade < 20) {
                quantidadeInput.value = 20;
                quantidade = 20;
            } else if (quantidade > 100) {
                quantidadeInput.value = 100;
                quantidade = 100;
            }
            return; // Impede o redirecionamento
        }
        
        // Calcula o preço baseado na quantidade (0.99 por cota)
        const precoUnitario = 0.99;
        const precoTotal = quantidade * precoUnitario;
        
        // Mostra o spinner de carregamento
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('active');
        
        // Redireciona com os parâmetros após 4 segundos
        setTimeout(function() {
            // Captura os parâmetros UTM da URL atual
            const urlParams = new URLSearchParams(window.location.search);
            const utmString = urlParams.toString();

            // Monta a nova URL do carrinho
            let redirectUrl = `carrinho.html?quantidade=${quantidade}&preco=${precoTotal.toFixed(2)}`;

            // Anexa os parâmetros UTM se eles existirem
            if (utmString) {
                redirectUrl += `&${utmString}`;
            }

            window.location.href = redirectUrl;
        }, 4000); // 4 segundos
    }
    
    // Adiciona evento de clique para os botões de compra
    const buyButtons = document.querySelectorAll('.buy-button, .comprar-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', redirectToCart);
    });
    
    // Adiciona evento de clique para os botões de adicionar
    const addButtons = document.querySelectorAll('.add-to-cart-button, .add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Usa diretamente a função de redirecionamento que já mostra o spinner
            redirectToCart();
        });
    });

    // Funcionalidade para o seletor de cotas principal
    const decrementoBtn = document.querySelector('.cota-selector .decremento');
    const incrementoBtn = document.querySelector('.cota-selector .incremento');
    const quantidadeInput = document.querySelector('.cota-selector .quantidade-input');
    const cotaPrecoElement = document.querySelector('.cota-selector .cota-preco');
    const precoUnitario = 0.99; // Preço por cota
    
    // Mensagem para os alertas
    const mensagemAlerta = 'Atenção: A quantidade mínima de cotas é 20 e a máxima é 100 por compra.';
    
    // Função para validar a quantidade de cotas
    function validarQuantidade(quantidade) {
        if (quantidade < 20) {
            return 20;
        }
        if (quantidade > 100) {
            return 100;
        }
        return quantidade;
    }

    if (decrementoBtn && incrementoBtn && quantidadeInput) {
        // Atualiza o texto do preço baseado na quantidade inicial
        atualizarTextoPreco();
        
        // Define o valor inicial do input para 20
        quantidadeInput.value = '20';
        
        decrementoBtn.addEventListener('click', function() {
            let quantidade = parseInt(quantidadeInput.value) || 20;
            if (quantidade > 20) {
                quantidade--;
                quantidadeInput.value = quantidade;
                atualizarTextoPreco();
            } else {
                // Exibe alerta popup
                alert(mensagemAlerta);
            }
        });
        
        incrementoBtn.addEventListener('click', function() {
            let quantidade = parseInt(quantidadeInput.value) || 20;
            if (quantidade < 100) {
                quantidade++;
                quantidadeInput.value = quantidade;
                atualizarTextoPreco();
            } else {
                // Exibe alerta popup
                alert(mensagemAlerta);
            }
        });
        
        // Adiciona listener para entrada manual
        quantidadeInput.addEventListener('input', function() {
            // Remove qualquer caractere que não seja número
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Garante que sempre haja pelo menos 20 cotas
            if (this.value === '' || parseInt(this.value) < 20) {
                this.value = 20;
                // Exibir alerta popup
                alert(mensagemAlerta);
            }
            
            // Limita a um máximo de 100 cotas
            if (parseInt(this.value) > 100) {
                this.value = 100;
                // Exibir alerta popup
                alert(mensagemAlerta);
            }
            
            atualizarTextoPreco();
        });
        
        // Adiciona listener para quando o campo perder o foco
        quantidadeInput.addEventListener('blur', function() {
            // Se o campo estiver vazio, define como 20
            if (this.value === '') {
                this.value = 20;
                atualizarTextoPreco();
            }
            
            // Garante que o valor seja pelo menos 20
            if (parseInt(this.value) < 20) {
                this.value = 20;
                // Exibir alerta popup
                alert(mensagemAlerta);
                atualizarTextoPreco();
            }
        });
        
        // Função para atualizar o texto do preço
        function atualizarTextoPreco() {
            const quantidade = parseInt(quantidadeInput.value) || 1;
            if (quantidade === 1) {
                cotaPrecoElement.textContent = `Por apenas R$ ${precoUnitario.toFixed(2).replace('.', ',')}`;
            } else {
                const precoTotal = (quantidade * precoUnitario).toFixed(2).replace('.', ',');
                cotaPrecoElement.textContent = `${quantidade} cotas por R$ ${precoTotal}`;
            }
        }
    }
    
    // Funcionalidade para cards hora do viva
    const incrementBtns = document.querySelectorAll('.increment-btn');
    const decrementBtns = document.querySelectorAll('.decrement-btn');
    const quantityInputs = document.querySelectorAll('.quantity');
    
    // Adiciona eventos para incrementar quantidade
    incrementBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Encontra o elemento pai (card) e atualiza a quantidade
            const card = this.closest('.hora-card, .viva-sorte-card');
            const quantityElement = card.querySelector('.quantity');
            let quantity = parseInt(quantityElement.value) || 1;
            
            // Verifica se não ultrapassou o limite
            if (quantity < 100) {
                quantity++;
            } else {
                // Mensagem não intrusiva - substituindo alerta por limite silencioso
                return;
            }
            
            quantityElement.value = quantity.toString().padStart(2, '0');
            
            // Atualiza o preço se houver um elemento de preço
            atualizarPrecoCard(card);
        });
    });
    
    // Adiciona eventos para decrementar quantidade
    decrementBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Encontra o elemento pai (card) e atualiza a quantidade
            const card = this.closest('.hora-card, .viva-sorte-card');
            const quantityElement = card.querySelector('.quantity');
            let quantity = parseInt(quantityElement.value) || 1;
            
            if (quantity > 1) {
                quantity--;
                quantityElement.value = quantity.toString().padStart(2, '0');
                
                // Atualiza o preço
                atualizarPrecoCard(card);
            }
        });
    });
    
    // Adiciona eventos para entrada manual de quantidades
    quantityInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove qualquer caractere que não seja número
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Garante que sempre haja pelo menos 1 cota
            if (this.value === '' || parseInt(this.value) < 1) {
                this.value = '01';
            }
            
            // Limita a um máximo de 100 cotas
            if (parseInt(this.value) > 100) {
                this.value = '100';
                // Mensagem não intrusiva - substituindo alerta por limite silencioso
            }
            
            // Formata com zero à esquerda quando necessário
            const quantity = parseInt(this.value);
            if (!isNaN(quantity)) {
                this.value = quantity.toString().padStart(2, '0');
            }
            
            // Atualiza o preço
            const card = this.closest('.hora-card, .viva-sorte-card');
            atualizarPrecoCard(card);
        });
        
        // Quando o campo perder o foco
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.value = '01';
                
                // Atualiza o preço
                const card = this.closest('.hora-card, .viva-sorte-card');
                atualizarPrecoCard(card);
            }
        });
    });
    
    // Função para atualizar o preço do card
    function atualizarPrecoCard(card) {
        const quantityElement = card.querySelector('.quantity');
        const priceElement = card.querySelector('.price-total');
        
        if (priceElement && quantityElement) {
            const quantity = parseInt(quantityElement.value) || 1;
            // Usar o valor do atributo data-price do card
            const unitPrice = parseFloat(card.getAttribute('data-price')) || 0.49;
            const totalPrice = (quantity * unitPrice).toFixed(2).replace('.', ',');
            priceElement.textContent = `R$ ${totalPrice}`;
        }
    }
    
    // Funcionalidade para o carrossel de ganhadores
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const ganhadoresGrid = document.querySelector('.ganhadores-grid');
    
    if (prevButton && nextButton && ganhadoresGrid) {
        let position = 0;
        const cardWidth = 100; // Largura aproximada de cada card
        const visibleCards = 5; // Número de cards visíveis por vez
        
        prevButton.addEventListener('click', function() {
            if (position < 0) {
                position += cardWidth;
                ganhadoresGrid.style.transform = `translateX(${position}px)`;
            }
        });
        
        nextButton.addEventListener('click', function() {
            const maxPosition = -(cardWidth * (ganhadoresGrid.children.length - visibleCards));
            if (position > maxPosition) {
                position -= cardWidth;
                ganhadoresGrid.style.transform = `translateX(${position}px)`;
            }
        });
    }
    
    // Funcionalidade para os botões de adicionar ao carrinho
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    // Removendo eventos anteriores e usando redirectToCart em todos os botões
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToCart();
        });
    });
});
