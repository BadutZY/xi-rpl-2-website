import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_URL =
  "https://www.kredit-poin-siswa-smkinfokom.my.id/dashboard/point/siswa/views/";

const STUDENT_IDS: Record<string, number> = {
  "RIZKY MAULANA PUTRA": 1671,
};

function parseSisaPoint(html: string): string | null {
  const match = html.match(
    /<th[^>]*>\s*Sisa\s*Point\s*<\/th>\s*<th[^>]*>:\s*<\/th>\s*<th[^>]*>\s*(\d+)\s*<\/th>/i
  );
  return match ? match[1] : null;
}

async function fetchWithRetry(
  url: string,
  retries = 2
): Promise<string | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          Referer: "https://www.kredit-poin-siswa-smkinfokom.my.id/",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) return null;
      return await res.text();
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
      return null;
    }
  }
  return null;
}

async function fetchPoinSiswa(siswaId: number): Promise<string | null> {
  const html = await fetchWithRetry(`${BASE_URL}${siswaId}`);
  if (!html) return null;
  return parseSisaPoint(html);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  const result: Record<string, string> = {};
  const errors: Record<string, string> = {};

  const entries = Object.entries(STUDENT_IDS);

  await Promise.all(
    entries.map(async ([fullName, siswaId]) => {
      const poin = await fetchPoinSiswa(siswaId);
      if (poin !== null) {
        result[fullName] = poin;
      } else {
        errors[fullName] = `Gagal fetch ID ${siswaId}`;
      }
    })
  );

  return res.status(200).json({
    success: true,
    count: Object.keys(result).length,
    data: result,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  });
}