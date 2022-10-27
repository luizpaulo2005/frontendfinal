import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import HDPagAdmin from "../../../components/header/pagadmin";
import Link from "next/link";
import FooterTable from "../../../components/footer/footertable";

export const getStaticProps = async () => {
    const response = await axios.get('https://databasebibliotecadigital.undertak3r.repl.co/campus');
    const campus = await response.data;
    return{
        props: {
            campus
        },
        revalidate: 300
    }
}

export default function TodosCampusAdmin({campus}){

let router = useRouter();

const [consulta, setConsulta] = useState("")
const [itensporPagina, setItensporPagina] = useState(10)
const [paginasRecorrentes, setPaginasRecorrentes] = useState(0)

const keys = ["nome"]

const filtro = (item) => {
  return item.filter((item) => keys.some(key=>item[key].toLowerCase().includes(consultaGeral)))
}

const consultaGeral = consulta.toLowerCase()
const paginas = Math.ceil(filtro(campus).length / itensporPagina)
const startIndex = paginasRecorrentes * itensporPagina
const endIndex = startIndex + itensporPagina
const campusfiltrado = filtro(campus).slice(startIndex, endIndex)

const handleDelete = async (e) => {
    e.preventDefault();
    const { id } = e.target
    const data = {
      id: Number(id)
    }
    const response = await axios.delete(`https://databasebibliotecadigital.undertak3r.repl.co/campus/${id}`)
    if (!response.statusText === "OK") {
        toast.error("Erro ao excluir o campus");
      } else {
        router.push('/posts/admin/todos/campus')
        toast.success("Campus excluído com sucesso")
      }
    }

    return(
        <div className="container-fluid g-0">
            <Head>
                <title>Lista de Campus</title>
            </Head>
            <HDPagAdmin/>
            <ToastContainer/>
            <div className="container mt-2">
              <form className="d-flex" role="search">
               <input className="form-control filtro" type="search" placeholder="Pesquisar" aria-label="Search"  onChange={(e) => setConsulta(e.target.value)} />
             </form>
            </div>
            <div className="container border rounded mt-2 p-3 w-50">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th className="d-flex justify-content-end">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                    {campusfiltrado.map(({id, nome})=>(
                        <tr key={id}>
                            <th scope="row">{id}</th>
                            <td><Link href={`/posts/admin/solo/campus/${id}`}><a className="list-group-item">{nome}</a></Link></td>
                            <td className="d-flex justify-content-end">
                            <Link href={`/posts/admin/alterar/campus/${id}`}><button className="btn btn-sm btn-secondary me-1">Alterar</button></Link>
                            <button className="btn btn-sm btn-danger" onClick={handleDelete} id={id}>Apagar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>                    
                </table>


                <center>

<div>{Array.from(Array(paginas), (campusfiltrado, index) =>{
return <button type="button" className="btn btn-outline-dark" key={index} value={index} onClick={(e) =>setPaginasRecorrentes
(Number(e.target.value))}>{index + 1}</button>})}
</div>
</center>
<center>
<form>
    <span>Campi por página: </span>       
    
  <select onChange={(e) => setItensporPagina(Number(e.target.value))}>
    <option value={5}>5</option>
    <option selected value={10}>10</option>
    <option value={20}>20</option>
    <option value={50}>50</option>
  </select>
</form>
</center>
            </div>
              <FooterTable/>
        </div>
    )
}