require('../settings');
const fs = require('fs');
const path = require('path');
const readmore = String.fromCharCode(8206).repeat(4001);

/**
 * Plugin Controller Class
 */
class PluginController {
  constructor() {
    this.plugins = [];
    this.pluginsDirectory = path.resolve(__dirname, "plugins");
  }

  /**
   * Load all plugins from the plugins directory
   * @returns {Promise<Array>} Array of loaded plugins
   */
  async loadPlugins() {
    try {
      this.plugins = [];
      await this.scanDirectory(this.pluginsDirectory);
      console.log(`Successfully loaded ${this.plugins.length} plugins`);
      return this.plugins;
    } catch (error) {
      console.error("Error loading plugins:", error);
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
          // Clear cache to reload updated plugins
          if (require.cache[resolvedPath]) {
            delete require.cache[resolvedPath];
          }
          
          const plugin = require(itemPath);
          
          // Check if plugin is valid (function with command property)
          if (plugin && typeof plugin === 'function' && Array.isArray(plugin.command)) {
            // Store the filename for reloading purposes
            plugin.__filename = itemPath;
            this.plugins.push(plugin);
          } else {
            const relativePath = path.relative(this.pluginsDirectory, itemPath);
            console.log(`Skipping invalid plugin: ${relativePath} (missing required properties)`);
          }
        } catch (error) {
          const relativePath = path.relative(this.pluginsDirectory, itemPath);
          console.error(`Error loading plugin ${relativePath}:`, error);
          
          // Create log for failed plugins
          const errorLog = {
            plugin: item,
            path: relativePath,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
          };
          
          // Log to file (optional)
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
    
    // Create logs directory if it doesn't exist
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
   * Check if user has permission to use the plugin
   * @param {Object} plugin - Plugin to check
   * @param {Object} context - Context with user info
   * @returns {Object} {allowed: boolean, reason: string}
   */
  checkPermission(plugin, context) {
    // Default permission result
    const result = { allowed: true, reason: "" };
    
    // If no restrictions are defined, allow all
    if (!plugin.restrict) {
      return result;
    }

    // Check owner only restriction
    if (plugin.restrict.ownerOnly && !context.isCreator) {
      result.allowed = false;
      result.reason = mess.owner;
      return result;
    }

    // Check premium only restriction
    if (plugin.restrict.premiumOnly && !context.isPremium) {
      result.allowed = false;
      result.reason = mess.premium;
      return result;
    }

    // Check group only restriction
    if (plugin.restrict.groupOnly && !context.isGroup) {
      result.allowed = false;
      result.reason = mess.group;
      return result;
    }

    // Check private only restriction
    if (plugin.restrict.privateOnly && context.isGroup) {
      result.allowed = false;
      result.reason = mess.private;
      return result;
    }

    // Check admin only restriction
    if (plugin.restrict.adminOnly && context.isGroup && !context.isAdmins) {
      result.allowed = false;
      result.reason = mess.admin;
      return result;
    }

    // Check bot admin restriction
    if (plugin.restrict.botAdminOnly && context.isGroup && !context.isBotAdmins) {
      result.allowed = false;
      result.reason = mess.botAdmin;
      return result;
    }

    return result;
  }

/**
 * Handle command with available plugins
 * @param {Object} m - Message object
 * @param {Object} context - Context providing access to bot functions and data
 * @param {string} command - Command to handle
 * @returns {boolean} Whether a plugin handled the command
 */
async handleCommand(m, context, command) {
  try {
    // Ensure plugins are loaded
    if (this.plugins.length === 0) {
      await this.loadPlugins();
    }

    // Find matching plugin
    for (const plugin of this.plugins) {
      if (plugin.command && plugin.command.includes(command.toLowerCase())) {
        // Check permission
        const permission = this.checkPermission(plugin, context);
        if (!permission.allowed) {
          await m.reply(permission.reason);
          return true; // Command was handled (with rejection)
        }

        // Execute plugin if permission granted
        if (typeof plugin === "function") {
          try {
            await plugin(m, context);
            return true;
          } catch (pluginError) {
            // Get plugin details
            const pluginPath = plugin.__filename || 'Unknown plugin path';
            const pluginName = plugin.command[0] || 'Unknown plugin';
            
            let stackTrace = 'Stack trace not available';
            if (pluginError.stack) {
              const stackLines = pluginError.stack.split('\n');
              stackTrace = stackLines.slice(0, 3).join('\n');
            }
            // Format error message
            const errorMessage = `*[Warning]* waduh ada yang error pada fitur *${pluginName}*\n\n\n${readmore}` +
                              `Yang tau tau aja\n*Error:* ${pluginError.message || 'Unknown error'}\n` +
                              `*Stack:* ${stackTrace}`;
            
            // Log error to console for debugging
            console.error(`Plugin execution error:`, {
              plugin: pluginName,
              path: pluginPath,
              error: pluginError
            });
            
            // Reply to user with error information
            await m.reply(errorMessage);
            
            return true; // Command was handled (with error)
          }
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error plugin command:", error);
    await m.reply(`⚠️ Error: ${error.message}`);
    return false;
  }
}

  /**
   * Get list of all available commands from plugins
   * @param {Object} context - Context for checking permissions
   * @returns {Object} Commands grouped by category
   */
  getCommands(context) {
    const commands = {};
    
    this.plugins.forEach(plugin => {
      if (plugin.command && Array.isArray(plugin.command)) {
        // Check permission if context is provided
        if (context) {
          const permission = this.checkPermission(plugin, context);
          if (!permission.allowed) {
            return; // Skip this plugin if user doesn't have permission
          }
        }
        
        const category = plugin.category || "Uncategorized";
        
        if (!commands[category]) {
          commands[category] = [];
        }
        
        commands[category].push({
          name: plugin.command[0],
          aliases: plugin.command.slice(1),
          description: plugin.description || "No description provided",
          restrict: plugin.restrict || null
        });
      }
    });
    
    return commands;
  }

  /**
   * Reload a specific plugin or all plugins
   * @param {string} [pluginName] - Optional plugin name to reload
   * @returns {boolean} Success status
   */
  async reloadPlugins(pluginName = null) {
    try {
      if (pluginName) {
        // Find the plugin to reload
        const plugin = this.plugins.find(p => 
          p.command && p.command.includes(pluginName.toLowerCase())
        );
        
        if (!plugin) {
          console.log(`Plugin ${pluginName} not found`);
          return false;
        }
        
        // Get the filename
        const pluginPath = plugin.__filename;
        if (!pluginPath) {
          console.log(`Cannot find file path for plugin ${pluginName}`);
          return false;
        }
        
        // Clear require cache
        const resolvedPath = require.resolve(pluginPath);
        delete require.cache[resolvedPath];
        
        // Remove the old plugin
        this.plugins = this.plugins.filter(p => p !== plugin);
        
        // Add the reloaded plugin
        const reloadedPlugin = require(pluginPath);
        reloadedPlugin.__filename = pluginPath;
        this.plugins.push(reloadedPlugin);
        
        console.log(`Reloaded plugin: ${pluginName}`);
      } else {
        // Reload all plugins
        await this.loadPlugins();
      }
      
      return true;
    } catch (error) {
      console.error("Error reloading plugins:", error);
      return false;
    }
  }
}

// Export a singleton instance
const pluginController = new PluginController();
module.exports = pluginController;
