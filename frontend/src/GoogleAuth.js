import React, { useEffect, useRef } from 'react'
// import axios from "axios";

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = (err) => reject(err)
    document.body.appendChild(script)
  })

const GoogleAuth = () => {

  const googleButton = useRef(null);

  useEffect(() => {
    const src = 'https://accounts.google.com/gsi/client'
    const id = "344449499122-af2ai3bhn3k5a97aptobcjulorh70aib.apps.googleusercontent.com"

    loadScript(src)
      .then(() => {
      
        /*global google*/
        
        google.accounts.id.initialize({
          client_id: id,
          callback: handleCredentialResponse,
        })
        google.accounts.id.renderButton(
          googleButton.current,
          { theme: 'outline', size: 'large' }
        )
      })
      .catch(console.error)

    return () => {
      const scriptTag = document.querySelector(`script[src="${src}"]`)
      if (scriptTag) document.body.removeChild(scriptTag)
    }
  }, [])

  function handleCredentialResponse(response) {
    if (response.credential) {
      console.log(response.credential);
      var data = { "auth_token": response.credential }
      fetch("http://127.0.0.1:8000/google/",
        {
          method: "post",
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          document.getElementById("email_id").innerText=res['email']
          document.getElementById("auth_token").innerText=res['tokens']
        })

    }
  }

  return (
    <div id='google-login-btn'>
    <div ref={googleButton} id='google-ref'></div>
    <div>
      <div>
      <label>Email Id:</label>
      <label id='email_id'></label>
      </div>
      <div>
        <label>Auth token:</label>
        <label id='auth_token'></label>
      </div>

    </div>
    </div>
    
  )
}

export default GoogleAuth