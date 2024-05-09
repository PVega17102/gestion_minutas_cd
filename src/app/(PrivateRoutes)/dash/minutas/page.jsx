"use client"

import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { Activa } from "@/components/Minutas";
import { Finalizada } from "@/components/Minutas";
import { Metric, Divider, TextInput, Button } from "@tremor/react";
import { MagnifyingGlassCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/config/config';
import Loading from './loading';

const Minutas = () => {

  const router = useRouter();

  const idFromSession = sessionStorage.getItem('idUser');
  const [minutaData, setMinutaData] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${ apiUrl }/minutes/`);
      const reversedMinutaData = response.data.reverse();
      setMinutaData(reversedMinutaData); 
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMinutaA = minutaData ? minutaData.filter(u => u.tema && u.tema.toLowerCase().includes(searchText.toLowerCase()) && u.estatus === "Activo" && (u.responsable === idFromSession || u.usuario_id.find(user => user === idFromSession))) : [];
  const filteredMinutaF = minutaData ? minutaData.filter(u => u.tema && u.tema.toLowerCase().includes(searchText.toLowerCase()) && u.estatus === "Inactivo" && (u.responsable === idFromSession || u.usuario_id.find(user => user === idFromSession))) : [];

  const elementosRenderizadosA = filteredMinutaA.map(u => u && u.tema && <Activa {...u} updateData={ fetchData } User={ idFromSession } />);
  const elementosRenderizadosF = filteredMinutaF.map(u => u && u.tema && <Finalizada {...u} />);

  if (minutaData) {
    return (
      <>
        <Metric>Minutas</Metric>
        <Divider />
  
        <div className='md:flex-row flex flex-col-reverse w-full gap-5'>
          <form className='flex w-full gap-2'>
            <TextInput 
              placeholder="Buscar"
              icon={MagnifyingGlassCircleIcon}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
  
          </form>
  
          <Button
            icon={ PlusCircleIcon }
            iconPosition="right"
            onClick={() => router.push('/dash/minuta/generar')}
            tooltip="Crear Minuta"
            variant='secondary'
            color='red'
          >
            Crear Minuta
          </Button>
        </div>
  
        <Metric className='mt-4 mb-2'>Activas</Metric>
        <Suspense fallback={<Loading/>}>
          {filteredMinutaA.length > 0 ? (
            <div className='md:grid lg:grid-cols-3 grid-cols-2 gap-2'>
              {React.Children.toArray(elementosRenderizadosA)}
            </div>
          ) : (
            <p>No se encontraron minutas activas asociadas.</p>
          )}
        </Suspense>
  
        <Metric className='mt-4 mb-2'>Finalizadas</Metric>
        <Suspense fallback={<Loading/>}>
          {filteredMinutaF.length > 0 ? (
            <div className='md:grid lg:grid-cols-3 grid-cols-2 gap-2'>
              {React.Children.toArray(elementosRenderizadosF)}
            </div>
          ) : (
            <p>No se encontraron minutas finalizadas asociadas.</p>
          )}
        </Suspense>
      </>
    );
  } else {
    return <Loading/>
  }
};

export default Minutas;