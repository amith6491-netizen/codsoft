import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const DISHES_DIR = path.resolve('public/dishes');
if (!fs.existsSync(DISHES_DIR)) {
  fs.mkdirSync(DISHES_DIR, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectUrl = res.headers.location;
          if (!redirectUrl.startsWith('http')) {
            const parsed = new URL(url);
            redirectUrl = parsed.origin + redirectUrl;
          }
          return resolve(downloadImage(redirectUrl, dest));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          const size = fs.statSync(dest).size;
          resolve(size);
        });
      }
    ).on('error', reject);
  });
}

const dishes = [
  // ── SHIRO PAN-ASIAN & SUSHI LOUNGE (101 - 112) ──
  { id: 101, file: 'dim-sum.jpg', url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=700&q=80' },
  { id: 102, file: 'salmon-maki.jpg', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=80' },
  { id: 103, file: 'chicken-yakitori.jpg', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80' },
  { id: 104, file: 'rock-shrimp-tempura.jpg', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80' },
  { id: 105, file: 'thai-green-curry.jpg', url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=700&q=80' },
  { id: 106, file: 'peking-duck.jpg', url: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=700&q=80' },
  { id: 107, file: 'udon-noodles.jpg', url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=700&q=80' },
  { id: 108, file: 'grilled-snapper.jpg', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80' },
  { id: 109, file: 'chocolate-volcano.jpg', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80' },
  { id: 110, file: 'mango-sticky-rice.jpg', url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=700&q=80' },
  { id: 111, file: 'matcha-green-tea.jpg', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=700&q=80' },
  { id: 112, file: 'yuzu-mint-cooler.jpg', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80' },

  // ── LE CIRQUE SIGNATURE (201 - 212) ──
  { id: 201, file: 'burrata-salad.jpg', url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=700&q=80' },
  { id: 202, file: 'french-onion-soup.jpg', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80' },
  { id: 203, file: 'seared-scallops.jpg', url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80' },
  { id: 204, file: 'crispy-calamari.jpg', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80' },
  { id: 205, file: 'truffle-pappardelle.jpg', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80' },
  { id: 206, file: 'chilean-sea-bass.jpg', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80' },
  { id: 207, file: 'lamb-rack.jpg', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80' },
  { id: 208, file: 'margherita-pizza.jpg', url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=700&q=80' },
  { id: 209, file: 'creme-brulee.jpg', url: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=700&q=80' },
  { id: 210, file: 'sticky-toffee-pudding.jpg', url: 'https://www.theleela.com/prod/content/assets/styles/tl_377_500_webp/public/2024-11/Sticky-Toffee-Pudding-with-vanilla-ice-cream-le-cirque-restaurant.jpg' },
  { id: 211, file: 'venetian-tiramisu.jpg', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=700&q=80' },
  { id: 212, file: 'espresso-martini.jpg', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80' },

  // ── JAMAVAR ROYAL DINING (301 - 312) ──
  { id: 301, file: 'paneer-tikka.jpg', url: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=700&q=80' },
  { id: 302, file: 'kakori-seekh-kebab.jpg', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80' },
  { id: 303, file: 'tandoori-prawns.jpg', url: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=700&q=80' },
  { id: 304, file: 'amritsari-fish-tikka.jpg', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=700&q=80' },
  { id: 305, file: 'butter-chicken.jpg', url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=700&q=80' },
  { id: 306, file: 'raan-lamb-shank.jpg', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80' },
  { id: 307, file: 'dal-jamavar-naan.jpg', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80' },
  { id: 308, file: 'dum-biryani.jpg', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80' },
  { id: 309, file: 'kesari-rasmalai.jpg', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80' },
  { id: 310, file: 'shahi-tukda.jpg', url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=700&q=80' },
  { id: 311, file: 'mango-lassi.jpg', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80' },
  { id: 312, file: 'royal-masala-chai.jpg', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80' },

  // ── CITRUS MEDITERRANEAN BRASSERIE (401 - 411) ──
  { id: 401, file: 'chicken-caesar-salad.jpg', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80' },
  { id: 402, file: 'tomato-bruschetta.jpg', url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=700&q=80' },
  { id: 403, file: 'garlic-mushrooms.jpg', url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=80' },
  { id: 404, file: 'prosciutto-pizza.jpg', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80' },
  { id: 405, file: 'grilled-salmon.jpg', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80' },
  { id: 406, file: 'fettuccine-alfredo.jpg', url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=700&q=80' },
  { id: 407, file: 'four-cheese-pizza.jpg', url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80' },
  { id: 408, file: 'ny-cheesecake.jpg', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80' },
  { id: 409, file: 'vanilla-panna-cotta.jpg', url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=700&q=80' },
  { id: 410, file: 'cold-brew-tonic.jpg', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80' },
  { id: 411, file: 'watermelon-refresher.jpg', url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=700&q=80' },
];

async function run() {
  console.log(`Starting extraction of ${dishes.length} dish images...`);
  let successCount = 0;
  let failCount = 0;

  for (const item of dishes) {
    const dest = path.join(DISHES_DIR, item.file);
    try {
      const size = await downloadImage(item.url, dest);
      console.log(`[✓] ID ${item.id} -> ${item.file} (${Math.round(size / 1024)} KB)`);
      successCount++;
    } catch (err) {
      console.error(`[✗] ID ${item.id} -> ${item.file} FAILED: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\nFinished extraction: ${successCount} successful, ${failCount} failed.`);
}

run();
