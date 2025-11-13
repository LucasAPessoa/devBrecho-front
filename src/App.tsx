import { Route, Routes } from "react-router-dom";
import { Layout } from "./shared/ui/Navigation/Layout";
import { Setores } from "./pages/Setores";
import { Fornecedoras } from "./pages/Fornecedoras";
import { Bolsas } from "./pages/Bolsas";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<h1>Bem-vindo ao DevBrecho!</h1>} />
                <Route path="/setores" element={<Setores />} />
                <Route path="/fornecedoras" element={<Fornecedoras />} />
                <Route path="/bolsas" element={<Bolsas />} />
            </Route>
        </Routes>
    );
}

export default App;
