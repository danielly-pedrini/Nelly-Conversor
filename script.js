 const currencyFlags = {
            BRL: { flag: 'br', symbol: 'R$', name: 'Real Brasileiro (BRL)' },
            USD: { flag: 'us', symbol: '$', name: 'Dólar Americano (USD)' },
            EUR: { flag: 'eu', symbol: '€', name: 'Euro (EUR)' },
            GBP: { flag: 'gb', symbol: '£', name: 'Libra Esterlina (GBP)' },
            JPY: { flag: 'jp', symbol: '¥', name: 'Iene Japonês (JPY)' },
            KRW: { flag: 'kr', symbol: '₩', name: 'Won Sul-Coreano (KRW)' }
        };

        let exchangeRates = {};

        function updateFlags() {
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;
            
            document.getElementById('fromFlag').src = `https://flagcdn.com/w40/${currencyFlags[fromCurrency].flag}.png`;
            document.getElementById('toFlag').src = `https://flagcdn.com/w40/${currencyFlags[toCurrency].flag}.png`;
            
            document.getElementById('fromCurrencyFlag').src = `https://flagcdn.com/w40/${currencyFlags[fromCurrency].flag}.png`;
            document.getElementById('toCurrencyFlag').src = `https://flagcdn.com/w40/${currencyFlags[toCurrency].flag}.png`;
            document.getElementById('resultFlag').src = `https://flagcdn.com/w40/${currencyFlags[toCurrency].flag}.png`;
            
            document.getElementById('fromCurrencySymbol').textContent = currencyFlags[fromCurrency].symbol;
            document.getElementById('toCurrencySymbol').textContent = currencyFlags[toCurrency].symbol;
            document.getElementById('resultCurrencyName').textContent = currencyFlags[toCurrency].name;
        }

        async function fetchExchangeRates() {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await response.json();
                exchangeRates = data.rates;
                exchangeRates.USD = 1; // USD como base
            } catch (error) {
                console.error('Erro ao buscar taxas de câmbio:', error);
                // Taxas de exemplo como fallback
                exchangeRates = {
                    USD: 1,
                    BRL: 5.20,
                    EUR: 0.85,
                    GBP: 0.73,
                    JPY: 110.0,
                    KRW: 1180.0
                };
            }
        }

        async function convertCurrency() {
            const amount = parseFloat(document.getElementById('amount').value);
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;
            const resultDiv = document.getElementById('result');

            if (!amount || amount <= 0) {
                resultDiv.textContent = 'Digite um valor válido';
                resultDiv.className = 'result-value error';
                return;
            }

            resultDiv.textContent = 'Convertendo...';
            resultDiv.className = 'result-value loading';

            try {
                await fetchExchangeRates();
                
                // Converter para USD primeiro, depois para a moeda de destino
                const amountInUSD = amount / exchangeRates[fromCurrency];
                const convertedAmount = amountInUSD * exchangeRates[toCurrency];
                
                // Formatação baseada na moeda
                let formattedResult;
                if (toCurrency === 'JPY' || toCurrency === 'KRW') {
                    formattedResult = Math.round(convertedAmount).toLocaleString('pt-BR');
                } else {
                    formattedResult = convertedAmount.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
                
                resultDiv.textContent = `${currencyFlags[toCurrency].symbol} ${formattedResult}`;
                resultDiv.className = 'result-value';
                
            } catch (error) {
                console.error('Erro na conversão:', error);
                resultDiv.textContent = 'Erro na conversão';
                resultDiv.className = 'result-value error';
            }
        }

        // Event listeners
        document.getElementById('fromCurrency').addEventListener('change', updateFlags);
        document.getElementById('toCurrency').addEventListener('change', updateFlags);
        document.getElementById('amount').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                convertCurrency();
            }
        });

        // Inicialização
        updateFlags();
        fetchExchangeRates();