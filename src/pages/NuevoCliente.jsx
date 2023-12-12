import { useNavigate, Form, useActionData, redirect } from "react-router-dom"
import Formulario from "../components/Formulario"
import Error from "../components/Error"
import { agregarCliente } from "../data/clientes"
export async function action({request}) {
  const formData = await request.formData()

  const datos = Object.fromEntries(formData)
  console.log(datos)

  const email = formData.get("email")

  const errores = []
  if (Object.values(datos).includes('')) {
    errores.push('Todos los campos son obligatorios')
  }
  let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
  if (!regex.test(email)){
    errores.push('El email no es valido')
  }

  if (Object.keys(errores).length) {
    return errores
  }
  
 await agregarCliente(datos)
  // Redirect cuando se usen actions y loaders
return redirect('/')

}
const NuevoCliente = () => {
  const errores = useActionData()
  const navigate = useNavigate()
  console.log(errores)
  return (
    <>
        <div className="font-black text-4xl text-blue-900">
            Nuevlo Cliente
        </div>
        <p className="mt-3"> 
            Llena todos los campos para registrar nuevo cliente
        </p>    
        <div className="flex justify-end">
          <button className="bg-blue-800 text-white px-3 font-bold uppercase"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
        <div className="bg-white shadow rounded-md md:w-3/4 px-5 py-10  mt-20">
          {errores?.length && errores.map( (error, i) => <Error key={i}> {error} </Error> ) }
          <Form 
            method="POST"
            action="/clientes/nuevo"
            noValidate
          >
            <Formulario/>

            <input 
              type="submit"
              className="mt-5 w-full bg-blue-800 uppercase font-bold text-white text-lg hover:bg-blue-900 hover:cursor-pointer"
              value="Registrar Cliente"
              />
          </Form>
        </div>
    </>
  )
}

export default NuevoCliente