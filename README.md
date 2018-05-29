# testcafe-reporter-teamcity-with-full-stacktrace (beta)
This is a TeamCity reporter plugin for TestCafe. https://devexpress.github.io/testcafe/

## To install this TestCafe Reporter

* run the command `npm install --save testcafe-reporter-teamcity-with-full-stacktrace`.

## Usage

* add to the testcafe command-line the following option:
```sh
--reporter teamcity-with-full-stacktrace
```

## Error rendering

* this reporter will report multiple code frames, one for each file reported in the stacktrace

```text
1) The specified selector does not match any element in the DOM tree.

   Browser: Firefox 59.0.0 / Mac OS X 10.12.0
   Screenshot: /Users/HDO/VSCodeProjects/testcafe-starter/screenshots/2018-05-07_10-39-08/test-2/Firefox_59.0.0_Mac_OS_X_10.12.0/errors/1.png

      13 |
      14 |  const value = inputData.name || "";
      15 |
      16 |  await t
      17 |    .setTestSpeed(config.testcafe.testSpeed)
   --------------------------------------------
    → 18 |    .hover(selector.userNameInputBox)
   --------------------------------------------
      19 |    .expect(selector.userNameInputBox.hasAttribute("disabled")).notOk()
      20 |    .typeText(selector.userNameInputBox, value, {replace: true})
      21 |    .pressKey("tab");
      22 |};
      23 |

      at Object.(anonymous) (/Users/HDO/VSCodeProjects/testcafe-starter/domains/testcafe-sample-page/steps/i-enter-my-name.ts:18:6)
      at (anonymous) (/Users/HDO/VSCodeProjects/testcafe-starter/domains/testcafe-sample-page/steps/i-enter-my-name.ts:7:71)
      at __awaiter (/Users/HDO/VSCodeProjects/testcafe-starter/domains/testcafe-sample-page/steps/i-enter-my-name.ts:3:12)
      at exports.default (/Users/HDO/VSCodeProjects/testcafe-starter/domains/testcafe-sample-page/steps/i-enter-my-name.ts:7:36)


       6 |  if (canExecute === false) {
       7 |    return;
       8 |  }
       9 |  const foundStep = stepMappings[stepName];
      10 |  if (typeof foundStep === "function" ) {
   --------------------------------------------
    → 11 |    await foundStep(stepName);
   --------------------------------------------
      12 |    return;
      13 |  }
      14 |  throw new Error(`Step "${stepName}" is not mapped to an executable code.`);
      15 |}
      16 |export async function given(stepName: GivenStep) {

      at (anonymous) (/Users/HDO/VSCodeProjects/testcafe-starter/step-runner.ts:11:11)
      at (anonymous) (/Users/HDO/VSCodeProjects/testcafe-starter/step-runner.ts:7:71)
      at __awaiter (/Users/HDO/VSCodeProjects/testcafe-starter/step-runner.ts:3:12)
      at executeStep (/Users/HDO/VSCodeProjects/testcafe-starter/step-runner.ts:14:12)
      at Object.(anonymous) (/Users/HDO/VSCodeProjects/testcafe-starter/step-runner.ts:20:9)
      at (anonymous) (/Users/HDO/VSCodeProjects/testcafe-starter/step-runner.ts:7:71)
      at __awaiter (/Users/HDO/VSCodeProjects/testcafe-starter/step-runner.ts:3:12)
      at Object.when (/Users/HDO/VSCodeProjects/testcafe-starter/step-runner.ts:34:12)


      19 |  await  then("no name should be populated");
      20 |  await   and("I cannot submit my feedback on testcafe");
      21 |});
      22 |
      23 |test("Scenario: can send feedback with my name only", async () =) {
   --------------------------------------------
    → 24 |  await  when("I enter my name");
   --------------------------------------------
      25 |  await  then("I can submit my feedback on testcafe");
      26 |});
      27 |
      28 |test("Scenario: send feedback", async () =) {
      29 |  await env.only( "devci");

      at Object.(anonymous) (/Users/HDO/VSCodeProjects/testcafe-starter/features/testcafe-sample-page.spec.ts:24:10)
      at (anonymous) (/Users/HDO/VSCodeProjects/testcafe-starter/features/testcafe-sample-page.spec.ts:7:71)
      at __awaiter (/Users/HDO/VSCodeProjects/testcafe-starter/features/testcafe-sample-page.spec.ts:3:12)
      at test (/Users/HDO/VSCodeProjects/testcafe-starter/features/testcafe-sample-page.spec.ts:23:66)

```
