import { useCallback } from "react"

export const useCookie = (cookieName: 'string') => {
  const getCookie = useCallback((name: string) => {
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  }, [])

  const setCookie = useCallback((name: string, value: string) => {
    document.cookie = `${name}=${value}`;
  }, [])

  const deleteCookie = useCallback((name: string) => {
    // Set expiration date to past for browser to remove cookie
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }, [])

  return { getCookie, setCookie, deleteCookie };
}