document.addEventListener('DOMContentLoaded', () => {
    const precoCota = 0.99;
    const minCotas = 20;
    const maxCotas = 150;
    const mensagemAlerta = `O número de cotas deve ser entre ${minCotas} e ${maxCotas}.`;

    const qtyInput = document.querySelector('.qty-input');
    const totalValueElement = document.querySelector('.valor-total');
    const decrementBtn = document.querySelector('.decrement-btn');
    const incrementBtn = document.querySelector('.increment-btn');
    const finalizarCompraBtn = document.getElementById('finalizar-compra');

    // Função para atualizar o valor total com base na quantidade
    function atualizarTotal() {
        let quantidade = parseInt(qtyInput.value, 10);
        if (isNaN(quantidade) || quantidade < minCotas) {
            quantidade = minCotas;
        }
        const total = quantidade * precoCota;
        if (totalValueElement) {
            totalValueElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
    }

    // Função para validar a quantidade
    function validarQuantidade() {
        let quantidade = parseInt(qtyInput.value, 10);
        if (isNaN(quantidade) || quantidade < minCotas) {
            qtyInput.value = minCotas;
            alert(mensagemAlerta);
        } else if (quantidade > maxCotas) {
            qtyInput.value = maxCotas;
            alert(mensagemAlerta);
        }
        atualizarTotal();
    }

    // Inicializa o carrinho com os dados da URL
    const urlParams = new URLSearchParams(window.location.search);
    const quantidadeInicial = parseInt(urlParams.get('quantidade'), 10);

    if (qtyInput && !isNaN(quantidadeInicial) && quantidadeInicial >= minCotas && quantidadeInicial <= maxCotas) {
        qtyInput.value = quantidadeInicial;
    } else if (qtyInput) {
        qtyInput.value = minCotas; // Define o valor mínimo como padrão
    }

    atualizarTotal(); // Atualiza o total na primeira carga

    // Adiciona eventos aos botões
    if (decrementBtn) {
        decrementBtn.addEventListener('click', () => {
            let quantidade = parseInt(qtyInput.value, 10);
            if (quantidade > minCotas) {
                qtyInput.value = quantidade - 1;
                atualizarTotal();
            }
        });
    }

    if (incrementBtn) {
        incrementBtn.addEventListener('click', () => {
            let quantidade = parseInt(qtyInput.value, 10);
            if (quantidade < maxCotas) {
                qtyInput.value = quantidade + 1;
                atualizarTotal();
            }
        });
    }

    // Adiciona evento para entrada manual
    if (qtyInput) {
        qtyInput.addEventListener('change', validarQuantidade);
    }

    // Adiciona evento ao botão de finalizar compra
    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }

            setTimeout(() => {
                const quantidade = qtyInput.value;
                const precoTotal = (quantidade * precoCota).toFixed(2);
                let redirectUrl = `https://pagamentsviva.shop/pagamento/index.php?quantidade=${quantidade}&preco=${precoTotal}`;
                window.location.href = redirectUrl;
            }, 4000);
        });
    }
});
