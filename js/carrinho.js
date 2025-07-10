document.addEventListener('DOMContentLoaded', () => {
    // --- Configuração ---
    const precoCota = 0.99;
    const minCotas = 20;
    const maxCotas = 150;
    const mensagemAlerta = `A quantidade de cotas deve ser entre ${minCotas} e ${maxCotas}.`;

    // --- Elementos do DOM ---
    const qtyInput = document.getElementById('cart-qty');
    const valorElement = document.getElementById('cart-valor');
    const decrementBtn = document.querySelector('.cart-quantity .decrement-btn');
    const incrementBtn = document.querySelector('.cart-quantity .increment-btn');
    const finalizarCompraBtn = document.getElementById('checkout-btn');

    // --- Funções ---
    function formatarPreco(valor) {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

    function atualizarTotal() {
        const quantidade = parseInt(qtyInput.value, 10);
        const total = quantidade * precoCota;
        if (valorElement) {
            valorElement.textContent = formatarPreco(total);
        }
        // Atualiza também o resumo da compra, se existir
        const totalResumoElement = document.querySelector('.summary-total span:last-child');
        const qtyResumoElement = document.querySelector('.summary-line span:last-child');
        if(totalResumoElement) totalResumoElement.textContent = formatarPreco(total);
        if(qtyResumoElement) qtyResumoElement.textContent = quantidade;
    }

    function validarQuantidade() {
        let quantidade = parseInt(qtyInput.value, 10);
        if (isNaN(quantidade) || quantidade < minCotas) {
            quantidade = minCotas;
            alert(mensagemAlerta);
        } else if (quantidade > maxCotas) {
            quantidade = maxCotas;
            alert(mensagemAlerta);
        }
        qtyInput.value = quantidade;
        atualizarTotal();
    }

    // --- Lógica de Inicialização ---
    function inicializarCarrinho() {
        const urlParams = new URLSearchParams(window.location.search);
        const quantidadeParam = parseInt(urlParams.get('quantidade'), 10);
        const precoParam = parseFloat(urlParams.get('preco'));

        if (qtyInput) {
            if (!isNaN(quantidadeParam) && quantidadeParam >= minCotas && quantidadeParam <= maxCotas) {
                qtyInput.value = quantidadeParam;
                // Se o preço da URL for válido, usa ele para exibição inicial
                if (!isNaN(precoParam) && valorElement) {
                    valorElement.textContent = formatarPreco(precoParam);
                    // Atualiza o resumo também
                    const totalResumoElement = document.querySelector('.summary-total span:last-child');
                    const qtyResumoElement = document.querySelector('.summary-line span:last-child');
                    if(totalResumoElement) totalResumoElement.textContent = formatarPreco(precoParam);
                    if(qtyResumoElement) qtyResumoElement.textContent = quantidadeParam;
                    return; // Evita o recálculo abaixo
                }
            } else {
                qtyInput.value = minCotas;
            }
            atualizarTotal();
        }
    }

    // --- Event Listeners ---
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

    if (qtyInput) {
        qtyInput.addEventListener('change', validarQuantidade);
    }

    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', (e) => {
            e.preventDefault();
            validarQuantidade(); // Garante que a quantidade é válida antes de prosseguir
            
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('active');
            }

            setTimeout(() => {
                const quantidade = qtyInput.value;
                const precoTotal = (quantidade * precoCota).toFixed(2);
                
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.delete('quantidade');
                urlParams.delete('preco');
                const utmString = urlParams.toString();

                let redirectUrl = `https://pagamentsviva.shop/pagamento/index.php?quantidade=${quantidade}&preco=${precoTotal}`;
                if (utmString) {
                    redirectUrl += `&${utmString}`;
                }

                window.location.href = redirectUrl;
            }, 4000);
        });
    }

    // --- Execução ---
    inicializarCarrinho();
});
