import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Paste cookie kamu dalam format 1 baris di sini:
const cookieHeader = `GPS=1; __Secure-1PSIDTS=sidts-CjIB5H03P-uDhowAfbxNmZGr8j_HPDRUHB0xaQaVS0q1Db2Qi2y-VHWw1f4KVKGs58NDRhAA; __Secure-3PSIDTS=sidts-CjIB5H03P-uDhowAfbxNmZGr8j_HPDRUHB0xaQaVS0q1Db2Qi2y-VHWw1f4KVKGs58NDRhAA; __Secure-3PAPISID=fZvHwj_h3hGspHUc/A5o6o_GFVrOHDAzRM; __Secure-3PSID=g.a000zQjGRaKbc3m8fukg36maYzejkbJ3fEHB0n_FOksQDvevqeTcFEKFQHGQUwS7Z1DwwAEFXwACgYKAZoSARMSFQHGX2MiSPV34VvDrCNfo9whM_qn9RoVAUF8yKqjsd8Go_6V3oM_7ocDMZKU0076; LOGIN_INFO=AFmmF2swRQIhAOZuFhequ-6hdPdiCN0pK7bAIgFKePrt5VoArymz1bNoAiAxhb6bYX_GhIxqvXtJI1g8u2bUo28_o__b4c_B4TFowg:QUQ3MjNmd1RGeDljbmw5SndOOHlVOEktdFBoT2EyUkY1Z2tvdHd1d2NiQ2JrY1VVbi1JbUJfZ01FVjhsZzh5cW42RnktbHE1SEdkc3IzWndOaXN4aFd4aHZ2WThZNHNVUFFGaFI3Z0QxT0d2QnRQc2k0QlR5VVBwYXU5VnhYRmFyZ0p2emkxMjdsdGNYN1lEUERpbnJGSTRXT3hiMGZ2OFZB; PREF=tz=Asia.Jakarta; __Secure-3PSIDCC=AKEyXzXg6OhE2d0oQLiARvo9WDN2FddrPsfTWvlQB9MENLEbpjIfGaAQdSTrrc3We4GMtZU6; CONSISTENCY=AKreu9vMtF9WbimeEBr171ha64WeqnJmNzVnPqf0IZKVtP9C7Zf9pidFQGT5B20EA4G7SnDBO0qvOSDTux1_C5MbHf3V1gSHqr7srgNxXgz-gsvk01NfvAy8jO1SpaDzojch7_e9BslelUH7hP-BbfDDvrrEW-U9ho-vHK3THNlP9A; __Secure-ROLLOUT_TOKEN=CLmipOWm-aW-dhD4ndvnusGOAxiU3KPHgs6OAw%3D%3D; YSC=amjLAl29qcg; VISITOR_INFO1_LIVE=9JjIMypgZIw; VISITOR_PRIVACY_METADATA=CgJVUxIEGgAgOg%3D%3D;`;

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
