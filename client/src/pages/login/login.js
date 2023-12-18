import React, { useEffect, useState } from 'react'
import axios from "axios"
import Loader from "../../assets/images/loader.gif"
import "./login.css"

const Login = () => {

  const [token, setToken] = useState(null);
  const [authorized, setAuthorized] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');
    if (authorizationCode) {
      exchangeCodeForToken(authorizationCode);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = `${process.env.REACT_APP_API_URL}/webflowAuthorizedUser`;
        const tokenApi = token;
        const response = await axios.post(apiUrl, { tokenApi });
        if (response.data) {
          setAuthorized(response.data);
        }
      } catch (error) {
        console.error('Error making API request:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const exchangeCodeForToken = async (authorizationCode) => {
    try {
      setLoading(true);
      const apiUrl = `${process.env.REACT_APP_API_URL}/callback`;
      const encodedRedirectUri = `${process.env.REACT_APP_API_URL}/login`;
      const response = await axios.post(apiUrl, {
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        redirect_URI: encodedRedirectUri,
        code: authorizationCode,
        grant_type: 'authorization_code',
      });
      const accessToken = response.data.access_token;
      setToken(accessToken);
    } catch (error) {
      console.error('Error exchanging code for access token:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="main-wrapper">
        <div className="wrapper">
          {loading ? (
            { Loader }
          ) : (
            <div>
              <div className="heading">
                <h2>Welcome!</h2>
                <p>Sign In to your account</p>
              </div>
              <div className="input-group">
                <input type="text" id="username" className="input-field" placeholder="Username" />
              </div>
              <div className="input-group">
                <input type="password" id="password" className="input-field" placeholder="Password" />
              </div>
              <div className="input-group row">
                <div className="row">
                  <a href="/" target="_blank">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="input-group">
                <button>
                  Login <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Login
