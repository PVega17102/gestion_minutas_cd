"use client"

import { useState, useEffect, Suspense } from "react";
import EditText from "@/components/rich_text";
import "@/styles/seguimiento.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Button, Icon, Subtitle, Tab, TabGroup, TabList, TextInput } from "@tremor/react";
import { ArrowUturnLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { apiUrl } from "@/config/config";
import Loading from "./loading";


const NuevaMinutas = ({ params }) => {
  const router = useRouter();
  const idFromSession = sessionStorage.getItem('idUser');

  const { idA } = params;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/agreement/${idA}`);
        setAcuerdoData(response.data);
        setFormData(response.data);
        setEditableDescription(response.data.descripcion);

        const minuta = await axios.get(`${ apiUrl }/minutes/${response.data.minuta_id}`);
        setMinutaData(minuta.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [idA]);

  const [ acuerdoData, setAcuerdoData ] = useState(null);
  const [ formData, setFormData ] = useState({
    asunto: "",
    responsablec_id: "",
    responsabler_id: "",
    acuerdo: "",
    fecha: "",
    descripcion: "",
    estatus: ""
  });
  const [ editableDescription, setEditableDescription ] = useState('');
  const [ minutaData, setMinutaData ] = useState(null);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const response = await axios.put(`${ apiUrl }/agreement/${idA}`, {
        ...formData,
        descripcion: editableDescription
      });
      if (response) {
        Swal.fire({
          title: 'Acuerdo Actualizado',
          text: 'Se ha actualizado correctamente el seguimiento del Acuerdo.',
          icon: 'success',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#22C55E'
        }).then(
          router.back()
        )
      }else{
        Swal.fire({
          title: '¡Error!',
          text: 'No se guardardo la actualización del seguimiento del Acuerdo.',
          icon: 'error',
          showCancelButton: true,
          cancelButtonText: "Cerrar",
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: '¡Error!',
        text: 'Ocurrió un error al actualizar el seguimiento del Acuerdo.',
        icon: 'error',
        showCancelButton: true,
        cancelButtonText: "Cerrar",
        showConfirmButton: false
      });
    }
  };

  if (acuerdoData && minutaData) {
    return (
      <>

        <Icon className='w-10 h-10 cursor-pointer' 
          icon={ ArrowUturnLeftIcon } 
          onClick={ () => router.back() } 
          variant='solid' 
          color='red'
          tooltip='Regresar'
        />

        <form className='lg:px-40 w-full px-5' onSubmit={handleSubmit}>

          <Subtitle className="mt-4">Acuerdo</Subtitle>
          <TextInput
            className='w-full mt-1'
            label='Acuerdo'
            name='acuerdo'
            placeholder='Acuerdo'
            value={acuerdoData.acuerdo}
            disabled
          />

          <Subtitle className="mt-2">Estado</Subtitle>
          <TabGroup
            onIndexChange={ (index) => {
              setFormData({ ...formData, estatus: index === 0 ? 'Terminado' : index === 1 ? 'Pendiente' : index === 2 ? 'Cancelado' : 'Pospuesto' });
            }}
            index={ formData.estatus === 'Terminado' ? 0 : formData.estatus === 'Pendiente' ? 1 : formData.estatus === 'Cancelado' ? 2 : 3 }
          >
            <TabList variant="solid">
              <Tab disabled={ minutaData.responsable === idFromSession ? false : true }>Terminado</Tab>
              <Tab disabled={ minutaData.responsable === idFromSession ? false : true }>Pendiente</Tab>
              <Tab disabled={ minutaData.responsable === idFromSession ? false : true }>Cancelado</Tab>
              <Tab disabled={ minutaData.responsable === idFromSession ? false : true }>Pospuesto</Tab>
            </TabList>
          </TabGroup>

          <Subtitle className="mt-2">Descripcion</Subtitle>

          <Suspense fallback={<Loading/>}>
            <EditText value={ editableDescription } setValue={ setEditableDescription } read={ minutaData.responsable === idFromSession ? false : true } />
          </Suspense>

          <Button
            className={minutaData.responsable === idFromSession ? `w-full mt-4` : `hidden`}
            type='submit'
            color='green'
            icon={ PaperAirplaneIcon }
            iconPosition='right'
          >
            Guardar
          </Button>
        </form>
      </>
    );
  }

  return null;
};

export default NuevaMinutas;
