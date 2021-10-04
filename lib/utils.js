const Discord = require("discord.js");
const streamBuffers = require('stream-buffers');

/**
 * A set of utility functions for general uses.
 * @author juanmuscaria <juanmuscaria@gmail.com>
 */
class Utils {
    // noinspection JSIgnoredPromiseFromCall
    /**
     * Javascript does not support nested classes, but nobody can stop me from having classes in classes!
     * @type {{new(): Utils.CooldownManager, prototype: Utils.CooldownManager}}
     */
    static CooldownManager = class {
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
            this.cooldownTrack.get(coolDownId).set(userId, Date.now() + (1000 * time));
        }

        /**
         * This function does the following actions at the same time:
         *  - Checks if the user is under cooldown
         *  - if the user is under cooldown it returns true and notifies the user that they are under cooldown
         *  - if the user is not under cooldown returns false
         * @param {string} coolDownId an identifier for the cooldown type
         * @param {string} userId the target user snowflake/id
         * @param {Discord.Message} messageToReply the message the user sent to reply to it
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
                        if (messageToReply.deletable) {
                            messageToReply.delete();
                        }
                        messageToReply
                            .channel.send({content: `✖️ You cannot run this command for ${Math.round(timeLeft / 1000)} more seconds.`});
                        return true;
                    }
                }
            }
            return false;
        }
    }

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
     * @param  {?string} str the string to check;
     * @return {boolean} will return true if the string is null, empty or only contains blank spaces.
     */
    static isBlank(str) {
        return str === null || str.trim() === "";
    }

    /**
     * Check if a guild member has some permission.
     * @param {Discord.GuildMember} member the guild member to verify the permissions.
     * @param  {...bigint} permissions the permissions to check.
     * @returns {boolean} returns true if the member has all listed permissions.
     */
    static hasPermissions(member, ...permissions) {
        if (permissions.length === 0) {
            throw "permissions cannot be empty!";
        } //in case someone forgot to actually put permissions to check.
        for (const permission of permissions) {
            if (!member.permissions.has(permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if a guild member has some permission
     * and send a message if the user does not have one of the permissions.
     * @param {Discord.GuildMember} member the guild member to verify the permissions.
     * @param {Discord.TextChannel} channel the channel to send the message.
     * @param  {...bigint} permissions the permissions to check.
     * @returns {boolean} returns true if the member has all listed permissions.
     */
    static checkPermissionAndNotify(member, channel, ...permissions) {
        if (permissions.length === 0) {
            throw "permissions cannot be empty!";
        } //in case someone forgot to actually put permissions to check.
        for (const permission of permissions) {
            if (!member.permissions.has(permission)) {
                // I know this is not the ideal way to get the string of a permission, but I don't think there's any better way - juan
                channel.send({content: `:x: You need the permission \`${Object.keys(Discord.Permissions.FLAGS).find(key => Discord.Permissions.FLAGS[key] === permission)}\` to do this.`})
                    .then(m => setTimeout(() => m.delete(), 5000));
                return false;
            }
        }

        return true;
    }

    /**
     * Split an array into smaller arrays with the specified chunk size
     *
     * @param {[]} array original array.
     * @param {number} chunkSize the max size of each smaller array.
     * @returns {[]} an array of chunks from the original array.
     */
    static chunksOf(array, chunkSize) {
        let chunkArray = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunkArray.push(array.slice(i, i + chunkSize));
        }
        return chunkArray;
    }

    static epochToHour(epoch) {
        let date = new Date(epoch);
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    /**
     * Returns a text channel with the provided name,
     * null if any channel found is not a text channel or if there's no channel at all
     *
     * @param guild {Discord.Guild} the guild to search for the channel.
     * @param name the channel name.
     * @return {Discord.TextChannel | null}
     */
    static findTextChannel(guild, name) {
        let channel = guild.channels.cache.find(x => x.name === name);
        if (channel instanceof Discord.TextChannel)
            return channel;
        return null;
    }

    /**
     * @param options {streamBuffers.WritableStreamBufferOptions}
     * @return {streamBuffers.WritableStreamBuffer}
     */
    // Why I made this useless method? For webstorm to actually recognize the stream object and intellisense show the right methods - juan
    static makeWritableBuffer(options) {
        return new streamBuffers.WritableStreamBuffer(options)
    }
}

module.exports = Utils;