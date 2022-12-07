import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import HDPagInicial from "../../../../components/header/paginicial";
import { useState } from "react";
import { filtro } from './../../../../components/Filter/filtro';
import { parseCookies } from 'nookies';
/* 
Função getServerSideProps
É a função que realiza o fetch(busca), dos dados na api, convertendo-os em dados que podem ser utilizados por outros componentes dentro do arquivo
Sua primeira variável, response, é a que realiza a conexão e chama os dados para si mesma
A segunda variável, attributes, coleta os dados da variável response e os converte para objeto
Por fim, a função retorna em um objeto a variável attributes para ser utilizada em outros componentes
*/

export const getServerSideProps = async (context) => {
  const cookies = parseCookies(context)
  const response = await axios.get(process.env.URL_API + "/docente");
  const attributes = await response.data;
  return {
    props: {
      attributes,
      Auth : cookies.usuario || null
    },
  };
};

/* 
Função TodosDocentes
A função principal é a que renderiza o conteúdo inserido nela, porém antes de se retornar algo, foi inserido um tratamento para realizar a paginação

Explicar Paginação

Por fim a função retorna o HTML contendo a tabela que irá conter os dados trazidos da função getServerSideProps, junto à paginação

*/

export default function TodosDocentes({ attributes, Auth }) {
  const [consulta, setConsulta] = useState("");
  const [itensporPagina, setItensporPagina] = useState(10);
  const [paginasRecorrentes, setPaginasRecorrentes] = useState(0);

  const keys = ["nome"];


  const consultaGeral = consulta.toLowerCase();
  const paginas = Math.ceil(filtro(attributes, keys, consultaGeral).length / itensporPagina);
  const startIndex = paginasRecorrentes * itensporPagina;
  const endIndex = startIndex + itensporPagina;
  const docentesfiltrados = filtro(attributes, keys, consultaGeral).slice(startIndex, endIndex);

  return (
    <div className="container-fluid g-0">
      <Head>
        <title>Lista de Docentes</title>
      </Head>
      <HDPagInicial Auth={Auth} />
      <div className="container border rounded p-3 mt-2 w-50">
        <div className="container">
          <form className="d-flex" role="search">
            <input
              className="form-control filtro"
              type="search"
              placeholder="Pesquisar"
              aria-label="Search"
              onChange={(e) => setConsulta(e.target.value)}
            />
          </form>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
            </tr>
          </thead>
          <tbody>
            {docentesfiltrados.map(
              ({ id, nome, email, cpf, data_nascimento, formacao }) => (
                <tr key={id}>
                  <td>
                    <Link href={`/posts/user/solo/docente/${id}`}>
                      <a className="list-group-item">{nome}</a>
                    </Link>
                  </td>
                  <td>{email}</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <center>
          <div>
            {Array.from(Array(paginas), (docentesfiltrados, index) => {
              return (
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  key={index}
                  value={index}
                  onClick={(e) => setPaginasRecorrentes(Number(e.target.value))}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </center>
        <center>
          <form>
            <span>Professores por página: </span>

            <select onChange={(e) => setItensporPagina(Number(e.target.value))}>
              <option value={5}>5</option>
              <option selected value={10}>
                10
              </option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </form>
        </center>
      </div>
    </div>
  );
}
