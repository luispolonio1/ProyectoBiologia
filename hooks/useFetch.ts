import { useCallback, useEffect, useState } from "react";

export const useFetch = <T,>(url: string) => {

    const [data, setData] = useState<T>([] as T);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Error al obtener datos");
            }

            const result = await response.json();
            setData(result);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData  // 👈 sin (), solo la referencia
    };
};