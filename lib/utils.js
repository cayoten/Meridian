/**
 * A set of utility functions for general uses.
 * @author juanmuscaria <juanmuscaria@gmail.com>
 */
const {GuildMember, GuildChannel} = require("discord.js");

class Utils {
    /**
     * Converts a map into a json string.
     * @param {Map} map  the map to convert.
     * @return {string}  the json string representation of that map.
     */
    static mapToJson(map) {
        return JSON.stringify([...map]);
    }

    /**
     * Converts a json string into a map.
     * @param {string} jsonStr  the string to convert into a map.
     * @return {Map}            the map representation of that json string.
     */
    static jsonToMap(jsonStr) {
        return new Map(JSON.parse(jsonStr));
    }

    /**
     * Check is a string is null, empty or only contains blank spaces.
     * @param  {string} str  the string to check;
     * @return {boolean}     will return true if the string is null, empty or only contains blank spaces.
     */
    static isBlank(str) {
        return str === null || str.trim() === "";
    }

    /**
     * Check if a guild member has some permission.
     * @param {GuildMember} member      the guild member to verify the permissions.
     * @param  {...string} permissions  the permissions to check.
     * @returns {boolean}               returns true if the member has all listed permissions.
     */
    static hasPermissions(member, ...permissions) {
        if (permissions.length === 0)
            throw "permissions cannot be empty!"; //in case someone forgot to actually put permissions to check.
        for (const permission of permissions) {
            if (!member.hasPermission(permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if a guild member has some permission
     * and send a message if the user does not have one of the permissions.
     * @param {GuildMember} member      the guild member to verify the permissions.
     * @param {GuildChannel} channel    the channel to send the message.
     * @param  {...string} permissions  the permissions to check.
     * @returns {boolean}               returns true if the member has all listed permissions.
     */
    static checkPermissionAndNotify(member, channel, ...permissions) {

        if (permissions.length === 0)
            throw "permissions cannot be empty!"; //in case someone forgot to actually put permissions to check.
        for (const permission of permissions) {
            if (!member.hasPermission(permission)) {
                channel.send(`:x: You need the permission \`${permission}\` to do this.`)
                    .then(m => m.delete({timeout: 5000}));
                return false;
            }
        }

        return true;
    }
}

module.exports = Utils;