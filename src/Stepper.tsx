import * as React from "react";
import max from "lodash/max";
import min from "lodash/min";
import styles from "./Stepper.module.css";
import { useInterval, useTimeout } from "./lib/useTimers";
import { useCallback, useState } from "react";
import { useMachine } from "@xstate/react";
import {stepperMachine} from "./StepperMachine";

interface StepperProps {
  value: number;
  lowerBound: number;
  upperBound: number;
  stepSize?: number;
  onChange: (value: number) => void;
}

export function Stepper({
  value,
  lowerBound,
  stepSize = 1,
  upperBound,
  onChange
}: StepperProps) {
    //const [state, send] = useMachine(stepperMachine, {context: { value, lowerBound, upperBound, stepSize }});
  const [minusActive, setMinusActive] = useState(false);
  const [plusActive, setPlusActive] = useState(false);
  const [steppingActive, setSteppingActive] = useState(false);

  const stepDown = useCallback(
    (val: number) => {
      const nextValue = max([lowerBound, val - stepSize])!;
      onChange(nextValue);
      if (nextValue === lowerBound) {
        // disabled button cannot raise mouse up
        setMinusActive(false);
      }
    },
    [lowerBound, stepSize]
  );
  const stepUp = useCallback(
    (val: number) => {
      const nextValue = min([upperBound, val + stepSize])!;
      onChange(nextValue);
      if (nextValue === upperBound) {
        // disabled button cannot raise mouse up
        setPlusActive(false);
      }
    },
    [upperBound, stepSize]
  );

  useTimeout(
    () => {
      if (minusActive || plusActive) {
        setSteppingActive(true);
      } else {
        setSteppingActive(false);
      }
    },
    500,
    [minusActive, plusActive]
  );
  useInterval(
    () => {
      if (steppingActive) {
        if (minusActive) {
          stepDown(value);
        }
        if (plusActive) {
          stepUp(value);
        }
      }
    },
    200,
    [steppingActive]
  );

  return (
    <div className={styles.container}>
      <button
        onMouseDown={() => {
          stepDown(value);
          setMinusActive(true);
        }}
        onMouseUp={() => setMinusActive(false)}
        className={styles.buttonLeft}
        disabled={value === lowerBound}
      >
        -
      </button>
      <label className={styles.label}>{value}</label>
      <button
        onMouseDown={() => {
          stepUp(value);
          setPlusActive(true);
        }}
        onMouseUp={() => setPlusActive(false)}
        className={styles.buttonRight}
        disabled={value === upperBound}
      >
        +
      </button>
    </div>
  );
}
