async function post (url, body, isAuthenticated) {
  const token = sessionStorage.getItem('token')

  const headers = { 'Content-Type': 'application/json' }
  if (isAuthenticated) {
    headers.Authorization = 'Token ' + token
  }

  const payload = {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  }

  return await fetch(url, payload)
}

async function postUrlEncoded (url, body, isAuthenticated) {
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(body)
  }

  return await fetch(url, payload)
}

async function get (url, params = {}, isAuthenticated) {
  const token = sessionStorage.getItem('token')
  const paramString = (new URLSearchParams(params)).toString()
  const newUrl = paramString ? url + '?' + params : url
  const headers = {}
  if (isAuthenticated) {
    console.log(token)
    headers.Authorization = 'Token ' + token
  }

  const payload = {
    method: 'GET',
    headers
  }

  return await fetch(newUrl, payload)
}

async function del(url, params = {}, isAuthenticated = false) {
  const token = sessionStorage.getItem('token')

  // Construct query parameters if needed
  const paramString = (new URLSearchParams(params)).toString()
  const newUrl = paramString ? url + '?' + paramString : url

  const headers = { 'Content-Type': 'application/json' }
  if (isAuthenticated) {
    headers.Authorization = 'Token ' + token
  }

  const payload = {
    method: 'DELETE',
    headers
  }

  return await fetch(newUrl, payload)
}



export { get, post, postUrlEncoded, del}
