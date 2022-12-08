import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import Login from "../login/login";
import {AuthContext} from "../../../../components/AuthContext&ReducerContext/AuthFunctions"
import { parseCookies } from 'nookies';
import HeaderAdmin from "../../../../components/header_admin";

export const getServerSideProps=(context)=>{
  const cookies= parseCookies(context)
//constante reponsável por armazenar os cookies
  return{
    props : {
      Auth: cookies.usuario || null
      //Se houver cookies vai ser passado o valor para o Auth, se não, vai ser dado como nulo e não terá um usuário disponível
    }
  }
}
 //está função é responsável por pegar os cookies se houver, para que a páginaAdmin fique disponivel para uso

export default function CadastrarCampus({Auth}) {
 
  const usuario = Auth
  // essa constante é resposanvel por armazenar os status do usuário

//Aqui temos uma função que é responsável por analizar o status do usuário, se houver um usuário, A página sera renderizada normalmente
//Se não houver um usuário será renderizada a página de Login
  const Protecaoderota = () =>{
    const [campus, setCampus] = useState({
      nome: "",
      cidade: "",
      estado: "",
      email: "",
    });
  
    let router = useRouter();
  
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const emptyFieldCheck = Object.values(campus).some(
        (element) => element === ""
      );
      if (emptyFieldCheck) {
        toast.error("Há algum campo vazio");
        return;
      }
      const data = {
        ...campus,
      };
  
      const response = await axios.post(process.env.URL_API + "/campus", data);
  
      if (!response.statusText === "OK") {
        toast.error("Erro ao cadastrar o campus");
      } else {
        toast.success("Campus adicionado com sucesso");
        router.push("/posts/admin/todos/campus");
      }
    };
    const handleInputChange = (e) => {
      const { id, value } = e.target;
      setCampus({ ...campus, [id]: value });
    };
  
    const { nome, cidade, estado, email } = campus;

return usuario ? ( <div className="container-fluid g-0">
<Head>
  <title>Cadastrar Campus</title>
</Head>
<HeaderAdmin />
<ToastContainer />
<div className="container border rounded mt-2 p-3">
  <form onSubmit={handleSubmit}>
    <fieldset>
      <legend>Cadastro de Campus</legend>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Nome
        </span>
        <input
          id="nome"
          type="text"
          className="form-control"
          onChange={handleInputChange}
          value={campus.nome}
          aria-label="Nome"
          aria-describedby="basic-addon1"
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Cidade
        </span>
        <input
          id="cidade"
          type="text"
          className="form-control"
          onChange={handleInputChange}
          value={campus.cidade}
          aria-label="Cidade"
          aria-describedby="basic-addon1"
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Estado
        </span>
        <input
          id="estado"
          list="estados"
          type="text"
          className="form-control"
          onChange={handleInputChange}
          value={campus.estado}
          aria-label="Estado"
          aria-describedby="basic-addon1"
        />
      </div>

      <datalist id="estados">
        <option value="AC">Acre</option>
        <option value="AL">Alagoas</option>
        <option value="AP">Amapá</option>
        <option value="AM">Amazonas</option>
        <option value="BA">Bahia</option>
        <option value="CE">Ceará</option>
        <option value="DF">Distrito Federal</option>
        <option value="ES">Espírito Santo</option>
        <option value="GO">Goiás</option>
        <option value="MA">Maranhão</option>
        <option value="MT">Mato Grosso</option>
        <option value="MS">Mato Grosso do Sul</option>
        <option value="MG">Minas Gerais</option>
        <option value="PA">Pará</option>
        <option value="PB">Paraíba</option>
        <option value="PR">Paraná</option>
        <option value="PE">Pernambuco</option>
        <option value="PI">Piauí</option>
        <option value="RJ">Rio de Janeiro</option>
        <option value="RN">Rio Grande do Norte</option>
        <option value="RS">Rio Grande do Sul</option>
        <option value="RO">Rondônia</option>
        <option value="RR">Roraima</option>
        <option value="SC">Santa Catarina</option>
        <option value="SP">São Paulo</option>
        <option value="SE">Sergipe</option>
        <option value="TO">Tocantins</option>
      </datalist>

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          E-mail
        </span>
        <input
          id="email"
          type="email"
          className="form-control"
          onChange={handleInputChange}
          value={campus.email}
          aria-label="E-mail"
          aria-describedby="basic-addon1"
        />
      </div>
      <button type="submit" className="btn btn-success">
        Cadastrar
      </button>
    </fieldset>
  </form>
</div>
</div>) : (<Login/>)
  }
  return (
   <Protecaoderota></Protecaoderota>
  );
}
