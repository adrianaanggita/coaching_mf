import React from "react";
import ReactDOM from "react-dom";
import Table from "./components/Table";

import "./index.scss";


const App = () => (
  // <div className="mt-10 text-3xl mx-auto max-w-6xl">
  //     <React.Suspense fallback="Loading...">
  //       <MainMap/>
  //     </React.Suspense>
  // </div>

  <div className = " min-h-screen bg-gradient-to-tl from-yellow-200 via-red-200 to-fuchsia-300 place-content-center " >
    <Table />
  </div >
);
ReactDOM.render(<App />, document.getElementById("app"));
