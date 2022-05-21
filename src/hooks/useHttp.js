import { useState, useCallback } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const sendRequest = useCallback(async (url, requestMetadata) => {
    setError(null)
    setIsLoading(true);
    const response = await fetch(url, {
      method: requestMetadata.method == null ? "GET" : requestMetadata.method,
      body:
        requestMetadata.body == null
          ? ""
          : JSON.stringify(requestMetadata.body),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      let errorMessage = null;
      if (data && data.error && data.error.message) {
        errorMessage = data.error.message;
      }
      setError(errorMessage || "Something went wrong while authorization");
      console.log(errorMessage);
    } else {
      try {
         setData(data)
      } catch (error) {
        setError("Something went wrong while authorization");
        console.log(error);
      }
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    error,
    isLoading,
    sendRequest,
  };
};

export default useHttp;
