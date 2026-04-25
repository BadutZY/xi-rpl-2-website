import { useState, useEffect } from "react";

type KreditPoinMap = Record<string, string>;

interface KreditPoinResult {
  poinMap: KreditPoinMap;
  loading: boolean;
  error: boolean;
}

export function useKreditPoin(): KreditPoinResult {
  const [poinMap, setPoinMap] = useState<KreditPoinMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/kredit-poin")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: { success: boolean; data: KreditPoinMap }) => {
        if (!cancelled && json.success) {
          setPoinMap(json.data);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { poinMap, loading, error };
}