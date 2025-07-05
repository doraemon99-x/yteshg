import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Paste cookie kamu dalam format 1 baris di sini:
const cookieHeader = `GPS=1; PREF=tz=Asia.Jakarta; __Secure-1PSIDTS=sidts-CjEB5H03P2AvOkZ7KXZ2ZhXG-wRaQdGa8mjfugRy09yzoQw8aNPbmWhMfsI8bAOYNWk4EAA; __Secure-3PSIDTS=sidts-CjEB5H03P2AvOkZ7KXZ2ZhXG-wRaQdGa8mjfugRy09yzoQw8aNPbmWhMfsI8bAOYNWk4EAA; __Secure-3PAPISID=8YUMfqcQnwo6QCJ6/AbZI-TafhTMqcbgJz; __Secure-3PSID=g.a000ygjGRbFjFZcbwW7HreO5Qfo-TYiBCx_3hSzgfaIvs_meqOJOoSa5H-hkVRKBlVNnGY2jfgACgYKAX4SARMSFQHGX2Mio0Eyv-Dac6dW1ecUTLzAAhoVAUF8yKo5W2t7VETOQ4PF9vSIqyA70076; LOGIN_INFO=AFmmF2swRAIgO6E57TpO9k5aMT6aGW8WI1JhFBFM-qcVBEeWc2FCqK8CIBnn0_FUOfR4i1bdRsJQQQEsE-mde5XjCkx7VWx-WVXV:QUQ3MjNmejA1SFB6RDlzVWlOVDVRQXBidkVfZ3VxMEczOUxrLVpEVUx4SkQyUXVhcno5RTNGb2VHeDZMMDhUV1dXWnIzQWRJUnpxSEFKUkdnLUNZQzNzYTRkUTNfZXF1RFhIT29MYmhCV0kwaWZsLU01bjJ2Qll5UW5uRFFEOG1Dd2VYM0drNVVoNm4weFVibm1lYm1sMFVfWTF4RTExSWh3; CONSISTENCY=AKreu9tRnUTXELlQaa3oxGb3Ug7Qyu-qr4RX2csDpzm7_k4k1O1CpZLvJksXzAugejU2rQqdnVOs-Uq_n9rgg6W2382iJOtRzeDFxMLVpnlxUwXfpJ7kaiJIYxztlAallp6wmaxu5zv1BMJr_2A526uFfuG3WmLCCZ65yLdu55Bn5Q; __Secure-3PSIDCC=AKEyXzUJvok7f1x60W-E1RjpP2wWrkdi4scnasWoWd1hWfFpht2vMcvuC2F5moP3NGcGTsV6Rg; ST-183jmdn=session_logininfo=AFmmF2swRAIgO6E57TpO9k5aMT6aGW8WI1JhFBFM-qcVBEeWc2FCqK8CIBnn0_FUOfR4i1bdRsJQQQEsE-mde5XjCkx7VWx-WVXV%3AQUQ3MjNmejA1SFB6RDlzVWlOVDVRQXBidkVfZ3VxMEczOUxrLVpEVUx4SkQyUXVhcno5RTNGb2VHeDZMMDhUV1dXWnIzQWRJUnpxSEFKUkdnLUNZQzNzYTRkUTNfZXF1RFhIT29MYmhCV0kwaWZsLU01bjJ2Qll5UW5uRFFEOG1Dd2VYM0drNVVoNm4weFVibm1lYm1sMFVfWTF4RTExSWh3; __Secure-ROLLOUT_TOKEN=CI-trOXE-uO7xwEQhKPXh_ugjgMYxo74qoSmjgM%3D; YSC=iv_A6NwzfLk; VISITOR_INFO1_LIVE=dK5Ee4tc18c; VISITOR_PRIVACY_METADATA=CgJVUxIEGgAgTw%3D%3D;`;

app.get('/live/:id', async (req, res) => {
  const videoID = req.params.id.split('.')[0];
  const url = `https://www.youtube.com/live/${videoID}/live`;

  try {
    const response = await fetch(url, {
      headers: {
        'Cookie': cookieHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(500).send(`YouTube responded with status: ${response.status}`);
    }

    const html = await response.text();
    const match = html.match(/(?<=hlsManifestUrl":")[^"]+\.m3u8/);

    if (match && match[0]) {
      return res.redirect(302, match[0]);
    } else {
      return res.status(404).send("No .m3u8 URL found in YouTube response.");
    }
  } catch (err) {
    return res.status(500).send(`Fetch error: ${err.message}`);
  }
});

// fallback
app.use((req, res) => {
  res.status(404).send('Endpoint not found');
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
