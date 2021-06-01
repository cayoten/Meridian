const Discord = require("discord.js");
module.exports = async function (oldMember, newMember) {
  const roleList = [
    "361648335674671105", // Omega Bork
    "361648353789870082", // Furry Trash
    "361648348723150855", // Furocious
    "361648361968893976", // Floofball
    "361648353811103746", // Pawesome
    "361648652118130700", // Popufur
    "469646447013396480", // Hyperfluff
    "474384288239058964", // Silverfox
    "657066857030746123", // Furmidable
    "699361810574475375", // Holy Fur
    "776953245280239617", // No-Life FurF,
  ];
  // checks if the new member has the roles, doesn't even bother comparing oldMember to newMember
  roleList.forEach((i) => {
    if (newMember.roles.cache.has(i)) {
      // probably a bad way of doing it, but there's almost no documentation for Collection.hasAny, so this will work
      if (!newMember.roles.cache.has('444518133018132480')) newMember.roles.add("444518133018132480"); // adds the Member role to user if they dont already have it
    }
  });
};
