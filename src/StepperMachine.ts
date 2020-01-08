import { actions, Machine } from "xstate";
import min from "lodash/min";
import max from "lodash/max";

interface StepperContext {
  value: number;
  stepSize: number;
  lowerBound: number;
  upperBound: number;
}

const plusEffect = actions.assign<StepperContext>(ctx => ({
  value: min([ctx.value + ctx.stepSize, ctx.upperBound])!
}));

const minusEffect = actions.assign<StepperContext>(ctx => ({
  value: max([ctx.value - ctx.stepSize, ctx.lowerBound])!
}));

function overstepGuard({ value, upperBound }: StepperContext) {
  return value < upperBound;
}

function understepGuard({ value, lowerBound }: StepperContext) {
  return value > lowerBound;
}

function createSteppingSubstates(
  steppingEffect: typeof plusEffect,
  pulsingGuard: typeof overstepGuard
) {
  return {
    waiting: {
      after: {
        waitForPulseDelay: { target: "pulsing" }
      },
      on: {
        Stop: { target: "#stepper.idle" }
      }
    },
    pulsing: {
      entry: steppingEffect,
      after: {
        pulseInterval: [
          { target: "pulsing", cond: pulsingGuard },
          { target: "#stepper.idle" }
        ]
      },
      on: {
        Stop: { target: "#stepper.idle" }
      }
    }
  };
}

type StepperEvent = { type: "Plus" } | { type: "Minus" } | { type: "Stop" };

interface StepperSchema {
  states: {
    idle: {};
    plus: {
      states: {
        waiting: {};
        pulsing: {};
      };
    };
    minus: {
      states: {
        waiting: {};
        pulsing: {};
      };
    };
  };
}

export const stepperMachine = Machine<
  StepperContext,
  StepperSchema,
  StepperEvent
>(
  {
    initial: "idle",
    id: "stepper",
    states: {
      idle: {
        entry: { type: "notifyExternal" },
        on: {
          Plus: [
            {
              target: "plus",
              cond: overstepGuard
            },
            { target: "idle" }
          ],
          Minus: [
            {
              target: "minus",
              cond: understepGuard
            },
            { target: "idle" }
          ]
        }
      },
      plus: {
        entry: plusEffect,
        initial: "waiting",
        states: createSteppingSubstates(plusEffect, overstepGuard)
      },
      minus: {
        entry: minusEffect,
        initial: "waiting",
        states: createSteppingSubstates(minusEffect, understepGuard)
      }
    }
  },
  {
    delays: {
      waitForPulseDelay: 500,
      pulseInterval: 200
    }
  }
);
