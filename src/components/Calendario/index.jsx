import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import AgendaModal from '../AgendamentoModal';
import useSala from '../../hooks/useSala';
import SemSala from '../SemSala';
import { useAgendamentos } from '../../hooks/useAgendamentos';
import { useSalas } from '../../hooks/useSalas';

const AgendaCalendar = () => {
  const { salaSelecionada, andarSelecionado } = useSala();
  const { loading: carregandoSalas } = useSalas();
  const { agendamentos, loading: carregandoAgendamentos } = useAgendamentos();
  const [dataAtual, setDataAtual] = useState(new Date());
  const carregando = carregandoSalas || carregandoAgendamentos;
  const [mesAtivo, setMesAtivo] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [turnoModal, setTurnoModal] = useState(null);

  const turnos = [
    { id: 0, letra: 'A', horario: '08:00 - 10:00', nome: 'Manhã' },
    { id: 1, letra: 'B', horario: '10:00 - 12:00', nome: 'Manhã' },
    { id: 2, letra: 'C', horario: '13:00 - 15:00', nome: 'Tarde' },
    { id: 3, letra: 'D', horario: '15:00 - 17:00', nome: 'Tarde' },
    { id: 4, letra: 'E', horario: '18:00 - 20:00', nome: 'Noite' },
  ];

  const gerarMeses = () => {
    return Array.from({ length: 6 }, (_, i) => {
      const data = new Date();
      data.setMonth(data.getMonth() + i);
      return {
        index: i,
        nome: data.toLocaleString('pt-BR', { month: 'long' }),
        ano: data.getFullYear(),
        mes: data.getMonth(),
      };
    });
  };

  useEffect(() => {
    console.log('🔄 Agendamentos atualizados:', agendamentos.length);
  }, [agendamentos]);

  const meses = gerarMeses();

  const obterSemana = data => {
    if (!data) return [];

    const semana = [];
    const dataInicio = new Date(data);

    const diaSemana = dataInicio.getDay();
    dataInicio.setDate(dataInicio.getDate() - diaSemana);

    for (let i = 0; i < 7; i++) {
      const dia = new Date(dataInicio);
      dia.setDate(dataInicio.getDate() + i);
      semana.push(dia);
    }

    return semana;
  };

  const semanaAtual = obterSemana(dataAtual);

  const navegarSemana = direcao => {
    const novaData = new Date(dataAtual);
    novaData.setDate(novaData.getDate() + direcao * 7);
    setDataAtual(novaData);
  };

  const irParaHoje = () => {
    setDataAtual(new Date());
    setMesAtivo(0);
  };

  const obterAgendamento = (data, turnoId) => {
    if (!data) return null;

    try {
      const dataStr = data.toISOString().split('T')[0];
      return (
        agendamentos.find(
          agendamento =>
            agendamento.data === dataStr &&
            agendamento.turno === turnoId &&
            agendamento.sala_id === salaSelecionada.id,
        ) || null
      );
    } catch (error) {
      console.error('Erro ao obter agendamento:', error);
      return null;
    }
  };

  const verificaData = data => {
    if (!data) return true;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataParaComparar = new Date(data);
    dataParaComparar.setHours(0, 0, 0, 0);

    return dataParaComparar <= hoje;
  };

  const abrirModal = (data, turnoId) => {
    setDataModal(data);
    setTurnoModal(turnoId);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setDataModal(null);
    setTurnoModal(null);
  };

  const ehHoje = data => {
    if (!data) return false;
    const hoje = new Date();
    return data.toDateString() === hoje.toDateString();
  };

  const ehFimDeSemana = data => {
    if (!data) return false;
    return data.getDay() === 0 || data.getDay() === 6;
  };

  if (!andarSelecionado) {
    return <SemSala />;
  }

  if (carregando) {
    return <div className={styles.loadingContainer}>Carregando...</div>;
  }

  return (
    <div
      className={`${styles.calendario} ${carregando ? styles.carregando : ''}`}
    >
      <header className={styles.cabecalho}>
        <h2 className={styles.tituloPrincipal}>
          Sala: {salaSelecionada?.descricao || '101'} | Andar:{' '}
          {andarSelecionado}
        </h2>
        <div className={styles.navegacao}>
          <button
            className={styles.botaoNavegacao}
            onClick={() => navegarSemana(-1)}
            disabled={carregando}
          >
            ‹ Semana Anterior
          </button>

          <button
            className={styles.botaoHoje}
            onClick={irParaHoje}
            disabled={carregando}
          >
            Hoje
          </button>

          <button
            className={styles.botaoNavegacao}
            onClick={() => navegarSemana(1)}
            disabled={carregando}
          >
            Próxima Semana ›
          </button>
        </div>

        <h2 className={styles.tituloMes}>
          {dataAtual.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric',
          })}
          {carregando && ' (Carregando...)'}
        </h2>
      </header>

      <nav className={styles.abasMeses}>
        {meses.map(mes => (
          <button
            key={mes.index}
            className={`${styles.aba} ${
              mesAtivo === mes.index ? styles.abaAtiva : ''
            }`}
            onClick={() => {
              const novaData = new Date();
              novaData.setMonth(novaData.getMonth() + mes.index);
              setDataAtual(novaData);
              setMesAtivo(mes.index);
            }}
            disabled={carregando}
          >
            {mes.nome} {mes.ano}
          </button>
        ))}
      </nav>

      <div className={styles.calendarioGrid}>
        <div className={styles.diasCabecalho}>
          <div className={styles.turnoVazio}></div>
          {semanaAtual.map((data, index) => (
            <div
              key={index}
              className={`${styles.diaCabecalho} ${
                ehHoje(data) ? styles.hoje : ''
              } ${ehFimDeSemana(data) ? styles.fimDeSemana : ''}`}
            >
              <div className={styles.diaNome}>
                {data.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className={styles.diaNumero}>{data.getDate()}</div>
              <div className={styles.diaMes}>
                {data.toLocaleDateString('pt-BR', { month: 'short' })}
              </div>
            </div>
          ))}
        </div>

        {turnos.map(turno => (
          <div key={turno.id} className={styles.linhaTurno}>
            <div className={styles.turnoCabecalho}>
              <div className={styles.turnoId}>{turno.letra}</div>
              <div className={styles.turnoHorario}>{turno.horario}</div>
              <div className={styles.turnoNome}>{turno.nome}</div>
            </div>

            {semanaAtual.map((data, diaIndex) => {
              const agendamento = obterAgendamento(data, turno.letra);
              return (
                <div
                  key={diaIndex}
                  className={`${styles.celulaDia} ${
                    ehHoje(data) ? styles.hoje : ''
                  } ${ehFimDeSemana(data) ? styles.fimDeSemana : ''}`}
                >
                  {agendamento ? (
                    <div
                      className={styles.agendamento}
                      onClick={() => abrirModal(data, turno.letra)}
                    >
                      <div className={styles.agendamentoSala}>
                        Sala {agendamento.sala}
                      </div>
                      <div className={styles.agendamentoCliente}>
                        {agendamento.descricao}
                      </div>
                      <div className={styles.agendamentoEmpresa}>
                        Turno {turno.letra}
                      </div>
                    </div>
                  ) : (
                    <button
                      className={styles.botaoAgendar}
                      onClick={() => abrirModal(data, turno.id)}
                      disabled={carregando || verificaData(data)}
                    >
                      {carregando ? '...' : 'Agendar'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <AgendaModal
        isOpen={modalAberto}
        onClose={fecharModal}
        dataSelecionada={dataModal}
        turnoSelecionado={turnoModal}
        agendamentoExistente={
          dataModal ? obterAgendamento(dataModal, turnoModal) : null
        }
      />

      {carregando && (
        <div className={styles.vazio}>Carregando agendamentos...</div>
      )}

      {!carregando && agendamentos.length === 0 && (
        <div className={styles.vazio}>
          Nenhum agendamento encontrado para esta semana.
        </div>
      )}
    </div>
  );
};

export default AgendaCalendar;
