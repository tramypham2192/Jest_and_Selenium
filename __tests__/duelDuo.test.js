const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get('http://localhost:8000');
    await driver.wait(until.titleIs("Duel Duo"), 1000);
    // Check that clicking the Draw button displays the div with id = “choices”
    // step 1: locate the Draw button and click it
    await driver.findElement(By.id("draw")).click();
    // step 2: locate the div with id = "choices"
    const choicesElement = await driver.findElement(By.id("choices"));
    await choicesElement.isDisplayed();

    // Check that clicking an “Add to Duo” button displays the div with id = “player-duo”
    await driver.get("http://localhost:8000");
    await driver.findElement(By.id("draw")).click();
    // step 1: locate the Add to Duo button and click it
    const addToDuoBtn = await driver.findElement(By.id("add-to-duo-btn"));
    await addToDuoBtn.click();
    
    // step 3: locate the div with id = "player-duo"
    const playerDuoDiv = await driver.findElement(By.id("player-duo"));
    await playerDuoDiv.isDisplayed();

    // Check that when a bot is “Removed from Duo”, that it goes back to “choices”
    await driver.get("http://localhost:8000");
    await driver.findElement(By.id("draw")).click();
    const addToDuoBtn2 = await driver.findElement(By.id("add-to-duo-btn"));
    await addToDuoBtn2.click();
    // step 3: locate the div with id = "player-duo"
    const playerDuoDiv2 = await driver.findElement(By.id("player-duo"));
    await playerDuoDiv2.isDisplayed();
    // step 1: locate the Remove from Duo button and click it
    const removeFromDuoBtn = await driver.findElement(By.id('remove-from-duo-btn'));
    await removeFromDuoBtn.click();
    // step 2: locate the div with id = "choices"
    const choicesDiv = await driver.findElement(By.id('choices'));
    expect(await choicesDiv.isDisplayed()).toBe(true);  
  });
});