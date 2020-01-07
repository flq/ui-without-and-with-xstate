import {actions, Machine} from "xstate";
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

function overstepGuard({ value, upperBound } : StepperContext) {
    return value < upperBound;
}

function understepGuard({ value, lowerBound } : StepperContext) {
    return value > lowerBound;
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

export const stepperMachine = Machine<StepperContext, StepperSchema, StepperEvent>({
    initial: "idle",
    states: {
        idle: {
            on: {
                Plus: [
                    {
                        target: "plus.waiting",
                        cond: overstepGuard
                    },
                    { target: "idle" }
                ],
                Minus: [
                    {
                        target: "minus.waiting",
                        cond: understepGuard
                    },
                    { target: "idle" }
                ]
            }
        },
        plus: {
            entry: plusEffect,
            states: {
                waiting: {
                    after: {
                        500: { target: "plus.pulsing" }
                    },
                    on: {
                        Stop: { target: "idle" }
                    }
                },
                pulsing: {
                    entry: plusEffect,
                    after: {
                        200: [{ target: "plus.pulsing", cond: overstepGuard }, { target: "idle"}]
                    },
                    on: {
                        Stop: { target: "idle" }
                    }
                }
            }
        },
        minus: {
            entry: minusEffect,
            states: {
                waiting: {
                    after: {
                        500: [{ target: "minus.pulsing", cond: understepGuard }, { target: "idle"}]
                    },
                    on: {
                        Stop: { target: "idle" }
                    }
                },
                pulsing: {
                    entry: minusEffect,
                    after: {
                        200: { target: "minus.pulsing" }
                    },
                    on: {
                        Stop: { target: "idle" }
                    }
                }
            }
        }
    }
});