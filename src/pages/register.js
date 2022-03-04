import React, { Component } from 'react';
import '../styles/register.css';
import '../config/firebase.js'
import firebase from 'firebase';

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            cpassword: '',
        }
    }

    signUpWithEmail = () => {
        document.getElementById('spinner').style.display = 'block';
        if (this.state.password == this.state.cpassword) {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((userCredential) => {
                    // Signed in 
                    var user = userCredential.user;
                    localStorage.setItem('user', user.email);
                    window.location.href = '/todo';
                    document.getElementById('spinner').style.display = 'none';
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage);
                    document.getElementById('spinner').style.display = 'none';
                });
        } else { alert("Passwords don't match.");document.getElementById('spinner').style.display = 'none'; }
    }

    signUpWithGoogle = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;
                var token = credential.accessToken;
                var user = result.user;
                localStorage.setItem('user', user.email);
                sessionStorage.setItem('token', token);
                window.location.href = '/todo';
            }).catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
            });
    }

    signUpWithFacebook = () => {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;
                var user = result.user;
                var accessToken = credential.accessToken;
                if(user.displayName == null || user.displayName == undefined){
                    if(user.email == null || user.email == undefined){
                      localStorage.setItem('user', user.phoneNumber)
                      sessionStorage.setItem('token', accessToken)
                      window.location.href = '/todo';              
                    }else{
                      localStorage.setItem('user', user.email)
                      sessionStorage.setItem('token', accessToken)
                      window.location.href = '/todo';
                    }
                }else{
                  localStorage.setItem('user', user.displayName)
                  sessionStorage.setItem('token', accessToken)
                  window.location.href = '/todo';
                }
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
            });
    }

    signUpWithGithub = () => {
        var provider = new firebase.auth.GithubAuthProvider();
        firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;
          var token = credential.accessToken;
          var user = result.user;
          if(user.displayName == null || user.displayName == undefined){
              if(user.email == null || user.email == undefined){
                localStorage.setItem('user', user.phoneNumber)
                sessionStorage.setItem('token', token)
                window.location.href = '/todo';              
              }else{
                localStorage.setItem('user', user.email)
                sessionStorage.setItem('token', token)
                window.location.href = '/todo';
              }
          }else{
            localStorage.setItem('user', user.displayName)
            sessionStorage.setItem('token', token)
            window.location.href = '/todo';
          }
        }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage)
        });      
    }

    render() {
        return (
            <section className="login-block">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                                <div className="auth-box card">
                                    <div className="card-block">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h3 className="text-center heading">Signup to use Todo app</h3>
                                            </div>
                                        </div>
                                        <div className="form-group form-primary"> <input type="text" className="form-control" name="email" value={this.state.email} placeholder="Email" id="email" onChange={(e) => this.setState({ email: e.target.value })} /> </div>
                                        <div className="form-group form-primary"> <input type="password" className="form-control" name="password" placeholder="Password" value={this.state.password} id="password" onChange={(e) => this.setState({ password: e.target.value })} /> </div>
                                        <div className="form-group form-primary"> <input type="password" className="form-control" name="password_confirm" placeholder="Confirm password" value={this.state.cpassword} id="password_confirm" onChange={(e) => this.setState({ cpassword: e.target.value })} /> </div>
                                        <div className="row">
                                            <button className="btn btn-primary btn-md btn-block waves-effect text-center m-b-20" name="submit" value="Login" onClick={() => this.signUpWithEmail()}><span className="spinner-border spinner-border-sm" role="status" id='spinner' style={{ display: 'none' }} aria-hidden="true"></span> Signup using Email/Password</button>                                        </div>
                                    </div>
                                    <div className="or-container">
                                        <div className="line-separator"></div>
                                        <div className="or-label">or</div>
                                        <div className="line-separator"></div>
                                    </div>
                                    <div className="row">
                                            <button className="btn btn-lg btn-google btn-block btn-outline" onClick={() => this.signUpWithGoogle()}><img src="https://img.icons8.com/color/16/000000/google-logo.png" /> Signup Using Google</button>
                                            <br />
                                            <div className="line-separator"></div>
                                            <div className="line-separator"></div>
                                            <div className="line-separator"></div>
                                            <button className="btn btn-lg btn-facebook btn-block btn-outline" onClick={() => this.signUpWithFacebook()}><img src="https://pnggrid.com/wp-content/uploads/2021/05/Facebook-logo-2021.png" width={19} height={19} /> Signup Using Facebook</button>
                                            <div className="line-separator"></div>
                                        <div className="line-separator"></div>
                                        <div className="line-separator"></div>
                                        <button className="btn btn-lg btn-github btn-block btn-outline" onClick={() => this.signUpWithGithub()}><img src="https://pbs.twimg.com/profile_images/1414990564408262661/r6YemvF9_400x400.jpg" width={19} height={19} /> Signup Using Github</button>
                                        </div> <br />
                                    <p className="text-inverse text-center">Already have an account? <a href="/login" data-abc="true">Login</a></p>
                                </div>
                        </div>
                </div>
            </div>
            </section >
        )
    }
}