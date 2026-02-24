import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/configStore.js";
import App from './App.jsx'

console.log(store.getState());
store.subscribe(()=>{
  console.log(store.getState());  
})

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>
);
