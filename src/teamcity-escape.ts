// tslint:disable:max-line-length
/**
 * @param str : string to be escaped into Teamcity format
 * @see: https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity#BuildScriptInteractionwithTeamCity-Escapedvalues
 */
export const teamcity = {
    escape: (str: string | undefined): string => {
        if (str === undefined) {
            return "";
        }
        return str
            .replace(/\|/g, "||")
            .replace(/\n/g, "|n")
            .replace(/\r/g, "|r")
            .replace(/\[/g, "|[")
            .replace(/\]/g, "|]")
            .replace(/'/g, "|'")
            .replace(/[\u0100-\uffff]/g, (c) => `|0x${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
    },
};
