import React, { useCallback, useState, useEffect, useMemo } from 'react';
import styles from './styles.module.scss';
import { useSalas } from '../../hooks/useSalas';
import useSala from '../../hooks/useSala';
import { useAgendamentos } from '../../hooks/useAgendamentos';

const AgendamentoModal = ({
  isOpen,
  onClose,
  dataSelecionada,
  turnoSelecionado,
  agendamentoExistente,
}) => {
  const { salaSelecionada } = useSala();
  const {
    criarAgendamento,
    atualizarAgendamento,
    deletarAgendamento,
    carregarAgendamentos,
  } = useAgendamentos();
  const { salas } = useSalas();

  const turnos = [
    { id: 0, letra: 'A', horario: '08:00 - 10:00', nome: 'Manhã' },
    { id: 1, letra: 'B', horario: '10:00 - 12:00', nome: 'Manhã' },
    { id: 2, letra: 'C', horario: '13:00 - 15:00', nome: 'Tarde' },
    { id: 3, letra: 'D', horario: '15:00 - 17:00', nome: 'Tarde' },
    { id: 4, letra: 'E', horario: '18:00 - 20:00', nome: 'Noite' },
  ];

  const turnoObj = useMemo(() => {
    return turnoSelecionado !== undefined && turnoSelecionado !== null
      ? turnos.find(t => t.id === turnoSelecionado)
      : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnoSelecionado]);

  const formatarDataParaString = data => {
    if (!data) return '';
    if (data instanceof Date) {
      return data.toISOString().split('T')[0];
    }
    return data;
  };

  const formatarDataParaExibicao = data => {
    if (!data) return 'Não selecionada';
    if (data instanceof Date) {
      return data.toLocaleDateString('pt-BR');
    }
    try {
      return new Date(data).toLocaleDateString('pt-BR');
    } catch {
      return data;
    }
  };

  const [formData, setFormData] = useState(() => ({
    descricao: agendamentoExistente?.descricao || '',
    sala_id: agendamentoExistente?.sala_id || salaSelecionada?.id || '',
    turno: agendamentoExistente?.turno || turnoObj?.letra || '',
    horario: agendamentoExistente?.horario || turnoObj?.nome || '',
    data: formatarDataParaString(agendamentoExistente?.data || dataSelecionada),
  }));

  const [editando, setEditando] = useState(false);
  console.log('🚀 ~ AgendamentoModal ~ editando:', editando);

  useEffect(() => {
    setFormData({
      descricao: agendamentoExistente?.descricao || '',
      sala_id: agendamentoExistente?.sala_id || salaSelecionada?.id || '',
      turno: agendamentoExistente?.turno || turnoObj?.letra || '',
      horario: agendamentoExistente?.horario || turnoObj?.nome || '',
      data: formatarDataParaString(
        agendamentoExistente?.data || dataSelecionada,
      ),
    });
  }, [agendamentoExistente, salaSelecionada, turnoObj, dataSelecionada]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSalvar = async () => {
    const erros = [];

    if (!formData.descricao.trim()) {
      erros.push('Descrição é obrigatória');
    }
    if (!formData.sala_id) {
      erros.push('Sala é obrigatória');
    }
    if (!formData.data) {
      erros.push('Data é obrigatória');
    }
    if (!formData.turno) {
      erros.push('Turno é obrigatório');
    }

    if (erros.length > 0) {
      alert(erros.join('\n'));
      return;
    }

    try {
      if (agendamentoExistente) {
        await atualizarAgendamento(agendamentoExistente.id, formData);
        carregarAgendamentos();
      } else {
        await criarAgendamento(formData);
        carregarAgendamentos();
        onClose();
      }
      onClose();
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  const handleDeletar = async () => {
    if (window.confirm('Deletar agendamento?')) {
      try {
        await deletarAgendamento(agendamentoExistente.id);
        onClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEditar = () => {
    setEditando(true);
  };

  const handleCancelar = () => {
    if (agendamentoExistente) {
      setEditando(false);
      onClose();
    } else {
      setEditando(false);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
    setEditando(false);
  };
  const turnoAtual = turnos.find(t => t.letra === formData.turno);
  const salaAtual = salas.find(s => s.id === formData.sala_id);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {agendamentoExistente
              ? 'Detalhes do Agendamento'
              : 'Novo Agendamento'}
          </h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>
        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <strong>Data:</strong>
            <span>{formatarDataParaExibicao(formData.data)}</span>
          </div>

          {turnoAtual && (
            <div className={styles.infoItem}>
              <strong>Turno:</strong>
              <span>
                {turnoAtual.nome} ({turnoAtual.letra})
              </span>
            </div>
          )}

          <div className={styles.infoItem}>
            <strong>Sala:</strong>
            <span>
              {salaAtual
                ? `Sala ${salaAtual.descricao} - ${salaAtual.andar}`
                : salaSelecionada?.descricao || 'Não selecionada'}
            </span>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label htmlFor='descricao' className={styles.label}>
              Descrição *
            </label>
            <textarea
              id='descricao'
              className={styles.textarea}
              value={formData.descricao}
              onChange={e => handleInputChange('descricao', e.target.value)}
              disabled={!editando && agendamentoExistente}
              placeholder='Descreva o propósito do agendamento...'
              rows={3}
              style={{
                border:
                  !editando && agendamentoExistente
                    ? '1px solid #add'
                    : '2px solid #007bfa',
                backgroundColor:
                  !editando && agendamentoExistente ? '#f8f9fa' : 'white',
                cursor:
                  !editando && agendamentoExistente ? 'not-allowed' : 'text',
              }}
            />
            {agendamentoExistente && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                Clique em "Editar" para modificar a descrição
              </small>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          {agendamentoExistente && !editando ? (
            <>
              <button className={styles.botaoSecundario} onClick={handleEditar}>
                Editar
              </button>
              <button className={styles.botaoPerigo} onClick={handleDeletar}>
                Deletar
              </button>
              <button className={styles.botaoPrimario} onClick={onClose}>
                Fechar
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.botaoSecundario}
                onClick={handleCancelar}
              >
                Cancelar
              </button>
              <button className={styles.botaoPrimario} onClick={handleSalvar}>
                {agendamentoExistente ? 'Atualizar' : 'Criar'} Agendamento
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendamentoModal;
