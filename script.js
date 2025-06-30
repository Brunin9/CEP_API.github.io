const cepInput = document.getElementById('cep');
const erroDiv = document.getElementById('erro');

cepInput.addEventListener('input', function () {
  const cep = this.value.replace(/\D/g, '');

  if (cep.length < 8) {
    clearFields();
    erroDiv.style.display = 'none';
    return;
  }

  if (!/^\d{8}$/.test(cep)) {
    showError('CEP inválido. Digite apenas 8 números.');
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        showError('CEP não encontrado.');
        return;
      }

      erroDiv.style.display = 'none';
      document.getElementById('logradouro').value = data.logradouro || '';
      document.getElementById('bairro').value = data.bairro || '';
      document.getElementById('localidade').value = data.localidade || '';
      document.getElementById('uf').value = data.uf || '';
    })
    .catch(() => {
      showError('Erro ao buscar o CEP. Tente novamente.');
    });
});

function clearFields() {
  document.getElementById('logradouro').value = '';
  document.getElementById('bairro').value = '';
  document.getElementById('localidade').value = '';
  document.getElementById('uf').value = '';
}

function showError(message) {
  clearFields();
  erroDiv.textContent = message;
  erroDiv.style.display = 'block';
}
