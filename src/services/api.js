import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  config => {
    console.log(
      `🔄 Fazendo requisição: ${config.method?.toUpperCase()} ${config.url}`,
    );
    return config;
  },
  error => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    console.log(`✅ Resposta recebida: ${response.status}`);
    return response;
  },
  error => {
    console.error('❌ Erro na resposta:', error);

    if (error.code === 'ECONNREFUSED') {
      error.message =
        'Servidor indisponível. Verifique se o backend está rodando.';
    } else if (error.response?.status === 404) {
      error.message = 'Endpoint não encontrado.';
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  },
);

export const agendamentoService = {
  getAll: async () => {
    try {
      const response = await api.get('/agendamentos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async id => {
    try {
      const response = await api.get(`/agendamentos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar agendamento ${id}:`, error);
      throw error;
    }
  },

  create: async agendamentoData => {
    try {
      const response = await api.post('/agendamentos', agendamentoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  update: async (id, agendamentoData) => {
    try {
      const response = await api.put(`/agendamentos/${id}`, agendamentoData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar agendamento ${id}:`, error);
      throw error;
    }
  },

  delete: async id => {
    try {
      const response = await api.delete(`/agendamentos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar agendamento ${id}:`, error);
      throw error;
    }
  },
};

export const andarService = {
  getAllAndares: async () => {
    try {
      const response = await api.get('/andares');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar andares:', error);
      throw error;
    }
  },

  getAndar: async andar => {
    try {
      const response = await api.get(`/andares/${encodeURIComponent(andar)}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar andar ${andar}:`, error);
      throw error;
    }
  },
};

export const salaService = {
  getSala: async id => {
    try {
      const response = await api.get(`/salas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar sala ${id}:`, error);
      throw error;
    }
  },

  getDisponibilidade: async (id, data) => {
    try {
      const response = await api.get(
        `/salas/${id}/disponibilidade?data=${data}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao verificar disponibilidade da sala ${id}:`, error);
      throw error;
    }
  },
};

export const salasMock = [
  {
    id: 'mock-101',
    descricao: '101',
    andar: '1º Andar',
    capacidade: 10,
    status: 0,
  },
  {
    id: 'mock-102',
    descricao: '102',
    andar: '1º Andar',
    capacidade: 12,
    status: 0,
  },
  {
    id: 'mock-103',
    descricao: '103',
    andar: '1º Andar',
    capacidade: 8,
    status: 0,
  },
  {
    id: 'mock-104',
    descricao: '104',
    andar: '1º Andar',
    capacidade: 15,
    status: 1,
  },
  {
    id: 'mock-105',
    descricao: '105',
    andar: '1º Andar',
    capacidade: 20,
    status: 0,
  },

  {
    id: 'mock-201',
    descricao: '201',
    andar: '2º Andar',
    capacidade: 25,
    status: 0,
  },
  {
    id: 'mock-202',
    descricao: '202',
    andar: '2º Andar',
    capacidade: 30,
    status: 0,
  },
  {
    id: 'mock-203',
    descricao: '203',
    andar: '2º Andar',
    capacidade: 12,
    status: 2,
  },
  {
    id: 'mock-204',
    descricao: '204',
    andar: '2º Andar',
    capacidade: 18,
    status: 0,
  },
  {
    id: 'mock-205',
    descricao: '205',
    andar: '2º Andar',
    capacidade: 22,
    status: 0,
  },

  {
    id: 'mock-301',
    descricao: '301',
    andar: '3º Andar',
    capacidade: 35,
    status: 0,
  },
  {
    id: 'mock-302',
    descricao: '302',
    andar: '3º Andar',
    capacidade: 40,
    status: 0,
  },
  {
    id: 'mock-303',
    descricao: '303',
    andar: '3º Andar',
    capacidade: 28,
    status: 0,
  },
  {
    id: 'mock-304',
    descricao: '304',
    andar: '3º Andar',
    capacidade: 32,
    status: 1,
  },
  {
    id: 'mock-305',
    descricao: '305',
    andar: '3º Andar',
    capacidade: 45,
    status: 0,
  },

  {
    id: 'mock-401',
    descricao: '401',
    andar: '4º Andar',
    capacidade: 50,
    status: 0,
  },
  {
    id: 'mock-402',
    descricao: '402',
    andar: '4º Andar',
    capacidade: 55,
    status: 0,
  },
  {
    id: 'mock-403',
    descricao: '403',
    andar: '4º Andar',
    capacidade: 38,
    status: 0,
  },
  {
    id: 'mock-404',
    descricao: '404',
    andar: '4º Andar',
    capacidade: 42,
    status: 2,
  },
  {
    id: 'mock-405',
    descricao: '405',
    andar: '4º Andar',
    capacidade: 48,
    status: 0,
  },

  {
    id: 'mock-501',
    descricao: '501',
    andar: '5º Andar',
    capacidade: 60,
    status: 0,
  },
  {
    id: 'mock-502',
    descricao: '502',
    andar: '5º Andar',
    capacidade: 65,
    status: 0,
  },
  {
    id: 'mock-503',
    descricao: '503',
    andar: '5º Andar',
    capacidade: 52,
    status: 0,
  },
  {
    id: 'mock-504',
    descricao: '504',
    andar: '5º Andar',
    capacidade: 58,
    status: 1,
  },
  {
    id: 'mock-505',
    descricao: '505',
    andar: '5º Andar',
    capacidade: 70,
    status: 0,
  },
];

export const getSalasDisponiveis = () => {
  return salasMock.filter(sala => sala.status === 0);
};

export const getSalaById = id => {
  return salasMock.find(sala => sala.id === id);
};

export const turnos = [
  { value: 0, label: 'Manhã' },
  { value: 1, label: 'Tarde' },
  { value: 2, label: 'Noite' },
];

export const getTurnoLabel = turnoValue => {
  const turno = turnos.find(t => t.value === turnoValue);
  return turno ? turno.label : 'Turno desconhecido';
};

export const horarios = [
  { value: 0, label: 'A (08:00-09:00)' },
  { value: 1, label: 'B (09:00-10:00)' },
  { value: 2, label: 'C (10:00-11:00)' },
  { value: 3, label: 'D (14:00-15:00)' },
  { value: 4, label: 'E (15:00-16:00)' },
  { value: 5, label: 'F (16:00-17:00)' },
];

export const getHorarioLabel = horarioValue => {
  const horario = horarios.find(h => h.value === horarioValue);
  return horario ? horario.label : 'Horário desconhecido';
};

export const formatDate = dateString => {
  if (!dateString) return 'Data inválida';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

export const validateAgendamentoData = agendamentoData => {
  const errors = [];

  if (!agendamentoData.sala_id) {
    errors.push('Sala é obrigatória');
  }

  if (!agendamentoData.data) {
    errors.push('Data é obrigatória');
  } else {
    const data = new Date(agendamentoData.data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (data < hoje) {
      errors.push('Data não pode ser no passado');
    }
  }

  if (agendamentoData.turno === undefined || agendamentoData.turno === null) {
    errors.push('Turno é obrigatório');
  } else if (agendamentoData.turno < 0 || agendamentoData.turno > 2) {
    errors.push('Turno inválido');
  }

  if (
    agendamentoData.horario === undefined ||
    agendamentoData.horario === null
  ) {
    errors.push('Horário é obrigatório');
  } else if (agendamentoData.horario < 0 || agendamentoData.horario > 5) {
    errors.push('Horário inválido');
  }

  if (!agendamentoData.descricao || agendamentoData.descricao.trim() === '') {
    errors.push('Descrição é obrigatória');
  } else if (agendamentoData.descricao.trim().length < 5) {
    errors.push('Descrição deve ter pelo menos 5 caracteres');
  }

  return errors;
};

export const salaStatus = [
  { value: 0, label: 'Ativa', color: 'green' },
  { value: 1, label: 'Inativa', color: 'red' },
  { value: 2, label: 'Em Manutenção', color: 'orange' },
];

export const getSalaStatusLabel = statusValue => {
  const status = salaStatus.find(s => s.value === statusValue);
  return status ? status.label : 'Status desconhecido';
};

export default api;
