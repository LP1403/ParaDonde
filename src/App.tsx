import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IonApp } from '@ionic/react';
import '@ionic/react/css/core.css';

import { AuthProvider } from './context/AuthContext';
import { PdThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Aventura from './pages/Aventura';
import ResultadoAventura from './pages/ResultadoAventura';
import Destino from './pages/Destino';
import GuiasTematicas from './pages/GuiasTematicas';
import GuiaTematica from './pages/GuiaTematica';
import CalculadoraDolar from './pages/CalculadoraDolar';
import Login from './pages/Login';
import Register from './pages/Register';
import Cuenta from './pages/Cuenta';
import MisViajes from './pages/MisViajes';
import Terminos from './pages/Terminos';

function App() {
  return (
    <PdThemeProvider>
      <AuthProvider>
        <IonApp>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/aventura" element={<Aventura />} />
              <Route path="/aventura/resultado" element={<ResultadoAventura />} />
              <Route path="/destino/:slug" element={<Destino />} />
              <Route path="/guias" element={<GuiasTematicas />} />
              <Route path="/guias/:slug" element={<GuiaTematica />} />
              <Route path="/calculadora-dolar" element={<CalculadoraDolar />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/viajes" element={<MisViajes />} />
              <Route path="/cuenta" element={<Cuenta />} />
              <Route path="/terminos" element={<Terminos />} />
            </Routes>
          </BrowserRouter>
        </IonApp>
      </AuthProvider>
    </PdThemeProvider>
  );
}

export default App;
