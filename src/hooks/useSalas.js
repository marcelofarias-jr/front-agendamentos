import { useState, useEffect } from 'react';
import { andarService } from '../services/api';

export const useSalas = () => {
  const [salas, setSalas] = useState([]);
  const [andares, setAndares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarSalas = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await andarService.getAllAndares();

      if (response.success) {
        const todasSalas = response.data.flatMap(andar =>
          andar.salas.map(sala => ({
            ...sala,
            andar: andar.andar,
          })),
        );

        setSalas(todasSalas);
        setAndares(response.data);
      }
    } catch (err) {
      setError('Erro ao carregar salas');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSalas();
  }, []);

  return {
    salas,
    andares,
    loading,
    error,
    carregarSalas,
    salasDisponiveis: salas.filter(sala => sala.status === 0),
    salasPorAndar: andar => salas.filter(sala => sala.andar === andar),
    getSalaById: id => salas.find(sala => sala.id === id),
  };
};
