//firebase configuración
//-----> FIREBASE_CONFIGURATION HERE
const firebaseConfig = {
  apiKey: "AIzaSyBAF84mZM38GNZjZ4hdE-28FnHDM77F5rg",
  authDomain: "quizeax2.firebaseapp.com",
  projectId: "quizeax2",
  storageBucket: "quizeax2.appspot.com",
  messagingSenderId: "397962594102",
  appId: "1:397962594102:web:5740a7404606e1bcd01597"
};


//Inicialización de Firebase y variables
firebase.initializeApp(firebaseConfig);
const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
const auth = firebase.auth();
const db = firebase.firestore();

// query para acceder a una referencia
const usersRef = db.collection("users");

//Registro de usuario ------------------------------
const userSignUp = async (email, password) => {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      
      createUserDocument(user);
      localStorage.setItem('currentUser', JSON.stringify(user.uid) );
    })
    .catch((error) => {
      /*create Alert messsage <-----*/
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("System error:" +  errorCode + ' ' + errorMessage);
    });
};
      
//Datos de registro
const dataToSignUp = (e) => {
  e.preventDefault();
  let email = e.target.elements.email.value;
  let password = e.target.elements.password.value;

  password ? userSignUp(email, password) : alert("error password");
}

//Acceso a usuario registrado con correo
const userSignIn = async () => {
  const signInEmail = await userEmail.value;
  const signInPassword = await userPassword.value;
  auth.signInWithEmailAndPassword(signInEmail, signInPassword)
    .then(userCredential => {
      const user = userCredential.user;
      console.log(`your have login as ${user.email} ID:${user.uid}`);
    })
    .catch(error => {
      console.log("Error login:", error.message);
    })
};

//Registro/acceso con Google
const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithRedirect(provider);
  firebase.auth()
  .getRedirectResult()
  .then((result) => {
    if (result.credential) {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;
      const token = credential.accessToken;
      localStorage.setItem('currentUser', JSON.stringify(user.uid) );
    }
    const user = result.user;
    console.log('user google', user);
  })
  .catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;
    let email = error.email;
    let credential = error.credential;
  });
}

//Salida de la app
const userSignOut = async () => {
  let user = await firebase.auth().currentUser;

  firebase.auth().signOut().then(() => {
    console.log("GoodBye: " + user.email)
    locationbar.reload()
  }).catch((error) => {
    console.log("Error with log out: " + error);
  });
};

//Estado de usuario
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    navigateToHome();
  } 
  else {
    console.log('user');
  }
});


/* Manejo de documentos /C.R.U.D ------------------------------*/
function createUserDocument(user) {
  db.collection('users')
  .add({
    userId: user.uid,
    nickName: '',
    games: [],
  })
  .then(docRef => {
    console.log("Document written with ID: ", docRef.id)
  })
  .catch(error => console.error("Error adding document: ", error))
};

//Consult user data
function readDocument(prop, comparedSimbol, value) {
  
  db.collection("users")
    .where(prop, comparedSimbol, value)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        return doc.data();
      })
    })
    .catch(error => {
      console.log("Error getting document:", error);
    });
}

// Funciones auxiliares
function navigateToQuiz() {
  let elementsToHide = getElements([
    '#registration', 
    '#home' ,
     '#results', 
     '#review', 
     '#logIn', 
     '#play', 
     '#seeResults', 
     '#footerMenu'
  ]);
  let elementsToShow = getElements([
    '#avatarUser', 
    '#headerMenu', 
    '#quiz', 
    '#next'
  ]);
  hideElements(elementsToHide);
  showElements(elementsToShow);

  printQuestion(data.results[0]);
  getElement('#next').addEventListener('click', printNextQuestion);
};

function navigateToRegistration() {
  let elementsToHide = getElements([
    '#avatarUser', 
    '#headerMenu', 
    '#home', 
    '#results', 
    '#play', 
    '#next', 
    '#seeResults', 
    '.navHamburgerMenu'
  ]);
  hideElements(elementsToHide);
}

//Events
document.querySelector('#logIn').addEventListener('click', userSignIn);
document.querySelector('#logOut').addEventListener('click', userSignOut);
document.querySelector('#play').addEventListener('click', navigateToQuiz);
document.querySelector('#googleBtn').addEventListener('click', signInWithGoogle);
document.querySelector('#registration').addEventListener('submit', dataToSignUp);