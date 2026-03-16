import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IonApp } from '@ionic/react';
import '@ionic/react/css/core.css';

import Home from './pages/Home';
import Aventura from './pages/Aventura';
import ResultadoAventura from './pages/ResultadoAventura';
import Destino from './pages/Destino';
import GuiasTematicas from './pages/GuiasTematicas';
import GuiaTematica from './pages/GuiaTematica';
import CalculadoraDolar from './pages/CalculadoraDolar';

function App() {
  return (
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
        </Routes>
      </BrowserRouter>
    </IonApp>
  );
}

export default App;
