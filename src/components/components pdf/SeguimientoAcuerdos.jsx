"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/config/config';

function SeguimientoAcuerdos(props) {
  const tamaño = props.data && props.data.usuario_id ? props.data.usuario_id.length : 0;
  const tamAcuerdos = props.dataAcu;

  const estatusAcuerdos = tamAcuerdos.map((acuerdo) => {
    return acuerdo;
  });

  const [usuarioData, setUsuariosData] = useState([]);
  
  useEffect(() => {
    const fetchUsuario = async (id) => {
      try {
        const response = await axios.get(`${ apiUrl }/users/${id}`);
        return response.data?.nombre + ' ' + response.data?.apellido_paterno + ' ' + response.data?.apellido_materno;
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUsuariosData = async () => {
      try {
        const promises = props.dataAcu.map((item) => {
          return fetchUsuario(item.responsablec_id);
        });
    
        const usuariosData = await Promise.all(promises);
        setUsuariosData(usuariosData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsuariosData();
  }, [props.dataAcu]);

  const acuerdos = estatusAcuerdos.map((item, index) => {
    const className = index === 18 ? 'cuart2-bod pepe1' : index === 19 ? 'cuart2-bod pepe' : 'cuart2-bod';

    if (usuarioData) {
      return (
        <div className={className} id={index === 18 ? 'elementoSiguiente2' : null} key={index}>
          <div className='centercontent'>{item.acuerdo}</div>
          <div className='centercontent'>{usuarioData[index]}</div>
          <div className='centercontent noborder'>{item.fecha}</div>
        </div>
      );
    }
  });

  const renderizadoCondicionado =
    tamAcuerdos >= 15 ||
    (tamaño >= 17 && tamAcuerdos >= 20) ||
    (tamaño >= 27 && tamaño < 30)
      ? 'pepe1'
      : (tamaño >= 12 && tamaño < 15) || (tamaño >= 18 && tamAcuerdos >= 10) || tamaño >= 30
      ? 'pepe'
      : '';

  return (
    <div className={`contenedor ${renderizadoCondicionado}`} id={tamAcuerdos >= 15 ? 'elementoSiguiente2' : null}>
      <div className='cont1'>
        <h3>COMPROMISOS ASUMIDOS</h3>
      </div>
      <div className='cuart-cont2'>
        <div className='cuart1-cab'>
          <div className='center'>
            <h5>TAREA/ACTIVIDAD</h5>
          </div>
          <div className='center'>
            <h5>RESPONSABLE</h5>
          </div>
          <div className='center noborder'>
            <h5>FECHA ENTREGA</h5>
          </div>
        </div>
        {acuerdos}
      </div>
    </div>
  );
}

export default SeguimientoAcuerdos;
