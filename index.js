import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Paste cookie kamu dalam format 1 baris di sini:
const cookieHeader = `GPS=1; PREF=tz=Asia.Jakarta; __Secure-1PSIDTS=sidts-CjEB5H03P3f8V8PHN-r5piK1WTC5RF9xwZQprYxnOzlzriJdni0JrCq_DxlZ_pRsS9l8EAA; __Secure-3PSIDTS=sidts-CjEB5H03P3f8V8PHN-r5piK1WTC5RF9xwZQprYxnOzlzriJdni0JrCq_DxlZ_pRsS9l8EAA; HSID=A9RyIOuGgc9J54_P0; SSID=AoT9AnFIr-736p4e3; APISID=_KTP9Iuipkh9ILNW/AyfrHb_gl5jxIgn7w; SAPISID=8YUMfqcQnwo6QCJ6/AbZI-TafhTMqcbgJz; __Secure-1PAPISID=8YUMfqcQnwo6QCJ6/AbZI-TafhTMqcbgJz; __Secure-3PAPISID=8YUMfqcQnwo6QCJ6/AbZI-TafhTMqcbgJz; SID=g.a000ygjGRbFjFZcbwW7HreO5Qfo-TYiBCx_3hSzgfaIvs_meqOJOFzJfWtM2wQqVZyB9f612owACgYKAXcSARMSFQHGX2MiRedJZ4PEDyvzFIYNezFoXBoVAUF8yKoNjZ-cdV8kvr9vLAXFy50Y0076; __Secure-1PSID=g.a000ygjGRbFjFZcbwW7HreO5Qfo-TYiBCx_3hSzgfaIvs_meqOJO0oaaquh5TdBBAON_W4ks_gACgYKAYISARMSFQHGX2Mi-UlKhLIIM4N_gp1ekc3YiRoVAUF8yKqEXBRODEXeGh6YDa3Nk84-0076; __Secure-3PSID=g.a000ygjGRbFjFZcbwW7HreO5Qfo-TYiBCx_3hSzgfaIvs_meqOJOoSa5H-hkVRKBlVNnGY2jfgACgYKAX4SARMSFQHGX2Mio0Eyv-Dac6dW1ecUTLzAAhoVAUF8yKo5W2t7VETOQ4PF9vSIqyA70076; LOGIN_INFO=AFmmF2swRQIgX1hWKdWgdG_XhtSjKCcfN-sqzSxsdeQdn6w56tNtb6oCIQC_RBASyyR8NjxkTvqsEWN_D5ikYmrSUOpg06uY0omdOQ:QUQ3MjNmelJ6UGpPVEVHQTBfTWZyY2hXRU1obDFsNVEwWUdSWVdma1g5XzhGOFEyVkdKMlByZm00ZHkyOVhjdmRpejJmNi12WGU4Y18wY2VaSWh6dlBFVlc2Tl9FbzcxTmd5OG9YTUtoLTN5eHhaZFp1SG5BMHVmMHExVWhpNndqSWh5Y3NCNTBiN2syOWdXWlA1dm9neHNiMzR3T2ptRnZB; SIDCC=AKEyXzUEJKy-knFmlY978ltoquEI2I9xVkZBFmXzdNaTTohiJ8XHQe3ch7i_dJ-t2Nnjl1p3; __Secure-1PSIDCC=AKEyXzWf-eOMIJjCwd3pgf9k-zApEepkGTJE2SmGMruxcFo1tYEWU950XrypurW7cqp4V3fDrQ; __Secure-3PSIDCC=AKEyXzXF1rTc-njjeCM7A_FpZ_Fvpii0A8AkIT9_b66Orko2oDTRjKwmCRuvqdf-q-n07NDScA; YSC=U-CVWVTW3QM; VISITOR_INFO1_LIVE=JVBTCOQ5kmY; VISITOR_PRIVACY_METADATA=CgJVUxIEGgAgJw%3D%3D; __Secure-ROLLOUT_TOKEN=CI-trOXE-uO7xwEQhKPXh_ugjgMYo4HEjvugjgM%3D;`;

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
