import './App.css';
import Edit from './pages/Edit/Edit';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Edit />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
