import { useState, useEffect } from 'react';
import { agendamentoService } from '../services/api';
import { toast } from 'react-toastify';
export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarAgendamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await agendamentoService.getAll();

      const agendamentosData = response.data || [];
      setAgendamentos(agendamentosData);

      if (!response.success) {
        setError(response.message || 'Erro ao carregar agendamentos');
      }
    } catch (err) {
      setError('Erro ao carregar agendamentos');
      console.error('Erro:', err);
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const criarAgendamento = async agendamentoData => {
    try {
      const response = await agendamentoService.create(agendamentoData);
      toast.success('Agendamento criado com sucesso!');
      await carregarAgendamentos();
      return response;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || 'Erro ao criar agendamento',
      );
    }
  };

  const atualizarAgendamento = async (id, agendamentoData) => {
    try {
      const response = await agendamentoService.update(id, agendamentoData);
      toast.success('Agendamento atualizado com sucesso!');

      await carregarAgendamentos();
      return response;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || 'Erro ao atualizar agendamento',
      );
    }
  };

  const deletarAgendamento = async id => {
    try {
      await agendamentoService.delete(id);
      toast.success('Agendamento deletado com sucesso!');
    } catch (err) {
      throw new Error(
        err.response?.data?.message || 'Erro ao deletar agendamento',
        console.log(err),
      );
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  return {
    agendamentos,
    loading,
    error,
    carregarAgendamentos,
    criarAgendamento,
    atualizarAgendamento,
    deletarAgendamento,
  };
};
