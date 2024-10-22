document.getElementById('download-btn').addEventListener('click', () => {
    // Desativa o botão imediatamente para evitar múltiplos cliques
    const downloadButton = document.getElementById('download-btn');
    downloadButton.disabled = true;
    downloadButton.textContent = 'Baixando...';

    // Obtém o link de áudio inserido
    const audioLink = document.getElementById('audio-link').value;

    // Expressão regular para verificar se o link é válido do YouTube
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    
    // Verifica se o link está vazio ou se é inválido
    if (!audioLink) {
        alert('Por favor, cole a URL do YouTube!');
        downloadButton.disabled = false;
        downloadButton.textContent = 'Baixar Música';
        return;
    }

    if (!youtubeRegex.test(audioLink)) {
        alert('Por favor, insira uma URL válida do YouTube!');
        downloadButton.disabled = false;
        downloadButton.textContent = 'Baixar Música';
        return;
    }

    // Função para adicionar um timeout à requisição fetch
    const fetchWithTimeout = (url, options, timeout = 10000) => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Tempo de requisição esgotado')), timeout)
            )
        ]);
    };

    // Faz a requisição ao servidor local para iniciar o download
    fetchWithTimeout('http://localhost:3000/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ link: audioLink })
    }, 10000) // Timeout de 10 segundos
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Falha ao baixar a música');
            });
        }
        return response.blob();  // Converte a resposta em um blob (arquivo binário)
    })
    .then(blob => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob); 
        a.href = url;
        a.download = 'musica.mp3'; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Reativa o botão após o download
        downloadButton.disabled = false;
        downloadButton.textContent = 'Baixar Música';
    })
    .catch(error => {
        console.error('Erro:', error);
        alert(`Houve um problema ao tentar baixar a música: ${error.message}`);
        
        // Reativa o botão mesmo em caso de erro
        downloadButton.disabled = false;
        downloadButton.textContent = 'Baixar Música';
    });
});