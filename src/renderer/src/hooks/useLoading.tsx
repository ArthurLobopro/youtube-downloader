import { useState } from "react";

export function useLoading(defaultValue = false) {
  const [isLoading, setIsLoading] = useState(defaultValue);

  return {
    isLoading,
    setIsLoading,
    loader: isLoading && <Loader />,
  };
}

function Loader() {
  return (
    <div className="z-10 absolute inset-0 bg-black bg-opacity-35 w-[100vw] h-[100vh] grid place-items-center">
      <div className="w-10 h-10 rounded-full animate-spin border-[4px] border-solid border-gray-600 border-l-transparent" />
    </div>
  );
}
