import Sidebar from './components/Sidebar';
import AgendaCalendar from './components/Calendario';
import { SalaProvider } from './context/SalaContext';
import { Container } from './components/Container';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <SalaProvider>
      <div className='app-container'>
        <Container>
          <Sidebar />
          <AgendaCalendar />
        </Container>
      </div>
      <ToastContainer
        position='top-right'
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </SalaProvider>
  );
}

export default App;
