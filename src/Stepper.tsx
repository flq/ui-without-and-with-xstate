import * as React from "react";
import max from "lodash/max";
import min from "lodash/min";
import styles from "./Stepper.module.css";
import { useInterval, useTimeout } from "./lib/useTimers";
import { useCallback, useState } from "react";

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
  const [minusActive, setMinusActive] = useState(false);
  const [plusActive, setPlusActive] = useState(false);
  const [steppingActive, setSteppingActive] = useState(false);

  const stepDown = useCallback(
    (val: number) => onChange(max([lowerBound, val - stepSize])!),
    [lowerBound, stepSize]
  );
  const stepUp = useCallback(
    (val: number) => onChange(min([upperBound, val + stepSize])!),
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
