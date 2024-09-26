document.getElementById('download-btn').addEventListener('click', () => {
    const audioLink = document.getElementById('audio-link').value;

    if (!audioLink) {
        alert('Por favor, cole a URL do YouTube!');
        return;
    }

    // Desativa o botão para evitar múltiplos cliques
    const downloadButton = document.getElementById('download-btn');
    downloadButton.disabled = true;
    downloadButton.textContent = 'Baixando...';

    fetch('http://localhost:3000/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ link: audioLink })
    })
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


