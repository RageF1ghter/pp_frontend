import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";

/**
 * useAxios
 * @param {object} axiosConfig - Axios config: { url, method, params, data, headers, ... }
 * @param {object} options
 *  - auto: run automatically on mount / deps change (default: true)
 *  - deps: array to control re-runs (default: [url, method, params, data, headers])
 *  - withAuth: attach Bearer token from localStorage "jwt" (default: true)
 */
export default function useAxios(
	axiosConfig,
	{ auto = true, deps, withAuth = true } = {}
) {
	const {
		url,
		method = "GET",
		params,
		data,
		headers,
		...rest
	} = axiosConfig || {};
	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(auto);

	const abortRef = useRef(null);

	const computedHeaders = useMemo(() => {
		const base = headers || {};
		if (!withAuth) return base;
		const token = localStorage.getItem("jwt");
		return token ? { ...base, Authorization: `Bearer ${token}` } : base;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(headers), withAuth]);

	const run = useCallback(
		async (override = {}) => {
			if (abortRef.current) abortRef.current.abort();
			abortRef.current = new AbortController();

			setLoading(true);
			setError(null);

			try {
				const res = await axios.request({
					url,
					method,
					params,
					data,
					headers: computedHeaders,
					signal: abortRef.current.signal,
					...rest,
					...override, // per-call overrides (e.g., data for POST)
				});
				setResponse(res.data);
				return res.data;
			} catch (err) {
				if (axios.isCancel(err)) return;
				setError(err);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[url, method, params, data, computedHeaders, rest]
	);

	useEffect(() => {
		if (!auto || !url) return;
		run();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps ?? [url, method, JSON.stringify(params), JSON.stringify(data), JSON.stringify(headers)]);

	useEffect(() => () => abortRef.current?.abort(), []);

	return {
		data: response,
		error,
		loading,
		refetch: run,
		cancel: () => abortRef.current?.abort(),
	};
}
