import * as chalk from "chalk";
import {nativeFormatError, nativeNewLine, nativeSetIndent, nativeWrite} from "./reporter-helpers";
import { IError, IExtendedReporterPlugin, ITestRunInfo } from "./reporter-interface";
import { filterStackFramesIn, getAllFilesIn, stackFramesOf } from "./stack-frames-parser";
import { getStackTraceHeaderFrom } from "./stack-trace-parser";
import { teamcity} from "./teamcity-escape";

export const extendedReporterPlugin: IExtendedReporterPlugin = {
    chalk: chalk.default,
    failed: 0,
    formatError: (err: any, prefix: string) => {
        return nativeFormatError(err, prefix);
    },
    lastSuiteName: undefined,
    skipped: 0,
    reportTaskStart(startTime: Date, userAgents: string[], testCount: number ) {
        this.failed = 0;
        this.skipped = 0;
        this.write("Starting test run!")
                .newline()
                .setIndent(4)
                .write(`Start Time: ${startTime}`)
                .newline()
                .write(`User Agents: ${userAgents}`)
                .newline()
                .write(`Test Count: ${testCount}`)
                .newline()
                .setIndent(0);
    },
    reportFixtureStart(name: string /* , path: string */) {
        if (this.lastSuiteName) {
            this
                .write(`##teamcity[testSuiteFinished name='${teamcity.escape(this.lastSuiteName)}']`)
                .newline();
            return;
        }
        this
            .write(`##teamcity[testSuiteStarted name='${teamcity.escape(name)}']`)
            .newline();
        this.lastSuiteName = name;
    },
    reportTestDone(name: string, testRunInfo: ITestRunInfo) {
        const testName = teamcity.escape(name);
        this
            .write(`##teamcity[testStarted name='${testName}']`)
            .newline();
        if (testRunInfo.skipped) {
            this.skipped++;
            this
                .write(`##teamcity[testIgnored name='${testName}' message='skipped']`)
                .newline();
            return;
        }

        if (testRunInfo.errs && testRunInfo.errs.length > 0) {
            const formattedErrorMessage = this.renderErrors(testRunInfo.errs);
            const escapedMessage = teamcity.escape(formattedErrorMessage);
            this.failed++;
            this
                // tslint:disable-next-line:max-line-length
                .write(`##teamcity[testFailed name='${testName}' message='Test Failed' captureStandardOutput='true' details='${escapedMessage}']`)
                .newline();
            return;
        }

        this
            .write(`##teamcity[testFinished name='${testName}' duration='${testRunInfo.durationMs}']`)
            .newline();
    },
    reportTaskDone(endTime: Date, passed: number, warnings: string[]) {
        if (this.lastSuiteName) {
            this
                .write(`##teamcity[testSuiteFinished name='${teamcity.escape(this.lastSuiteName)}']`)
                .newline();
        }
        this
            .write("Test Run Completed:").newline()
            .setIndent(4)
            .write(`End Time: ${endTime}`).newline()
            .write(`Tests Passed: ${passed}`).newline()
            .write(`Tests Failed: ${this.failed}`).newline()
            .write(`Tests Skipped: ${this.skipped}`).newline()
            .write(`Warnings:\n ${warnings.join("\n\t\t")}`).newline()
            .setIndent(0);
    },

    newline: () => {
        return nativeNewLine();
    },
    setIndent: (val: number) => {
        return nativeSetIndent(val);
    },
    write: (text: string) => {
        return nativeWrite(text);
    },
    renderErrors(errs: IError[]): string {
        const originalStackTraceLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = 100;
        const lines: string[] = [];
        errs
            .map((err: IError, idx: number) => {
                const prefix = `${idx + 1}) `;
                filterStackFramesIn(err.callsite);
                const originalStackFrames = [...err.callsite.stackFrames];
                const files = getAllFilesIn(err.callsite);
                let stackTraceHeader: string;
                files.map( (filename: string, index: number) => {
                    err.callsite.stackFrames = stackFramesOf(filename).in(originalStackFrames);
                    err.callsite.filename = filename;
                    err.callsite.lineNum = err.callsite.stackFrames[0].getLineNumber() - 1;
                    const stackTrace = this.formatError(err, prefix);

                    if (index === 0) {
                        lines.push(stackTrace);
                        stackTraceHeader = getStackTraceHeaderFrom(stackTrace);
                        return;
                    }
                    if (stackTraceHeader) {
                        const truncatedStackTrace = stackTrace.replace(stackTraceHeader, "");
                        lines.push(truncatedStackTrace);
                        return;
                    }
                    lines.push(stackTrace);

                });
            });

        Error.stackTraceLimit = originalStackTraceLimit;
        return lines.join("\n");
    },
    createErrorDecorator() {
        let hasShownError: boolean = false;
        const lineSeparator = "--------------------------------------------\n";
        return {
            "a":                       (str: string) => `"${str}"`,
            "a screenshot-path":       (str: string) => str,
            "code":                    (str: string) => str,
            "div code-frame":          (str: string) => str,
            "div code-line":           (str: string) => {
                if (hasShownError) {
                    hasShownError = false;
                    return `${str}\n${lineSeparator}`;
                }
                return `${str}\n`;
            },
            "div code-line-last":      (str: string) => str,
            "div code-line-num":       (str: string) => `   ${str} |`,
            "div code-line-num-base":  (str: string) => {
                hasShownError = true;
                return lineSeparator + ` &rarr; ${str} ` + "|";
            },
            "div code-line-src":       (str: string) => str,
            "div message":             (str: string) => str,
            "div screenshot-info":     (str: string) => str,
            "div stack":               (str: string) => "\n\n" + str,
            "div stack-line":          (str: string) => str + "\n",
            "div stack-line-last":     (str: string) => str,
            "div stack-line-location": (str: string) => ` (${str})`,
            "div stack-line-name":     (str: string) => `   at ${str}`,
            "span subtitle":           (str: string) => `- ${str} -`,
            "span syntax-comment":     (str: string) => str,
            "span syntax-invalid":     (str: string) => str,
            "span syntax-keyword":     (str: string) => str,
            "span syntax-number":      (str: string) => str,
            "span syntax-punctuator":  (str: string) => str,
            "span syntax-regex":       (str: string) => str,
            "span syntax-string":      (str: string) => str,
            "span user-agent":         (str: string) => str,
            "strong":                  (str: string) => str,
        };
    },
};
