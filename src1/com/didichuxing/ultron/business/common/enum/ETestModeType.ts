import AModelTestMode from '@ultron/business/modelTestMode/AMode';
import ModelTestModeFixQPS from '@ultron/business/modelTestMode/models/ModeFixQPS';
import ModelTestModeFixCocurrent from '@ultron/business/modelTestMode/models/ModeFixCocurrent';
import ModelTestModeStepwiseQPS from '@ultron/business/modelTestMode/models/ModeStepwiseQPS';
import ModelTestModeStepwiseCocurrent from '@ultron/business/modelTestMode/models/ModeStepwiseCocurrent';

import { IReturnTestMode } from '@ultron/remote/testTask/interfaces/IGetPressureTask';

/**
 * 枚举压测方式：1-固定QPS，2-固定并发，3-阶梯QPS，4-阶梯并发
 */
export enum ETestModeType {
    // 固定QPS
    FixQPS = 1,
    // 固定并发
    FixCocurrent = 2,
    // 阶梯QPS
    StepQPS = 3,
    // 阶梯并发
    StepCocurrent = 4,
    // 自定义QPS
    CustomQPS = 5,
    // 自定义并发
    CustomConcurrency = 6
}

const MAP_TEXT = {
    [ETestModeType.FixQPS]: '固定QPS',
    [ETestModeType.FixCocurrent]: '固定并发',
    [ETestModeType.StepQPS]: '阶梯QPS',
    [ETestModeType.StepCocurrent]: '阶梯并发'
};

export const MapTestModeModel = {
    [ETestModeType.FixQPS]: ModelTestModeFixQPS,
    [ETestModeType.FixCocurrent]: ModelTestModeFixCocurrent,
    [ETestModeType.StepQPS]: ModelTestModeStepwiseQPS,
    [ETestModeType.StepCocurrent]: ModelTestModeStepwiseCocurrent
};

export function createTestModeModel(data: IReturnTestMode): AModelTestMode {
    let inst: AModelTestMode | null = null;
    switch (data.type) {
        case ETestModeType.FixQPS:
            inst = new ModelTestModeFixQPS();
            break;
        case ETestModeType.FixCocurrent:
            inst = new ModelTestModeFixCocurrent();
            break;
        case ETestModeType.StepQPS:
            inst = new ModelTestModeStepwiseQPS();
            break;
        case ETestModeType.StepCocurrent:
            inst = new ModelTestModeStepwiseCocurrent();
            break;
    }
    if (inst) {
        inst.fillByServerData(data);
        return inst;
    } else {
        throw new Error('data.type=' + data.type + ' is invalid');
    }
}

/**
 * 压测方式数值转文字
 * @param {number} state
 * @returns {any | number}
 */
export function textTestModeType(state: number) {
    return MAP_TEXT[state] || state;
}
