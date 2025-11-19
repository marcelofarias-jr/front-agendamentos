import { useContext } from 'react';
import SalaContext from '../context/SalaContext';

const useSala = () => {
  const context = useContext(SalaContext);
  if (!context) {
    throw new Error('useSala deve ser usado dentro de um SalaProvider');
  }
  return context;
};

export default useSala;
