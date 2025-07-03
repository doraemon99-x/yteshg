import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Paste cookie kamu dalam format 1 baris di sini:
const cookieHeader = `SID=g.a000ywjGRTM24nT18RcBfdI8yBFTuk541Nl3OiRxaA4yIu3_4M340voJbwvICXM71gAfK1_7-gACgYKARoSARMSFQHGX2MiW3-Y2xJADu4tZ7lq0-YQQRoVAUF8yKoMmz6N63YV38DN6LhlwNBY0076; __Secure-1PSID=g.a000ywjGRTM24nT18RcBfdI8yBFTuk541Nl3OiRxaA4yIu3_4M34058rzI5ZyWmI23BseBSUMgACgYKAfwSARMSFQHGX2MizHcp3-yuFp_lrLv8awKoiBoVAUF8yKpLeHcch2uVgIIcMW2AAckY0076; __Secure-3PSID=g.a000ywjGRTM24nT18RcBfdI8yBFTuk541Nl3OiRxaA4yIu3_4M34MUjU94u5JrQtXS7ppqv97wACgYKAXUSARMSFQHGX2Mi2pXVKvKsnSIxbzph3FIM_hoVAUF8yKqBh0cZcNVMklyw5y5JtoWU0076; HSID=A0hda5YyzQLr2vjPl; SSID=Am_9t61jocuxAgMl8; APISID=oezNp8UKszNRVfnF/AsiBw_C-H0i9HwaJp; SAPISID=TCEg6q1v4d5HMaCd/AY6jvO21ncEqv5e1j; __Secure-1PAPISID=TCEg6q1v4d5HMaCd/AY6jvO21ncEqv5e1j; __Secure-3PAPISID=TCEg6q1v4d5HMaCd/AY6jvO21ncEqv5e1j; PREF=tz=Asia.Jakarta; LOGIN_INFO=AFmmF2swRAIgEhC2zmviLSJgK3IpL9RaR_NScxbd6IqQuj5c3syEQbQCIBFZQBAqAzNkNEJZvB0IxY0FNIfO6f7XDpEBcpoqe5TB:QUQ3MjNmeXFfVUNrU01XaDZvYW1UUjhlZWQzWWYwZHIzWWY5bnRlZDk2YUFKamNVT3JOUjFFM3k4bnVsaGxjN1RjaVRmU2c3bHR1SDJVNEN1OEpQY0xDNDczRFN4ZU9lUU5NNzlSdkQ4V2VTOXhLN2l6ZHppS0tCcG4ySjVBcEdob0NVSUNDVlF1Y2NIRERfdlhGYmJXdXhmb1NlZFJQZktR; __Secure-1PSIDTS=sidts-CjEB5H03P_FPcn_ZUU9Zy1y5jjWbkBE7C9PEl_hIqARul9l5HifxdNq1l7Ym4XOU7JzEEAA; __Secure-3PSIDTS=sidts-CjEB5H03P_FPcn_ZUU9Zy1y5jjWbkBE7C9PEl_hIqARul9l5HifxdNq1l7Ym4XOU7JzEEAA; SIDCC=AKEyXzUVn3ymMKCt3b5NYmBCXTupU9mrGnYzhrPrjpC6p1poL_aKj88rlgN2VXzl7oELFJ90; __Secure-1PSIDCC=AKEyXzWjQ4i4R9jDJvHQMNk3bAua1q8HKMsBdV0QWKFcnYoo_qC1O0StznUvr_2iVu5Gw05R; __Secure-3PSIDCC=AKEyXzVUUAmksl__eUzghAQy0uyuGBbjwsokQF7HPV-CIGElhzcGaCtfSgU1c2SoREfG_S7L; YSC=WU5lRA5Y65A; VISITOR_INFO1_LIVE=CBDSx5eJWcQ; VISITOR_PRIVACY_METADATA=CgJVUxIEGgAgIg%3D%3D; __Secure-ROLLOUT_TOKEN=CIvVjvnVoPieIRDE_a7b8J-OAxj55Oze8J-OAw%3D%3D;`;

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
