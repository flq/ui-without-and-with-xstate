import * as React from "react";
import max from "lodash/max";
import min from "lodash/min";
import styles from "./Stepper.module.css";

interface StepperProps {
  value: number;
  lowerBound: number;
  upperBound: number;
  stepSize?: number;
  onChange: (value: number) => void
}

export function Stepper({
  value,
  lowerBound,
  stepSize = 1,
  upperBound,
    onChange
}: StepperProps) {
  return (
    <div className={styles.container}>
      <button onClick={() => onChange(max([lowerBound, value - stepSize ])!)} className={styles.buttonLeft} disabled={value === lowerBound}>&lt;</button>
      <label className={styles.label}>{value}</label>
      <button onClick={() => onChange(min([upperBound, value + stepSize ])!)} className={styles.buttonRight} disabled={value === upperBound}>&gt;</button>
    </div>
  );
}
