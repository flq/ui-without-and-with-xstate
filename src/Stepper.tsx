import * as React from "react";
import styles from "./Stepper.module.css";
import { useMachine } from "@xstate/react";
import { stepperMachine } from "./StepperMachine";

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
  const [state, send] = useMachine(stepperMachine, {
    context: { value, lowerBound, upperBound, stepSize },
    actions: {
      notifyExternal: ctx => onChange(ctx.value)
    },
    delays: {
      waitForPulseDelay: 1000,
      pulseInterval: 100
    }
  });
  const {
    context: { value: theValue }
  } = state;
  console.log(state);

  return (
    <div className={styles.container}>
      <button
        onMouseDown={() => send({ type: "Minus" })}
        onMouseUp={() => send({ type: "Stop" })}
        className={styles.buttonLeft}
        disabled={theValue === lowerBound}
      >
        -
      </button>
      <label className={styles.label}>{theValue}</label>
      <button
        onMouseDown={() => send({ type: "Plus" })}
        onMouseUp={() => send({ type: "Stop" })}
        className={styles.buttonRight}
        disabled={theValue === upperBound}
      >
        +
      </button>
    </div>
  );
}
