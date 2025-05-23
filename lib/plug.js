require('../settings');
const fs = require('fs');
const path = require('path');
const readmore = String.fromCharCode(8206).repeat(4001);
const prem = require('../App/function/premium');

/**
 * Optimized Plugin Controller Class
 */
class PluginController {
  constructor() {
    this.plugins = [];
    this.pluginsDirectory = path.resolve(__dirname, "plugins");
    
    this.premiumUsers = null;
    this.lastPremiumCheck = 0;
    
    this.permissionCache = new Map();
    this.pluginsLoaded = false;
  }

  /**
   * Load all plugins from the plugins directory
   * @returns {Promise<Array>} Array of loaded plugins
   */
  async loadPlugins() {
    if (this.pluginsLoaded && this.plugins.length > 0) {
      return this.plugins;
    }
    
    try {
      this.plugins = [];
      await this.scanDirectory(this.pluginsDirectory);
      //console.log(`Successfully loaded ${this.plugins.length} plugins`);
      this.pluginsLoaded = true;
      return this.plugins;
    } catch (error) {
      //console.error("Error loading plugins:", error);
      return [];
    }
  }

  /**
   * Recursively scan directory for plugin files
   * @param {string} directory - Directory to scan
   */
  async scanDirectory(directory) {
    try {
      const items = fs.readdirSync(directory);

      for (const item of items) {
        const itemPath = path.join(directory, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          await this.scanDirectory(itemPath);
        } else if (item.endsWith(".js")) {
          try {
            const resolvedPath = require.resolve(itemPath);
            if (require.cache[resolvedPath]) {
              delete require.cache[resolvedPath];
            }
            
            const plugin = require(itemPath);
            
            if (plugin && typeof plugin === 'function' && (Array.isArray(plugin.command) || typeof plugin.before === 'function')) {
              plugin.__filename = itemPath;
              
              if (plugin.command && Array.isArray(plugin.command)) {
                plugin.__commandMap = {};
                plugin.command.forEach(cmd => {
                  plugin.__commandMap[cmd.toLowerCase()] = true;
                });
              }
              
              this.plugins.push(plugin);
            } else {
              const relativePath = path.relative(this.pluginsDirectory, itemPath);
              console.log(`Skipping invalid plugin: ${relativePath} (missing required properties)`);
            }
          } catch (error) {
            const relativePath = path.relative(this.pluginsDirectory, itemPath);
            console.error(`Error loading plugin ${relativePath}:`, error);
            
            const errorLog = {
              plugin: item,
              path: relativePath,
              error: error.message,
              stack: error.stack,
              timestamp: new Date().toISOString()
            };
            
            this.logPluginError(errorLog);
          }
        }
      }
    } catch (dirError) {
      console.error(`Error scanning directory ${directory}:`, dirError);
    }
  }

  /**
   * Log plugin errors to file for debugging
   * @param {Object} errorLog - Error details
   */
  logPluginError(errorLog) {
    try {
      const logDir = path.resolve(__dirname, "../tmp/logs");
      
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      const logFile = path.join(logDir, "plugin-errors.log");
      const logEntry = `[${errorLog.timestamp}] Plugin: ${errorLog.plugin} (${errorLog.path})\n` +
                      `Error: ${errorLog.error}\n` +
                      `Stack: ${errorLog.stack}\n` +
                      `----------------------------------------\n`;
      
      fs.appendFileSync(logFile, logEntry);
    } catch (logError) {
      console.error("Failed to write error log:", logError);
    }
  }

  /**
   * Load premium users from storage with caching
   * @returns {Array} Array of premium users
   */
  loadPremiumUsers() {
    try {
      const now = Date.now();
      if (this.premiumUsers && (now - this.lastPremiumCheck < 300000)) {
        return this.premiumUsers;
      }

      const premiumPath = path.resolve(__dirname, '../storage/data/role/premium.json');
      if (fs.existsSync(premiumPath)) {
        this.premiumUsers = JSON.parse(fs.readFileSync(premiumPath));
        this.lastPremiumCheck = now;
        return this.premiumUsers;
      }
      
      this.premiumUsers = [];
      fs.writeFileSync(premiumPath, JSON.stringify(this.premiumUsers));
      this.lastPremiumCheck = now;
      return this.premiumUsers;
    } catch (error) {
      console.error("Error loading premium users:", error);
      return [];
    }
  }

