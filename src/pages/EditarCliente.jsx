import { Form, useNavigate, useLoaderData, useActionData, redirect} from 'react-router-dom'
import { actualizarCliente } from '../data/clientes'
import { obtenerCliente } from '../data/clientes'
import Error from '../components/Error'
import Formulario from '../components/Formulario'

export async function loader({params}) {
    const cliente = await obtenerCliente(params.clienteId)
    if (Object.values(cliente).length === 0) {
        throw new Response('', {
            status: 404,
            statusText: 'No Hay Resultados'
        })
    }
    return cliente
}

export async function action({request,params}) {
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
    // Actualizar Cliente
   await actualizarCliente(params.clienteId, datos)
    // Redirect cuando se usen actions y loaders
  return redirect('/')
}

const EditarCliente = () => {
    const navigate = useNavigate()
    const cliente = useLoaderData()
    const errores = useActionData()

  return (
    <>
        <div className="font-black text-4xl text-blue-900">
            Editar Cliente
        </div>
        <p className="mt-3"> 
            A continuacion puedes modificar los datos de un cliente.
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
            <Formulario
            cliente={cliente}
            />

            <input 
              type="submit"
              className="mt-5 w-full bg-blue-800 uppercase font-bold text-white text-lg hover:bg-blue-900 hover:cursor-pointer"
              value="Guardar Cambios"
              />
          </Form>
        </div>
    </>

  )
}

export default EditarCliente