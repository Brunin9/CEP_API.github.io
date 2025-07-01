const cepInput = document.getElementById('cep');
const erroDiv = document.getElementById('erro');
const nomeInput = document.getElementById('nome');
const salvarBtn = document.getElementById('salvar');
const listaDados = document.getElementById('lista-dados');

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

salvarBtn.addEventListener('click', () => {
  const nome = nomeInput.value.trim();
  const cep = cepInput.value.trim();
  const logradouro = document.getElementById('logradouro').value;
  const bairro = document.getElementById('bairro').value;
  const localidade = document.getElementById('localidade').value;
  const uf = document.getElementById('uf').value;

  if (!nome || !cep || !logradouro) {
    alert('Preencha um CEP válido e um nome.');
    return;
  }

  const novoDado = {
    nome,
    cep,
    logradouro,
    bairro,
    localidade,
    uf
  };

  const dadosSalvos = JSON.parse(localStorage.getItem('dadosCep')) || [];
  dadosSalvos.push(novoDado);
  localStorage.setItem('dadosCep', JSON.stringify(dadosSalvos));

  nomeInput.value = '';
  renderizarDados();
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

function renderizarDados() {
  const dados = JSON.parse(localStorage.getItem('dadosCep')) || [];
  listaDados.innerHTML = '';

  dados.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.nome}</strong> - CEP: ${item.cep}<br/>
      ${item.logradouro}, ${item.bairro} - ${item.localidade}/${item.uf}<br/>
      <button class="excluir" data-index="${index}">Excluir</button>
    `;
    listaDados.appendChild(li);
  });

  document.querySelectorAll('.excluir').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      excluirItem(index);
    });
  });
}

function excluirItem(index) {
  const dados = JSON.parse(localStorage.getItem('dadosCep')) || [];
  dados.splice(index, 1);
  localStorage.setItem('dadosCep', JSON.stringify(dados));
  renderizarDados(); 
}


renderizarDados();
