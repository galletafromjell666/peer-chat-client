import isEmpty from "lodash/isEmpty";
import useSWR from "swr";

const getServerStatus = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};

const useServerStatus = () => {
  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_API_URL}status`,
    getServerStatus,
    {
      shouldRetryOnError: false,
    }
  );

  const isSuccess = isEmpty(error) && !isEmpty(data);
  const isError = !isEmpty(error);

  return {
    data,
    isSuccess,
    isError,
    isLoading,
  };
};

export default useServerStatus;
