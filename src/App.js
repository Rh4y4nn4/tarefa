import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import './App.css';

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");
  const [post, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuario, setUsuario] = useState(null);

  // Função para adicionar uma nova tarefa
  async function adicionarPosts() {
    if (!usuario) {
      alert("Você precisa estar logado para adicionar uma tarefa.");
      return;
    }

    await addDoc(collection(db, "tarefa"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Tarefa criada com sucesso");
        setAutor("");
        setTitulo("");
        buscarPost(); // Atualizar a lista de tarefas após adicionar
      })
      .catch((error) => {
        console.log("ERRO AO CRIAR: " + error);
      });
  }

  // Função para buscar todos as tarefas
  async function buscarPost() {
    const dados = collection(db, "tarefa");

    await getDocs(dados)
      .then((snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setPosts(listaPost);
      })
      .catch((error) => {
        console.log("Erro ao buscar tarefas: " + error);
      });
  }

  // Função para editar uma tarefa existente
  async function editarPost() {
    if (!usuario) {
      alert("Você precisa estar logado para editar uma tarefa.");
      return;
    }

    const postEditado = doc(db, "tarefa", idPost);

    await updateDoc(postEditado, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Tarefa editada com sucesso!");
        setIdPost("");
        setTitulo("");
        setAutor("");
        buscarPost(); // Atualiza a lista de tarefas após editar
      })
      .catch((error) => {
        console.log("Erro ao editar tarefa: " + error);
      });
  }

  // Função para excluir uma tarefa existente
  async function excluirPost(id) {
    if (!usuario) {
      alert("Você precisa estar logado para excluir uma tarefa.");
      return;
    }

    const postExcluido = doc(db, "tarefa", id);

    await deleteDoc(postExcluido)
      .then(() => {
        alert("Tarefa excluída com sucesso!!");
        buscarPost(); // Atualiza a lista de tarefas após excluir
      })
      .catch((error) => {
        console.log("Erro ao excluir tarefa: " + error);
      });
  }

  // Função para criar um novo usuário
  async function registrarUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        console.error("Erro ao registrar: ", error);
      });
  }

  // Função para fazer login
  async function loginUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        setEmail("");
        setSenha("");
        // Usuário logado
        setUsuario(userCredential.user);
      })
      .catch((error) => {
        console.error("Erro ao fazer login: ", error);
      });
  }

  // Função para fazer logout
  async function logoutUsuario() {
    await signOut(auth)
      .then(() => {
        setUsuario(null);
      })
      .catch((error) => {
        console.error("Erro ao fazer logout: ", error);
      });
  }

  // Monitorar o estado de autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
      } else {
        setUsuario(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Carregar tarefas assim que o componente for montado
  useEffect(() => {
    buscarPost();
  }, []);

  return (
    <div className="container">
      <h1>React JS + Firebase - Gerenciador de Tarefas</h1>

      {usuario ? (
        <div>
          <p>Bem-vindo, {usuario.email}!</p>
          <button onClick={logoutUsuario}>Sair</button>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Insira seu email"
          />
          <br />

          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Insira sua senha"
          />
          <br />

          <button onClick={registrarUsuario}>Registrar</button>
          <button onClick={loginUsuario}>Login</button>
        </div>
      )}

      <hr />
      <h2>Tarefas</h2>

      {usuario && (
        <div>
          <label>ID da Tarefa (somente para edição):</label>
          <input
            placeholder="ID da Tarefa"
            value={idPost}
            onChange={(e) => setIdPost(e.target.value)}
          />
          <br />

          <label>Título da Tarefa:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
          />
          <br />

          <label>Descrição da Tarefa:</label>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Autor"
          />
          <br />

          <button onClick={adicionarPosts}>Adicionar Tarefa</button>
          <button onClick={editarPost}>Editar Tarefa</button>
        </div>
      )}

      <ul>
        {post.map((post) => (
          <li key={post.id}>
            <strong>ID: {post.id}</strong>
            <br />
            <strong>Título: {post.titulo}</strong>
            <br />
            <strong>Descrição: {post.autor}</strong>
            <br />
            {usuario && <button onClick={() => excluirPost(post.id)}>Excluir</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
