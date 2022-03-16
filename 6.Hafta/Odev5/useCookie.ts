import { useCallback } from "react"

export const useCookie = () => {

  // Return value of cookieName or ''
  const getCookie = useCallback((cookieName: string) => {
    // document.cookie is a string formatted as 'cookie1=value1; cookie2=value2; ...'
    // String.match(regex) method returns an array of strings matching given regex
    // Array.pop() method removes and returns last element of the array (in this case last match group of regex)
    return document.cookie.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)')?.pop() || ''
  }, [])

  const setCookie = useCallback((cookieName: string, value: string) => {
    document.cookie = `${cookieName}=${value}`;
  }, [])

  const deleteCookie = useCallback((cookieName: string) => {
    // Set expiration date to past for browser to remove cookie
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }, [])

  return { getCookie, setCookie, deleteCookie };
}

// const { getCookie, setCookie, deleteCookie } = useCookie();
// setCookie('cookie1', 'value1') adds cookie1=value1 to document.cookie
// getCookie('cookie1') returns 'value1'
// deleteCookie('cookie1') deletes cookie1=value1 from document.cookie
// setCookie('cookie1', 'value2') updates cookie1=value1 to cookie1=value2