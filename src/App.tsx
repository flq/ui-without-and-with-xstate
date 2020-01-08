import React, { useState } from "react";
import { Stepper } from "./Stepper";
import "./App.css";

const App: React.FC = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="app">
      <Stepper lowerBound={0} upperBound={100} stepSize={5} value={value} onChange={v => {
          setValue(v);
          console.log(v);
      }} />
    </div>
  );
};

export default App;
