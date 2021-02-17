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
     * @param  {?string} str  the string to check;
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
     * @param {TextChannel} channel    the channel to send the message.
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

    // noinspection JSIgnoredPromiseFromCall
    /**
     * Javascript does not support nested classes, but nobody can stop me from having classes in classes!
     * @type {{new(): Utils.CooldownManager, prototype: Utils.CooldownManager}}
     */
    static CooldownManager = class  {
        /**
         * A map of maps to keep track of all users under cooldown
         * @type {Map<string, Map<string, number>>}
         */
        cooldownTrack = new Map();
        constructor() {
        }

        /**
         * Checks if the user is under a cooldown
         * @param {string} coolDownId an identifier for the cooldown type
         * @param {string} userId the target user snowflake/id
         * @return {boolean} returns true if the user is under cooldown
         */
        isInCoolDown(coolDownId, userId) {
            if (this.cooldownTrack.has(coolDownId)) {
                let cooldown = this.cooldownTrack.get(coolDownId);
                if (cooldown.has(userId)) {
                    let time = cooldown.get(userId);
                    let timeLeft = time - Date.now();
                    // Will be true if the user is still under cooldown
                    return timeLeft > 0;
                } else {
                    // User not under cooldown
                    return false;
                }
            } else {
                // This cooldown id was never used before, no user was under cooldown with this id
                return false;
            }
        }

        /**
         * Set the user cooldown time
         * @param {string} coolDownId an identifier for the cooldown type
         * @param {string} userId the target user snowflake/id
         * @param {number} time the cooldown time in seconds
         */
        setCoolDown(coolDownId, userId, time) {
            if (!this.cooldownTrack.has(coolDownId)) {
                // This id is new, let's register it!
                this.cooldownTrack.set(coolDownId, new Map());
            }
            // Set the user cooldown, the time will be the expire time for the cooldown
            this.cooldownTrack.get(coolDownId).set(userId, Date.now() + (1000 * time))
        }

        /**
         * This function does the following actions at the same time:
         *  - Checks if the user is under cooldown
         *  - if the user is under cooldown it returns true and notifies the user that they are under cooldown
         *  - if the user is not under cooldown returns false
         * @param {string} coolDownId an identifier for the cooldown type
         * @param {string} userId the target user snowflake/id
         * @param {Message} messageToReply the message the user sent to reply to it
         * @return {boolean} returns true if the user is under cooldown
         */
        checkCooldownAndNotify(coolDownId, userId, messageToReply) {
            // Same check as isInCoolDown
            if (this.cooldownTrack.has(coolDownId)) {
                let cooldown = this.cooldownTrack.get(coolDownId);
                if (cooldown.has(userId)) {
                    let time = cooldown.get(userId);
                    let timeLeft = time - Date.now();
                    // Will be true if the user is still under cooldown
                    if (timeLeft > 0) {
                        if (messageToReply.deletable){
                            messageToReply.delete({reason: "User under command cooldown"});
                        }
                        messageToReply
                            .channel.send(`✖️ You cannot run this command for ${Math.round(timeLeft / 1000)} more seconds.`);
                        return true;
                    }
                }
            }
            return false;
        }
    }
}

module.exports = Utils;