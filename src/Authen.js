import React, { Component } from 'react';
var firebase= require('firebase');

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDa9G4PBAPsHIk_Gai7FUXgTLOOfvYU3aE",
    authDomain: "usurvey-51960.firebaseapp.com",
    databaseURL: "https://usurvey-51960.firebaseio.com",
    projectId: "usurvey-51960",
    storageBucket: "usurvey-51960.appspot.com",
    messagingSenderId: "533681553981"
  };
  firebase.initializeApp(config);

class Authen extends Component {

  login(event){
    const email= this.refs.email.value;
    const password= this.refs.password.value;
    const auth=firebase.auth();//firebase query
    const promise=auth.signInWithEmailAndPassword(email, password);

    promise.then(user => {
      var lout = document.getElementById("logout");
      var err= "You are logged in as: "+ user.email;
        this.setState({err: err});
      lout.classList.remove('hide');

    });
    //catching the error
    promise.catch(e => {
      var err = e.message;//error message thrown here
      console.log(err);
      this.setState({err: err});
    });
  }

  signup(event){
    const email= this.refs.email.value;
    const password= this.refs.password.value;
    const auth=firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, password);

    promise
    //in then you handle good things and in catch you handle the errors
    .then(user => {
      var err = "Welcome "+ user.email;
      firebase.database().ref('users/'+ user.uid).set({
        email: user.email
      });
      //console.log(user);
      this.setState({err: err});
    });

    promise
    .catch(e => {
      var err = e.message;
      console.log(err);
      this.setState({err: err})
    });
  }

  logout(){
    firebase.auth().signOut();
    var lout = document.getElementById("logout");
    lout.classList.add('hide');
    const email= this.refs.email.value;
    var err= "Thanks "+ email;
    this.setState({err: err});

  }

  google(){
    console.log("I am in google method");
    //call the provider
    //in provider create new instance of google auth provider
    var provider = new firebase.auth.GoogleAuthProvider();
    var promise = firebase.auth().signInWithPopup(provider);// popup method is good for web based application
    // redirect method is good for mobile based application
    //promise needs to be handled with then and catch
    promise.then( result => {
      var user = result.user;
      console.log(result);
      //make database entry
      firebase.database().ref('users/'+user.uid).set({
        email: user.email,
        name: user.displayName
      })
      var lout = document.getElementById("logout");
      var err= "You are logged in as: "+ user.email;
        this.setState({err: err});
      lout.classList.remove('hide');
    });

    promise.catch(e => {
      var msg = e.message;
      console.log(msg);
    })


  }

  constructor(props){
    super(props);

    this.state = {
      err:''
    };
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.google = this.google.bind(this);
  }

  render(){
    return(
      <div>
        <input id="email" ref="email" type="email" placeholder="Enter your email"/><br />
        <input id="pass" ref="password" type="password" placeholder="Enter your password"/><br />
        <p>{this.state.err}</p>
        <button onClick = {this.login}>Log In</button>
        <button onClick = {this.signup}>Sign up</button>
        <button onClick = {this.logout} id="logout" className="hide">Log out</button><br />
        <button onClick = {this.google} id="google" className="">Sign in with Google</button>

      </div>
    );
  }
}

export default Authen;
