// ...existing code...
import { useState } from "react";
import { toast } from "sonner";

type AsyncFunction<TArgs extends unknown[], R> = (...args: TArgs) => Promise<R>;

export default function useFetch<TArgs extends unknown[] = unknown[], TData = unknown>(
  cb: AsyncFunction<TArgs, TData>
) {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: TArgs): Promise<TData | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      return response;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      toast.error(e.message);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
}
// ...existing code...