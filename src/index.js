import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import rootReducer from "./reducer";
import {configureStore} from "@reduxjs/toolkit"
import { Toaster } from "react-hot-toast";


const store = configureStore({             //added "rootReducer" into store variable and rootReducer is combination of all reducer which is made in slices;
  reducer:rootReducer,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <React.StrictMode>

    <Provider store = {store}>
      <BrowserRouter>
          <App />
          <Toaster/>
        </BrowserRouter>
    </Provider>
    
  </React.StrictMode>
);



