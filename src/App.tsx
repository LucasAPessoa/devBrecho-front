import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Setores } from "./pages/Setores";
import { Fornecedoras } from "./pages/Fornecedoras";
import { Bolsas } from "./pages/Bolsas";
import { Pecas } from "./pages/Pecas";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Adicione uma página inicial se desejar */}
                <Route index element={<h1>Bem-vindo ao DevBrecho!</h1>} />
                <Route path="/setores" element={<Setores />} />
                <Route path="/fornecedoras" element={<Fornecedoras />} />
                <Route path="/bolsas" element={<Bolsas />} />
                <Route path="/pecas" element={<Pecas />} />
            </Route>
        </Routes>
    );
}

export default App;
