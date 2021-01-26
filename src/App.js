import React, { useContext } from "react";
import Navbar from "./components/Navbar";
import Container from "./components/Container";
import DevicesList from "./components/DevicesList";
import LoginForm from "./components/LoginForm";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { token } = useContext(AuthContext);

  return (
    <React.Fragment>
      <Navbar />
      <Container>{token ? <DevicesList /> : <LoginForm />}</Container>
    </React.Fragment>
  );
}

export default App;
