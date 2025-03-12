import React from "react";
import NavBar from "../Navbar/Navbar";
import Filter from '../Buttons/Filter/Filter';
const Home = ()=>{

    return (
            <div>
              {/* Navbar */}
              <NavBar />
        
              {/* Componente Filter */}
              <Filter />
        
              {/* Contenuto della pagina */}
              <div className="page-content">
                <h1>Benvenuto nella Home</h1>
                <p>Questo è il contenuto della tua pagina.</p>
              </div>
            </div>
          );

};
export default Home;