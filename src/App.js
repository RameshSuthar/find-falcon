import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home/Home';
import Result from './components/Result/Result';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/result" element={<Result />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
