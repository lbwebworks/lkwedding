import { siteData } from './src/data/siteData.ts'
console.log('rosters:', siteData.rosters.length)
console.log('foodPackage:', siteData.groups.foodPackage.length)
console.log('special:', siteData.groups.special.length)
console.log('first roster:', siteData.rosters[0]?.FirstName)