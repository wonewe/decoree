import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");
    fetcher()
      .then((value) => {
        if (!isMounted) return;
        setData(value);
        setStatus("success");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err as Error);
        setStatus("error");
      });
    return () => {
      isMounted = false;
    };
  }, [fetcher]);

  return { status, data, error };
}
