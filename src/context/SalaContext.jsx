import React, { createContext, useEffect, useState } from 'react';
import { useSalas } from '../hooks/useSalas';

const SalaContext = createContext();

const SalaProvider = ({ children }) => {
  const { salas } = useSalas();
  const [andarSelecionado, setAndarSelecionado] = useState(1);
  const [salaSelecionada, setSalaSelecionada] = useState(
    salas ? salas[0]?.id : null,
  );

  useEffect(() => {
    if (salas && salas.length > 0 && !salaSelecionada) {
      setSalaSelecionada(salas[0]);
    }
  }, [salas, salaSelecionada]);

  const selecionarSala = sala => {
    setSalaSelecionada(sala);
  };

  const selecionarAndar = andar => {
    setAndarSelecionado(andar);
    setSalaSelecionada(`${andar}01`);
  };

  const limparSelecao = () => {
    setSalaSelecionada(null);
    setAndarSelecionado('');
  };

  const value = {
    salaSelecionada,
    andarSelecionado,
    selecionarSala,
    selecionarAndar,
    limparSelecao,
    temSelecao: !!salaSelecionada || !!andarSelecionado,
  };

  return <SalaContext.Provider value={value}>{children}</SalaContext.Provider>;
};

export { SalaProvider };
export default SalaContext;
