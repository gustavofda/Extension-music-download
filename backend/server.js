const express = require('express');
const ytdl = require('ytdl-core');
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
        const info = await ytdl.getInfo(link);
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: '140' });
        
        // Obtem o título do vídeo
        const title = info.videoDetails.title;
        console.log('Baixando áudio:', title);

        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');
        
        // Streaming do arquivo de áudio para a resposta
        ytdl(link, { format: audioFormat }).pipe(res);
    } catch (error) {
        console.error('Erro ao baixar:', error);
        res.status(500).json({ error: 'Erro ao baixar a música' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
