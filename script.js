document.getElementById('cep-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let cep = document.getElementById('cep').value.trim();

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            const resultadoDiv = document.getElementById('resultado');

            if (data.erro) {
                resultadoDiv.innerHTML = "<p>CEP não encontrado.</p>";
            } else {
                resultadoDiv.innerHTML = `
                    <p><strong>Logradouro:</strong> ${data.logradouro}</p>
                    <p><strong>Bairro:</strong> ${data.bairro}</p>
                    <p><strong>Cidade:</strong> ${data.localidade}</p>
                    <p><strong>UF:</strong> ${data.uf}</p>
                `;
            }
        })
        .catch(() => {
            alert("Erro ao buscar o CEP.");
        });
});
