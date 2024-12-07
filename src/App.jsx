import { BrowserRouter, Route,                                                                                                                                                                                                                                                                                                                                                                                  Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Validate from "./pages/Validate";
import Going from "./pages/Going";
import Purgatory from "./pages/Purgatory";
import NotGoing from "./pages/NotGoing";
import NoInvite from "./pages/NoInvite";
import Eda from "./pages/Eda";
import Reminders from "./pages/Reminders";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/> }/>
          <Route path='/validate' element={<Validate/> }/>
          <Route path='/going/:id' element={<Going/> }/>
          <Route path='/notgoing/:id' element={<NotGoing/>} />
          <Route path='/purgatory/:id' element={<Purgatory/>} />
          <Route path='/eda' element={<Eda/>} />
          <Route path='/noinvite' element={<NoInvite/>} />
          <Route path='/reminders' element={<Reminders/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
