import { readInputFile } from "./utils.js";

// main
/**
 * The company ACME offers their employees the flexibility to work the hours they want.
 * They will pay for the hours worked based on the day of the week and time of day, according to the following table:
 * Monday - Friday
 * 00:01 - 09:00 25 USD
 * 09:01 - 18:00 15 USD
 * 18:01 - 00:00 20 USD
 * Saturday and Sunday
 * 00:01 - 09:00 30 USD
 * 09:01 - 18:00 20 USD
 * 18:01 - 00:00 25 USD
 */

readInputFile(process.argv[2]);