import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Editor from './pages/Editor/Editor';
import Explorer from './pages/Explorer/Explorer';
import Search from './pages/Search/Search';
import Settings from './pages/Settings/Settings';
import Admin from './pages/Admin/Admin';
import GraphView from './pages/GraphView/GraphView';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="editor" element={<Editor />} />
        <Route path="explorer" element={<Explorer />} />
        <Route path="search" element={<Search />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<Admin />} />
        <Route path="graph" element={<GraphView />} />
      </Route>
      {/* Catch all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
