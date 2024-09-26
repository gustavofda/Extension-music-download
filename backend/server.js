const express = require('express');
const youtubeDlExec = require('youtube-dl-exec');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
    const { link } = req.body;

    if (!link) {
        console.log('Nenhum link fornecido');
        return res.status(400).json({ error: 'Link não fornecido' });
    }

    try {
        console.log('Recebido link:', link);

        // Obtem informações do vídeo
        const info = await youtubeDlExec(link, {
            dumpSingleJson: true,
            noWarnings: true,
            output: '%(title)s.%(ext)s' // Define o formato do arquivo
        });

        const title = info.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_'); // Substitui espaços por underscores
        console.log('Baixando áudio:', title);

        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');

        // Chama o youtube-dl para baixar o arquivo
        youtubeDlExec(link, {
            extractAudio: true,
            audioFormat: 'mp3',
            noWarnings: true,
            output: `downloads/${title}.%(ext)s`, // Define o caminho de saída
        }).pipe(res);

        // Tratamento de erros no streaming
        .on('error', (err) => {
            console.error('Erro no stream:', err);
            if (err.code === 'ENOTFOUND') {
                return res.status(404).json({ error: 'Link inválido ou não encontrado.' });
            }
            res.status(500).json({ error: 'Erro ao baixar a música. Tente novamente mais tarde.' });
        });

    } catch (error) {
        console.error('Erro ao baixar:', error);
        if (error.message.includes('403')) {
            res.status(403).json({ error: 'Acesso negado. O vídeo pode ser restrito.' });
        } else if (error.message.includes('404')) {
            res.status(404).json({ error: 'Vídeo não encontrado. Verifique o link.' });
        } else {
            res.status(500).json({ error: 'Erro ao baixar a música. Tente novamente mais tarde.' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});