import { Route, Routes, Navigate } from "react-router-dom"; // Adicionei Navigate
import { Layout } from "./shared/ui/Navigation/Layout";
import { Setores } from "./pages/Setores";
import { Fornecedoras } from "./pages/Fornecedoras";
import { Bolsas } from "./pages/Bolsas";
import { Prazos } from "./pages/Prazos";
import { Login } from "./pages/Login";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
                <Route
                    path="/dashboard"
                    element={<h1>Bem-vindo ao DevBrecho!</h1>}
                />
                <Route path="/setores" element={<Setores />} />
                <Route path="/fornecedoras" element={<Fornecedoras />} />
                <Route path="/bolsas" element={<Bolsas />} />
                <Route path="/prazos" element={<Prazos />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
