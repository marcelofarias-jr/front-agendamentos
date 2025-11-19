import useSala from '../../hooks/useSala';
import { useSalas } from '../../hooks/useSalas';
import { Salas } from '../../utils';
import styles from './styles.module.scss';

const Sidebar = () => {
  const { selecionarAndar, selecionarSala, andarSelecionado, salaSelecionada } =
    useSala();
  const { salas } = useSalas();

  function encontrarSalaPorDescricao(salas, descricao) {
    return salas.find(sala => sala.descricao === descricao);
  }

  const toggleAndar = andar => {
    selecionarAndar(andarSelecionado === andar ? null : andar);
    selecionarSala(`${andar}01`);
  };

  const pegarSala = sala => {
    const salaDesejada = encontrarSalaPorDescricao(salas, sala);
    selecionarSala(salaDesejada);
  };

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.titulo}>Salas por Andar</h1>

      <div className={styles.listaAndares}>
        {[1, 2, 3, 4, 5].map(andar => {
          const salasDoAndar = Salas.filter(sala => sala.andar === andar);
          const isAberto = andarSelecionado === andar;

          return (
            <div key={andar} className={styles.andarContainer}>
              <button
                className={styles.botaoAndar}
                onClick={() => toggleAndar(andar)}
              >
                <span className={styles.textoAndar}>
                  {andar}º Andar ({salasDoAndar.length} salas)
                </span>
                <svg
                  className={`${styles.arrow} ${isAberto ? styles.open : ''}`}
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>

              {isAberto && (
                <div className={styles.listaSalas}>
                  {salasDoAndar.map((sala, id) => (
                    <div
                      key={id}
                      className={`${styles.salaItem} ${
                        sala.numero === salaSelecionada?.descricao
                          ? styles.active
                          : ''
                      }`}
                      onClick={() => pegarSala(sala.numero)}
                    >
                      <p className={styles.salaNumero}>Sala {sala.numero}</p>
                      <p className={styles.salaCapacidade}>
                        Capacidade: <strong>{sala.capacidade} pessoas</strong>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
