/**
 * Dependencies
 */

import travelTo from './travelTo';
import pray from './pray';

/**
 * Define helper
 */

async function earnNewPowers() {
  /**
   * Pray at Linh's Shrine.
   */

  await travelTo(461);
  console.log("Pray at Linh's Shrine.");
  await pray();

  /**
   * Pray at The Peak of Mt. Holloway.
   */

  await travelTo(22);
  console.log("Pray at The Peak of Mt. Holloway.");
  await pray();

  /**
   * Pray at Glasowyn's Grave.
   */

  await travelTo(499);
  console.log("Pray at Glasowyn's Grave.");
  await pray();

  return true;
}

/**
 * Export helper
 */

export default earnNewPowers;
