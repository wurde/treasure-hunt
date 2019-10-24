/**
 * Dependencies
 */

import travelTo from './travelTo';

/**
 * Define helper
 */

async function examineWishingWell() {
  await travelTo(55);

  console.log('examineWishingWell')
  return true;
}

/**
 * Export helper
 */

export default examineWishingWell;
