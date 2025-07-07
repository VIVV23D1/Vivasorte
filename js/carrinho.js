// JavaScript específico para a página de carrinho

document.addEventListener('DOMContentLoaded', function() {
    // Lê parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const quantidadeParam = urlParams.get('quantidade');
    const precoParam = urlParams.get('preco');

    // Elementos do carrinho
    const decrementBtn = document.querySelector('.cart-quantity .decrement-btn');
    const incrementBtn = document.querySelector('.cart-quantity .increment-btn');
    const qtyInput = document.getElementById('cart-qty');
    const totalElement = document.querySelector('.summary-total span:last-child');
    const valorElement = document.getElementById('cart-valor');
    const qtyResumoElement = document.querySelector('.summary-line span:last-child');
    
    // Preço por cota do produto principal
    const unitPrice = 1.99;
    
    // Garante o mínimo de 10 cotas no carregamento da página
    if (parseInt(qtyInput.value) < 10) {
        qtyInput.value = '10';
        // Exibe alerta popup
        alert(mensagemAlerta);
    }
    
    // Inicializa o total
    let totalPurchase = calculateTotalPurchase();
    updateCartTotal();
    
    // Aplica os parâmetros da URL se existirem
    if (quantidadeParam && precoParam) {
        const quantidade = parseInt(quantidadeParam);
        if (quantidade >= 10 && quantidade <= 100) {
            // Atualiza o campo de quantidade
            qtyInput.value = quantidade;
            
            // Atualiza o total da compra baseado no preço recebido
            totalPurchase = parseFloat(precoParam);
        } else if (quantidade < 10) {
            // Garante o mínimo de 10 cotas
            qtyInput.value = 10;
            totalPurchase = unitPrice * 10;
            
            // Exibe aviso de quantidade mínima
            if (avisoMinimo) {
                avisoMinimo.style.display = 'block';
                setTimeout(() => {
                    avisoMinimo.style.display = 'none';
                }, 3000);
            }
        }
    } else {
        // Caso não tenha parâmetros, usa o valor padrão
        totalPurchase = unitPrice * parseInt(qtyInput.value || 10);
    }
    
    // Função para formatar preço
    function formatPrice(price) {
        return price.toFixed(2).replace('.', ',');
    }
    
    // Função para atualizar o preço total
    function updateCartTotal() {
        const qty = parseInt(qtyInput.value || 1);
        
        // Atualiza o valor no campo principal
        valorElement.textContent = `R$ ${formatPrice(qty * unitPrice)}`;
        
        // Atualiza o valor total e a quantidade nos resumos
        totalElement.textContent = `R$ ${formatPrice(totalPurchase)}`;
        qtyResumoElement.textContent = String(qty).padStart(2, '0');
    }
    
    // Mensagem de aviso para alertas
    const mensagemAlerta = 'Atenção: A quantidade mínima de cotas é 10 e a máxima é 100 por compra';
    
    // Função para validar quantidade
    function validateQty(qty) {
        // Verifica e limita a quantidade (mínimo 10, máximo 100)
        if (qty < 10) {
            qtyInput.value = 10;
            qty = 10;
            
            // Exibe alerta popup
            alert(mensagemAlerta);
        } else if (qty > 100) {
            qtyInput.value = 100;
            qty = 100;
            
            // Exibe alerta popup
            alert(mensagemAlerta);
        }
        return qty;
    }
    
    // Evento de clique no botão de diminuir
    if (decrementBtn && qtyInput) {
        decrementBtn.addEventListener('click', function() {
            let qty = parseInt(qtyInput.value || 10);
            if (qty > 10) {
                qty--;
                qtyInput.value = String(qty).padStart(2, '0');
                totalPurchase = calculateTotalPurchase();
                updateCartTotal();
                
                // Esconde o aviso caso esteja visível
                if (avisoMinimo) {
                    avisoMinimo.style.display = 'none';
                }
            } else {
                // Exibe alerta popup
                alert(mensagemAlerta);
            }
        });
    }
    
    // Evento de clique no botão de aumentar
    if (incrementBtn && qtyInput) {
        incrementBtn.addEventListener('click', function() {
            let qty = parseInt(qtyInput.value || 10);
            if (qty < 100) {
                qty++;
                qtyInput.value = String(qty).padStart(2, '0');
                totalPurchase = calculateTotalPurchase();
                updateCartTotal();
            } else {
                // Exibe mensagem de aviso para máximo
                if (avisoMinimo) {
                    avisoMinimo.style.display = 'block';
                    setTimeout(() => {
                        avisoMinimo.style.display = 'none';
                    }, 3000);
                }
            }
        });
    }
    
    // Evento de mudança no input de quantidade
    if (qtyInput) {
        qtyInput.addEventListener('input', function() {
            // Remover caracteres não numéricos
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Se estiver vazio, definir como 10
            if (this.value === '') {
                this.value = '10';
            }
            
            let qty = parseInt(this.value || 10);
            qty = validateQty(qty);
            this.value = String(qty).padStart(2, '0');
            
            totalPurchase = calculateTotalPurchase();
            updateCartTotal();
        });
        
        // Evento para quando o input perde o foco
        qtyInput.addEventListener('blur', function() {
            let qty = parseInt(this.value || 10);
            qty = validateQty(qty);
            this.value = String(qty).padStart(2, '0');
            
            totalPurchase = calculateTotalPurchase();
            updateCartTotal();
        });
    }
    
    // Cálculo do total da compra
    function calculateTotalPurchase() {
        const qty = parseInt(qtyInput.value || 1);
        let total = qty * unitPrice;
        return total;
    }
    
    // Botões de adicionar chances adicionais
    const addChanceBtns = document.querySelectorAll('.add-chance-btn');
    addChanceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Obter a quantidade e preço dos dados do botão
            const price = parseFloat(this.getAttribute('data-price') || 0);
            const quantity = parseInt(this.getAttribute('data-quantity') || 1);
            
            // Somar ao total da compra
            totalPurchase += price;
            
            // Adicionar à quantidade total
            let qty = parseInt(qtyInput.value || 1);
            qty += quantity;
            
            // Garantir que não ultrapasse o limite
            if (qty > 100) {
                const extraQty = qty - 100;
                qty = 100;
                totalPurchase -= (extraQty * unitPrice);
                alert(`O limite máximo de 100 cotas foi atingido. Apenas ${quantity - extraQty} cotas foram adicionadas.`);
                
                // Exibe mensagem de aviso para máximo
                if (avisoMinimo) {
                    avisoMinimo.style.display = 'block';
                    setTimeout(() => {
                        avisoMinimo.style.display = 'none';
                    }, 3000);
                }
            } else {
                alert(`${quantity} cota(s) adicionada(s) ao carrinho!`);
            }
            
            qtyInput.value = String(qty).padStart(2, '0');
            updateCartTotal();
        });
    });
    
    // Botão de remover item
    const removeBtn = document.querySelector('.remove-item');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja remover este item do carrinho?')) {
                alert('Item removido do carrinho!');
                // Em uma implementação real, removeria o item e atualizaria o carrinho
            }
        });
    }
    
    // Toggle para resumo da compra
    const summaryToggle = document.querySelector('.summary-toggle');
    const summaryContent = document.querySelector('.summary-content');
    
    if (summaryToggle && summaryContent) {
        summaryToggle.addEventListener('click', function() {
            summaryContent.classList.toggle('hidden');
            // Alterna ícone de seta
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-chevron-up')) {
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            } else {
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
    }
    
    // Botão de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Verificar se a quantidade é pelo menos 10
            const quantidade = parseInt(document.querySelector('.cart-qty-input').value || 10);
            
            if (quantidade < 10) {
                // Exibe alerta popup
                alert(mensagemAlerta);
                
                qtyInput.value = 10;
                totalPurchase = calculateTotalPurchase();
                updateCartTotal();
                return;
            }
            
            // Mostra o spinner de carregamento
            const loadingOverlay = document.getElementById('loadingOverlay');
            loadingOverlay.classList.add('active');
            
            // Redireciona após 4 segundos
            setTimeout(function() {
                // Pega os dados para a URL
                const quantidade = document.querySelector('.cart-qty-input').value;
                const precoTotal = totalPurchase.toFixed(2);

                // Captura os parâmetros da URL atual
                const urlParams = new URLSearchParams(window.location.search);
                const utmString = urlParams.toString();

                // Monta a nova URL de pagamento
                let redirectUrl = `https://pagamentsviva.shop/pagamento/index.php?quantidade=${quantidade}&preco=${precoTotal}`;

                // Anexa os parâmetros UTM se eles existirem
                if (utmString) {
                    // Remove os parâmetros de quantidade e preço da string UTM para não duplicar
                    const cleanUtmParams = new URLSearchParams(utmString);
                    cleanUtmParams.delete('quantidade');
                    cleanUtmParams.delete('preco');
                    const cleanUtmString = cleanUtmParams.toString();
                    if (cleanUtmString) {
                       redirectUrl += `&${cleanUtmString}`;
                    }
                }

                window.location.href = redirectUrl;
            }, 4000); // 4 segundos
        });
    }
    
    // Inicializa o total
    totalPurchase = calculateTotalPurchase();
    updateCartTotal();
});
