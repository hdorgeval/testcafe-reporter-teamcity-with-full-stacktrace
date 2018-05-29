import { ICallsiteRecord, IStackFrame } from "./reporter-interface";

export const filterStackFramesIn = (callsite: ICallsiteRecord) => {
    const filteredStackFrames = getCurrentAppStackFramesFrom(callsite);
    callsite.stackFrames = filteredStackFrames;
    callsite.callsiteFrameIdx = 0;
};

export const getCurrentAppStackFramesFrom = (callsite: ICallsiteRecord): IStackFrame[] => {
    const result: IStackFrame[] = [];
    callsite
        .stackFrames
        .map((stackFrame: IStackFrame) => {
            const filename = getFileNameFrom(stackFrame);
            if (isNodeModuleOrIsNullOrUndefined(filename)) {
                return;
            }
            result.push(stackFrame);
        });
    return result;
};
export const getFileNameFrom = (stackFrame: IStackFrame): string | null | undefined => {
    if (stackFrame && stackFrame.getFileName && typeof stackFrame.getFileName === "function") {
        return stackFrame.getFileName();
    }
    return undefined;
};
export const isNodeModuleOrIsNullOrUndefined = (filePath: string | undefined | null): boolean => {
    if (filePath === undefined || filePath === null) {
        return true;
    }

    if (filePath.includes("node_modules")) {
        return true;
    }
    return false;
};
export const getAllFilesIn = (callsite: ICallsiteRecord): string[] => {
    let currentFile: string = "undefined";
    const result = callsite
        .stackFrames
        .map((stackFrame: IStackFrame) => stackFrame.getFileName())
        .filter( (filepath: string | undefined | null) => {
            if (filepath === undefined || filepath === null) {
                return false;
            }
            if (filepath === currentFile) {
                return false;
            }
            currentFile = filepath;
            return true;
        });
    return result;
};
export const stackFramesOf = (filename: string) => {
    return {
        in: (stackFrames: IStackFrame[]): IStackFrame[] => {
            const result = stackFrames
                    .filter( (stackFrame) => filename === getFileNameFrom(stackFrame));
            return result;
        },
    };
};