  /**
   * Check if user has permission to use the plugin
   * @param {Object} plugin - Plugin to check
   * @param {Object} context - Context with user info
   * @returns {Object} {allowed: boolean, reason: string}
   */
  checkPermission(plugin, context) {
    const cacheKey = `${plugin.command?.[0] || 'unknown'}_${context.sender}_${context.isGroup ? 'group' : 'private'}_${context.isAdmins ? 'admin' : 'user'}_${context.isBotAdmins ? 'botadmin' : 'botuser'}_${context.isCreator ? 'creator' : 'noncreator'}`;
    
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey);
    }
    
    const result = { allowed: true, reason: "" };
    
    if (!plugin.restrict) {
      this.permissionCache.set(cacheKey, result);
      return result;
    }

    if (plugin.restrict.ownerOnly && !context.isCreator) {
      result.allowed = false;
      result.reason = mess.owner;
      this.permissionCache.set(cacheKey, result);
      return result;
    }

    if (plugin.restrict.premiumOnly) {
      const premium = this.loadPremiumUsers();
      const isPremium = context.isCreator || prem.checkPremiumUser(context.sender, premium) || false;
      
      if (!isPremium) {
        result.allowed = false;
        result.reason = mess.premium;
        this.permissionCache.set(cacheKey, result);
        return result;
      }
    }

    if (plugin.restrict.groupOnly && !context.isGroup) {
      result.allowed = false;
      result.reason = mess.group;
      this.permissionCache.set(cacheKey, result);
      return result;
    }

    if (plugin.restrict.privateOnly && context.isGroup) {
      result.allowed = false;
      result.reason = mess.private;
      this.permissionCache.set(cacheKey, result);
      return result;
    }

    if (plugin.restrict.adminOnly && context.isGroup && !context.isAdmins) {
      result.allowed = false;
      result.reason = mess.admin;
      this.permissionCache.set(cacheKey, result);
      return result;
    }

    if (plugin.restrict.botAdminOnly && context.isGroup && !context.isBotAdmins) {
      result.allowed = false;
      result.reason = mess.botAdmin;
      this.permissionCache.set(cacheKey, result);
      return result;
    }

    this.permissionCache.set(cacheKey, result);
    return result;
  }

  /**
   * Check and update user database - optimized version
   * @param {Object} m - Message object
   * @param {Object} context - Context for plugin execution
   */
  async checkUserDatabase(m, context) {
    try {
      const { sender } = context;
      
      if (!db.users[sender]) {
        db.users[sender] = {
          limit: limit.free,
          uang: 0,
          vip: false,
          registered: false,
          registeredAt: 0,
          lastSeen: Date.now()
        };
      } else {
        db.users[sender].lastSeen = Date.now();
      }

      const premium = this.loadPremiumUsers();
      const isPremium = context.isCreator || prem.checkPremiumUser(sender, premium) || false;
      const isVip = db.users[sender].vip || false;
      
      context.isPremium = isPremium;
      context.isVip = isVip;
      context.userLimit = db.users[sender].limit;
      
      context.userData = db.users[sender];
      
      const now = Date.now();
      if (!this.lastPremExpCheck || now - this.lastPremExpCheck > 600000) {
        prem.expiredCheck(context.rinn, m, premium);
        this.lastPremExpCheck = now;
      }
    } catch (error) {
      console.error("Error checking user database:", error);
    }
  }

  /**
   * Execute before handlers for plugins
   * @param {Object} m - Message object
   * @param {Object} context - Context for plugin execution
   * @returns {boolean} Whether the message was handled
   */
  async execBefore(m, context) {
  try {
    if (!this.pluginsLoaded || this.plugins.length === 0) {
      await this.loadPlugins();
    }

    await this.checkUserDatabase(m, context);

    const beforeContext = {
      rinn: context.rinn,           // Bot instance
      Nreply: context.Nreply,       // Reply function
      isGroup: context.isGroup,     // Is group chat
      isAdmins: context.isAdmins,   // Is sender admin
      isBotAdmins: context.isBotAdmins, // Is bot admin
      sender: context.sender,       // Sender ID
      chat: m.chat,                 // Chat ID
      isCreator: context.isCreator, // Is creator/owner
      isPremium: context.isPremium, // Is premium user
      userData: context.userData,   // User data from database
      store: context.store,         // Data store
      ...context                    // Include all other context properties
    };
    const beforeHandlers = this.plugins.filter(plugin => typeof plugin.before === 'function');
    
    for (const plugin of beforeHandlers) {
      try {
        const result = await plugin.before(m, beforeContext);
        
        if (result === true) {
          return true;
        }
      } catch (error) {
        console.error(`[PLUGIN] Error in before handler: ${error.message}`);
        console.error(error.stack);
      }
    }

    return false;
  } catch (error) {
    console.error(`[PLUGIN] error in execBefore: ${error.message}`);
    console.error(error.stack);
    return false;
  }
}

  /**
   * Check if user has enough limit to use the plugin
   * @param {Object} m - Message object
   * @param {Object} context - Plugin context
   * @param {Object} plugin - Plugin to check
   * @returns {boolean} Whether user has enough limit
   */
  async checkLimit(m, context, plugin) {
    if (context.isCreator) return true;
    if (context.isPremium) return true;
    
    if (!plugin.limit) return true;
    
    const limitCost = typeof plugin.limit === 'number' ? plugin.limit : 2;
    const sender = m.sender;
    
    if (db.users[sender] && db.users[sender].limit >= limitCost) {
      db.users[sender].limit -= limitCost;
      
      setTimeout(() => {
        context.Nreply(
          `> 💡 *Informasi:* Kamu telah menggunakan fitur yang mengurangi ${limitCost} limit\n` +
          `> *- Limit kamu saat ini:* ${db.users[sender].limit} tersisa ☘️\n` +
          `> *- Catatan:* Limit akan direset pada pukul 02:00 WIB setiap harinya.`
        );
      }, 1500);
      
      return true;
    }

    await context.Nreply(
      `> ❌ *Maaf!* Limit kamu tidak cukup untuk menggunakan fitur ini.\n` +
      `> *- Limit dibutuhkan:* ${limitCost}\n` +
      `> *- Limit kamu saat ini:* ${db.users[sender].limit}\n` +
      `> *- Catatan:* Tunggu reset limit pada pukul 02:00 WIB atau beli tambahan limit di toko.`
    );
    return false;
  }

  /**
   * Handle command with available plugins - optimized for performance
   * @param {Object} m - Message object
   * @param {Object} context - Context providing access to bot functions and data
   * @param {string} command - Command to handle
   * @returns {boolean} Whether a plugin handled the command
   */
  async handleCommand(m, pluginContext, commandParam) {
    try {
      if (!this.pluginsLoaded || this.plugins.length === 0) {
        await this.loadPlugins();
      }
      
      await this.checkUserDatabase(m, pluginContext);
      
      const { Nreply, reactionMessage } = pluginContext;
      const command = commandParam || pluginContext.command;
      
      if (!command) return false;
      
      const cmdLower = command.toLowerCase();
      
      let matchedPlugin = null;
      for (const plugin of this.plugins) {
        if (plugin.__commandMap && plugin.__commandMap[cmdLower]) {
          matchedPlugin = plugin;
          break;
        } else if (plugin.command && plugin.command.includes(cmdLower)) {
          matchedPlugin = plugin;
          break;
        }
      }
      
      if (matchedPlugin) {
        const permission = this.checkPermission(matchedPlugin, pluginContext);
        if (!permission.allowed) {
          await Nreply(permission.reason);
          return true;
        }
        
        const hasLimit = await this.checkLimit(m, pluginContext, matchedPlugin);
        if (!hasLimit) {
          return true;
        }

        try {
          await matchedPlugin(m, pluginContext);
          return true;
        } catch (pluginError) {
          const pluginPath = matchedPlugin.__filename || 'Unknown plugin path';
          const pluginName = matchedPlugin.command?.[0] || 'Unknown plugin';
          
          let stackTrace = 'Stack trace not available';
          if (pluginError.stack) {
            const stackLines = pluginError.stack.split('\n');
            stackTrace = stackLines.slice(0, 3).join('\n');
          }
          const errorMessage = `*[Warning]* waduh ada yang error pada fitur *${pluginName}*\n\n\n${readmore}` +
                            `Yang tau tau aja\n*Error:* ${pluginError.message || 'Unknown error'}\n` +
                            `*Stack:* ${stackTrace}`;
          
          console.error(`Plugin execution error:`, {
            plugin: pluginName,
            path: pluginPath,
            error: pluginError
          });
          
          await Nreply(errorMessage);
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error plugin command:", error);
      return false;
    }
  }

  /**
   * Get list of all available commands from plugins with performance optimization
   * @param {Object} context - Context for checking permissions
   * @returns {Object} Commands grouped by category
   */
  getCommands(context) {
  const contextKey = context ? `${context.sender}_${context.isGroup ? 'group' : 'private'}_${context.isAdmins ? 'admin' : 'user'}_${context.isCreator ? 'creator' : 'noncreator'}` : 'default';
  
  if (this.commandCache && this.commandCache[contextKey]) {
    return this.commandCache[contextKey];
  }
  
  const commands = {};
  
  const hiddenCommands = ['next', 'rnext'];
  
  this.plugins.forEach(plugin => {
    if (!plugin.command) {
      return;
    }
    
    if (context) {
      const permission = this.checkPermission(plugin, context);
      if (!permission.allowed) {
        return;
      }
    }
    
    const category = plugin.category ? 
      (Array.isArray(plugin.category) ? plugin.category[0] : plugin.category) : 
      (plugin.category || "Uncategorized");
    
    const categoryName = typeof category === 'string' ? 
      (category.endsWith(" Menu") ? category : `${category} Menu`) : 
      "Uncategorized Menu";
    
    if (!commands[categoryName]) {
      commands[categoryName] = [];
    }
    
    let mainCommand = '';
    let aliases = [];
    let hiddenAliases = [];
    
    if (Array.isArray(plugin.command)) {
      mainCommand = plugin.command[0];
      plugin.command.slice(1).forEach(cmd => {
        if (hiddenCommands.includes(cmd.toLowerCase()) || plugin.hiddenAliases?.includes(cmd)) {
          hiddenAliases.push(cmd);
        } else {
          aliases.push(cmd);
        }
      });
    } else if (plugin.command instanceof RegExp) {
      const regexStr = plugin.command.toString();
      const match = regexStr.match(/\^\(([^)]+)\)\$/i);
      
      if (match && match[1]) {
        const options = match[1].split('|');
        if (options.length > 0) {
          mainCommand = options[0];
          
          options.slice(1).forEach(cmd => {
            if (hiddenCommands.includes(cmd.toLowerCase()) || plugin.hiddenAliases?.includes(cmd)) {
              hiddenAliases.push(cmd);
            } else {
              aliases.push(cmd);
            }
          });
        }
      } else {
        mainCommand = regexStr;
      }
    } else if (typeof plugin.command === 'string') {
      mainCommand = plugin.command;
    } else {
      return;
    }
    
    if (hiddenCommands.includes(mainCommand.toLowerCase()) || plugin.menuHide) {
      return;
    }
    
    if (mainCommand) {
      commands[categoryName].push({
        name: mainCommand,
        aliases: aliases,
        hideCmd: hiddenAliases,
        description: plugin.description || "No description provided",
        restrict: plugin.restrict || null,
        limit: plugin.limit || 0,
        menuHide: plugin.menuHide || false
      });
    }
  });

  if (!this.commandCache) this.commandCache = {};
  this.commandCache[contextKey] = commands;
  
  return commands;
}

  /**
   * Clear command cache when plugins are reloaded
   */
  clearCommandCache() {
    this.commandCache = {};
    this.permissionCache.clear();
  }

  /**
   * Reload a specific plugin or all plugins
   * @param {string} [pluginName] - Optional plugin name to reload
   * @returns {boolean} Success status
   */
  async reloadPlugins(pluginName = null) {
    try {
      if (pluginName) {
        const plugin = this.plugins.find(p => 
          p.command && p.command.includes(pluginName.toLowerCase())
        );
        
        if (!plugin) {
          console.log(`Plugin ${pluginName} not found`);
          return false;
        }
        
        const pluginPath = plugin.__filename;
        if (!pluginPath) {
          console.log(`Cannot find file path for plugin ${pluginName}`);
          return false;
        }
        
        const resolvedPath = require.resolve(pluginPath);
        delete require.cache[resolvedPath];
        
        this.plugins = this.plugins.filter(p => p !== plugin);
        
        const reloadedPlugin = require(pluginPath);
        reloadedPlugin.__filename = pluginPath;
        
        if (reloadedPlugin.command && Array.isArray(reloadedPlugin.command)) {
          reloadedPlugin.__commandMap = {};
          reloadedPlugin.command.forEach(cmd => {
            reloadedPlugin.__commandMap[cmd.toLowerCase()] = true;
          });
        }
        
        this.plugins.push(reloadedPlugin);
        
        this.clearCommandCache();
        console.log(`Reloaded plugin: ${pluginName}`);
      } else {
        this.pluginsLoaded = false;
        this.clearCommandCache();
        await this.loadPlugins();
      }
      
      return true;
    } catch (error) {
      console.error("Error reloading plugins:", error);
      return false;
    }
  }
}

const pluginController = new PluginController();
module.exports = pluginController;
