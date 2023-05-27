//firebase config
//-----> HERE

//Inicialización de Firebase
firebase.initializeApp(firebaseConfig);

const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');

//Registro de usuario
const userSignUp = async (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      let user = userCredential.user;
      alert(`Your user has been registered ${user.email} ID:${user.uid}`)
      
      createUser({
        id: user.uid,
        email: user.email,
      });
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("System error:" +  errorCode + ' ' + errorMessage);
    });
};
// email test: mafer@gmail.com AMZn+humTdumt$@t0nAwa11
// email test: miguel@gmail.com  9zg9D4XwzQXbFDZK7
// email test: vicky@gmail.com  AMZn+humTdumt$@t0nAwa11

//Obtener datos de contacto (get contact data)
document.querySelector('#registration').addEventListener('submit', (e) => {
  e.preventDefault();
  let email = e.target.elements.email.value;
  let password = e.target.elements.password.value;

  password ? userSignUp(email, password) : alert("error password");
})


//Acceso a usuario registrado con correo
const userSignIn = async () => {
  const signInEmail = await userEmail.value;
  const signInPassword = await userPassword.value;
  firebase.auth().signInWithEmailAndPassword(signInEmail, signInPassword)
    .then(userCredential => {
      let user = userCredential.user;
      alert(`your have login as ${user.email} ID:${user.uid}`);
    })
    .catch(error => {
      console.log("Error login:", error.message);
    })
};

const userSignOut = async () => {
  let user = await firebase.auth().currentUser;

  firebase.auth().signOut().then(() => {
    console.log("GoodBye: " + user.email)
  }).catch((error) => {
    console.log("Error with log out: " + error);
  });
};

//User status
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    navigateToHome();
    console.log(`Log user: ${user.email} ${user.uid}`);
  } else {
    console.log("There is no user!");
  }
});

//Events
document.querySelector('#logIn').addEventListener('click', userSignIn);
document.querySelector('#signUp').addEventListener('click', userSignUp);
document.querySelector('#logOut').addEventListener('click', userSignOut);