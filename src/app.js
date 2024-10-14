// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, addDoc, collection, getDocs, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRttM3UZdrEMtVxs8uBCNOj_2DBs5mXu0",
  authDomain: "app-clientes-web-tp-2024.firebaseapp.com",
  projectId: "app-clientes-web-tp-2024",
  storageBucket: "app-clientes-web-tp-2024.appspot.com",
  messagingSenderId: "765709702222",
  appId: "1:765709702222:web:c9f390205d2cda4ebe9f1f",
  measurementId: "G-XPDE3ML9BG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app);

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async(e) =>{
    e.preventDefault();

    const emailRegister = document.getElementById('register-email').value;
    const passwordRegister = document.getElementById('register-password').value;

    try{
        await createUserWithEmailAndPassword(auth, emailRegister, passwordRegister);
        await signOut(auth);
        overlayContaint.remove();
        containBody.style.overflow = '';
        blockRegister.className = 'container content-registerForm d-none';
    } catch (error){
        console.log('error en el registro', error.message);
    }
 });


 //Inicio de sesion

 const loginForm = document.getElementById('login-form');

 loginForm.addEventListener('submit', async(e) =>{
     e.preventDefault();
 
     const loginEmail = document.getElementById('login-email').value;
     const loginPassword = document.getElementById('login-password').value;
 
     try{
         await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        overlayContaint.remove();
         containBody.style.overflow = '';
         blockLogin.className = 'container content-loginForm d-none';
     } catch (error){
         console.log('error en el registro', error.message);
     }
  });


  // cerrar sesion
const btnLogout = document.getElementById('logoutBtn');

btnLogout.addEventListener('click', async () => {
    try {
      await signOut(auth);
      overlayContaint.remove();
      containBody.style.overflow = '';
      blockLogin.className = 'container content-loginForm d-none';
    } catch (error) {
        console.log('error al cerrar sesion', error.message);
    }
  });

  // estado de la sesion

  const usuarioLogueado = document.getElementById('perfil');
  const emailUsuarioLogueado = document.getElementById('userAcces');
  const opcionesInicio = document.getElementById('perfil-init');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('usuario logueado: ', user)
      usuarioLogueado.className = 'perfilAbierto';
      opcionesInicio.className = 'itemsCerrado';
      emailUsuarioLogueado.innerHTML = '¡Hola ' + auth.currentUser.email + '!';
      createMessage.style.display = 'flex';
    } else {
      console.log('usuario no logueado: ', user)
      usuarioLogueado.className = 'perfilCerrado';
      opcionesInicio.className = 'itemsAbierto';
      createMessage.style.display = 'none';
    }
  });


// Crear publicacion

const createMessage = document.getElementById('create-message');

createMessage.addEventListener('submit', async(e) =>{
  e.preventDefault();

  const title = document.getElementById('create-title').value;
  const message = document.getElementById('create-content').value;
  
  try{
    await addDoc(collection(db, 'Posts'),{
      title: title,
      message: message,
      user: auth.currentUser.email,
      date: new Date()
    });
    loadPosts();

  }catch(error){
    console.log('hubo un error al enviar el mensaje', error.message)
  }

})


// Mostrar publicacion

async function loadPosts(){
  const menssageChat = document.getElementById('menssageChat');
  menssageChat.innerHTML = '';

  const queryPosts = await getDocs(collection(db, 'Posts'));
  queryPosts.forEach((doc)=>{
    const post = doc.data();
    const postElement = document.createElement('div');
    postElement.className = 'viewPost';
    postElement.innerHTML = `<h3>${post.title}</h3><p>"${post.message}"</p><small>${post.user}</small>`;
    menssageChat.appendChild(postElement);
  })
}
loadPosts();


//Abrir modal iniciar sesion

const linkRegistrarse = document.getElementById('abrirRegistro');
const linkLogin = document.getElementById('abrirLogin');
const linkRegistrarseClose = document.getElementById('closedRegister');
const linkLoginClose = document.getElementById('closedLogin');

const containBody = document.body;
const blockRegister = registerForm.parentNode;
const blockLogin = loginForm.parentNode;
const overlayContaint = document.createElement('div');
      overlayContaint.className = 'overlay';

linkRegistrarse.addEventListener('click', () => {
  containBody.style.overflow = 'hidden';
  containBody.appendChild(overlayContaint);
  blockRegister.className = 'container content-registerForm d-block';
})

linkLogin.addEventListener('click', () => {
  containBody.style.overflow = 'hidden';
  containBody.appendChild(overlayContaint);
  blockLogin.className = 'container content-registerForm d-block';
})

linkRegistrarseClose.addEventListener('click', () => {
  overlayContaint.remove();
  blockRegister.className = 'container content-registerForm d-none';
  containBody.style.overflow = '';
})

linkLoginClose.addEventListener('click', () => {
  overlayContaint.remove();
  blockLogin.className = 'container content-loginForm d-none';
  containBody.style.overflow = '';
})