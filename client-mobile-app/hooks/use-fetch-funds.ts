import { useEffect, useState } from 'react';

export interface FundSearchResult {
  schemeCode: string;
  schemeName: string;
}

export interface FundListItem {
  id: string;
  name: string;
}

export function useFetchFunds(query: string) {
  const [data, setData] = useState<FundListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((results: FundSearchResult[]) => {
        setData(
          results.map((item) => ({
            id: item.schemeCode,
            name: item.schemeName,
          }))
        );
      })
      .catch((err) => {
        setError(err.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return { data, loading, error };
}
