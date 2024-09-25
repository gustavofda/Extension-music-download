document.getElementById('download-btn').addEventListener('click', () => {
    const audioLink = document.getElementById('audio-link').value;

    if (!audioLink) {
        alert('Por favor, cole a URL do YouTube!');
        return;
    }

    fetch('http://localhost:3000/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ link: audioLink })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao baixar a música');
        }
        return response.blob();
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
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Houve um problema ao tentar baixar a música.');
    });
});
