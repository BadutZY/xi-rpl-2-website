import type { VercelRequest, VercelResponse } from "@vercel/node";

const TARGET_URL = "https://www.kredit-poin-siswa-smkinfokom.my.id/";

const STUDENT_NAMES = [
  "ABIYAN ZUL FADLI",
  "AHMAD RAIHAN BATUBARA",
  "AMANDA WIDYA PRAMESTI",
  "AYESHA NADYA AFSARIANA",
  "CHANTIKA OCTAVIANY",
  "ELSA MAYASARI",
  "FAJAR PERMANA PUTRA",
  "FATHUL MUBIN",
  "GADIS PUTRI HUDAYA",
  "HAFIFA TUNURLIAH",
  "IBRAHIM NAUFHAL",
  "IRSYAD MUSYAFFA",
  "KAFKA NAVIZZA AGUSTIN",
  "KLARA AYU YUSNIA",
  "MARIO RAMDANI",
  "MOCHAMAD FATHURAHMAN",
  "MOHAMAD RAFA ZAMIZAR",
  "MUHAMAD PRASYA SISWADI",
  "MUHAMMAD AL FATIH HAIDAR",
  "MUHAMMAD DEFRANS ABDULLAH HAJRIN",
  "MUHAMMAD MALIKUL MULKI",
  "MUHAMMAD RAFA PRATAMA",
  "MUHAMMAD RIZKY AKBAR GOZALI",
  "RAFI ADIYATMA TRI FALAH",
  "RAKA SYAFA'ATAN",
  "RAYA AHMAD FADILAH",
  "REVAN DWI ERLANGGA",
  "RIZKY MAULANA PUTRA",
  "SANDI SANJAYA",
  "SULTAN BIMA AGASSI",
];

function normalize(str: string): string {
  return str
    .toUpperCase()
    .replace(/[^A-Z\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function matchStudentName(cellText: string): string | null {
  const normalized = normalize(cellText);
  for (const name of STUDENT_NAMES) {
    if (normalized.includes(name) || name.includes(normalized)) {
      return name;
    }
  }
  return null;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  try {
    const response = await fetch(TARGET_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "Source website tidak bisa diakses",
        status: response.status,
      });
    }

    const html = await response.text();
    const result: Record<string, string> = {};

    const trRegex = /<tr[\s\S]*?<\/tr>/gi;
    const trMatches = html.match(trRegex) || [];

    for (const row of trMatches) {
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      const cells: string[] = [];
      let tdMatch;
      while ((tdMatch = tdRegex.exec(row)) !== null) {
        cells.push(stripTags(tdMatch[1]));
      }

      for (let i = 0; i < cells.length; i++) {
        const matchedName = matchStudentName(cells[i]);
        if (matchedName) {
          for (let j = 0; j < cells.length; j++) {
            if (i !== j && /^\d+$/.test(cells[j].trim())) {
              result[matchedName] = cells[j].trim();
              break;
            }
          }
          break;
        }
      }
    }

    if (Object.keys(result).length === 0) {
      for (const name of STUDENT_NAMES) {
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`${escaped}[\\s\\S]{0,300}?(\\d{1,3})`, "i");
        const match = html.match(regex);
        if (match) {
          result[name] = match[1];
        }
      }
    }

    return res.status(200).json({
      success: true,
      count: Object.keys(result).length,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      error: "Gagal fetch data",
      detail: message,
    });
  }
}