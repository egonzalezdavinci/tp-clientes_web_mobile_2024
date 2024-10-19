// Import the functions you need from the SDKs you need
import{db, auth} from './firebase.js';

import { addDoc, collection, getDocs, doc, setDoc, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";


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

  // Ver el estado de la sesion

  const usuarioLogueado = document.getElementById('perfil');
  const emailUsuarioLogueado = document.getElementById('userAcces');
  const opcionesInicio = document.getElementById('perfil-init');
  const loginCommentCarta = document.getElementById('carta-comment-form');
  const messageLoginCommentCarta = document.getElementById('messageNoComentar')
  onAuthStateChanged(auth, (user) => {
    if (user) {
      usuarioLogueado.className = 'perfilAbierto';
      opcionesInicio.className = 'itemsCerrado';
      emailUsuarioLogueado.innerHTML = '¡Hola ' + auth.currentUser.email + '!';
      createMessage.style.display = 'flex';
      loginCommentCarta.style.display = `block`;
      messageLoginCommentCarta.className = 'd-none';
    } else {
      usuarioLogueado.className = 'perfilCerrado';
      opcionesInicio.className = 'itemsAbierto';
      createMessage.style.display = 'none';
      loginCommentCarta.style.display = `none`;
      messageLoginCommentCarta.className = 'd-block';
    }
  });



// Crear Carta

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

});

//Agregar comentario a una carta existente

async function addCommentPost(idUserComment, commentPostCarta){

  try{
    await addDoc(collection(db, 'Comments'),{
      commentUser: commentPostCarta,
      idUser: idUserComment,
      userName: auth.currentUser.email,
      timeStamp: new Date(),
    });

  }catch(error){
    console.log('error al agregar el comentario: ', error.message)
  }
}

// Mostrar publicacion

function loadPosts() {
  const menssageChat = document.getElementById('menssageChat');
  menssageChat.innerHTML = '';

  getDocs(collection(db, 'Posts'))
      .then((queryPosts) => {
          queryPosts.forEach((doc) => {
              const post = doc.data();
              const postElement = document.createElement('div');
              postElement.className = 'viewPost';

              postElement.innerHTML = `
                  <h3>${post.title}</h3>
                  <p>"${post.message}"</p>
                  <small>${post.user}</small>
                  <div>
                      <p class="miLink" data-id="${doc.id}">Comentar Carta</p>
                      <p class="miComentario" data-id="${doc.id}">Ver Comentarios</p>
                  </div>`;
              menssageChat.appendChild(postElement);
              
          });

          // Agregar el evento de clic a los enlaces con la clase "miLink"
          const miLinks = document.querySelectorAll('.miLink');
          miLinks.forEach(link => {
              link.addEventListener('click', function(event) {
              const idUserComment = link.dataset.id;
                  openPopup(idUserComment);
              });
          });

          const miComentario = document.querySelectorAll('.miComentario');
          miComentario.forEach(comentario => {
            comentario.addEventListener('click', function(event) {
              let idUser = comentario.dataset.id;
                  openCommentPopUp(idUser);
              });
          });
      })
      .catch((error) => {
          console.error("Error al obtener los posts:", error);
      });
}

loadPosts();


//Consultar los comentarios de las cartas:

async function loadCommentCarta(idUser){
  const verComentariosContent = document.getElementById('verComentariosDeLaCarta');
        verComentariosContent.innerHTML = '';

  const q = query(collection(db, 'Comments'), where('idUser', '==', idUser));

  const queryComment = await getDocs(q);
  if (queryComment.empty){
    const sinComentarios = document.createElement('div');
    sinComentarios.className = 'viewPostEmpty';
    sinComentarios.innerHTML = `<div>Todavía no hay Comentarios</div>`;
    verComentariosContent.appendChild(sinComentarios);
  }else{
  queryComment.forEach((doc) => {
    const post = doc.data();
    const mostramosComentarios = document.createElement('div');
    mostramosComentarios.className = 'viewPost';
    mostramosComentarios.innerHTML = `<div><small>${post.userName} dijo:</small></div>
                            <div><p>${post.commentUser}</p></div>`;
    verComentariosContent.appendChild(mostramosComentarios);
  });
}
}


//Abrir modal iniciar sesion

const linkRegistrarse = document.getElementById('abrirRegistro');
const linkLogin = document.getElementById('abrirLogin');
const linkRegistrarseClose = document.getElementById('closedRegister');
const linkLoginClose = document.getElementById('closedLogin');
const linkCommentCartaClose = document.getElementById('closedCarta');
const commentCartaClose = document.getElementById('closedComentarios');

const containBody = document.body;
const blockRegister = registerForm.parentNode;
const blockLogin = loginForm.parentNode;
const blockCommentCart = loginCommentCarta.parentNode;
const blockCommentview = commentCartaClose.parentNode;
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

linkCommentCartaClose.addEventListener('click', () => {
  autoCommentCartaClose();
})

function autoCommentCartaClose(){
  overlayContaint.remove();
  blockCommentCart.className = 'container content-commentCarta-Form d-none';
  containBody.style.overflow = '';
  }

commentCartaClose.addEventListener('click', () => {
  overlayContaint.remove();
  blockCommentview.className = 'container content-commentCarta d-none';
  containBody.style.overflow = '';
})

// Función para abrir el popup para comentar
function openPopup(idUserComment) {
  
  const popup = document.getElementById('popup');
  containBody.style.overflow = 'hidden';
  containBody.appendChild(overlayContaint);
  blockCommentCart.className = 'container content-commentCarta-Form d-block';

  loginCommentCarta.addEventListener('submit', async(e) =>{
    const commentPostCarta = document.getElementById('create-commentCarta').value;
    e.preventDefault();
    addCommentPost(idUserComment, commentPostCarta);
    autoCommentCartaClose();
    commentPostCarta.value = '';
  })
}

// Función para abrir el popup para ver comentarios
const contentComentariosContent = document.getElementById('contentComentariosDeLaCarta');

function openCommentPopUp(idUser) {
  console.log(idUser)
  const popup = document.getElementById('popup');
  containBody.style.overflow = 'hidden';
  containBody.appendChild(overlayContaint);
  contentComentariosContent.className = 'container content-commentCarta d-block';
  loadCommentCarta(idUser);
}

