import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

import AppLayout from "./layouts/AppLayout";
import MainLayout from "./layouts/MainLayout";
import Home from "./Components/Home/Home";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
