const express = require('express');
const ytdl = require('ytdl-core'); 
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const cookie = 'SEU_COOKIE_DO_YOUTUBE'; 

app.post('/download', async (req, res) => {
    const { link } = req.body;

    if (!link) {
        console.log('Nenhum link fornecido');
        return res.status(400).json({ error: 'Link não fornecido' });
    }

    try {
        console.log('Recebido link:', link);

        const info = await ytdl.getInfo(link);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        console.log('Baixando áudio:', title);

        const audioStream = ytdl(link, {
            filter: 'audioonly',
            requestOptions: {
                headers: {
                    Cookie: cookie 
                }
            }
        });

        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');

        audioStream.pipe(res);

        audioStream.on('end', () => {
            console.log('Download concluído:', title);
        });

        audioStream.on('error', (err) => {
            console.error('Erro no stream:', err);
            res.status(500).json({ error: 'Erro ao baixar a música. Tente novamente mais tarde.' });
        });

    } catch (error) {
        console.error('Erro ao baixar:', error);

        if (error.statusCode === 403) {
            return res.status(403).json({ error: 'O YouTube bloqueou o acesso a este vídeo. Pode ser necessário autenticação ou o vídeo pode ter restrições.' });
        }

        res.status(500).json({ error: 'Erro ao baixar a música. Tente novamente mais tarde.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});



