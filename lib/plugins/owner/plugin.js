const fs = require('fs');
const path = require('path');
const pluginController = require('../../plug');

async function pluginManager(m, bill) {
  const { args, command, prefix, quoted } = bill;
  
  if (args.length < 1) {
    return await m.reply(`
🧩 *Plugin Manager*

Perintah yang tersedia:
${prefix}${command} list - Melihat daftar plugin yang tersedia
${prefix}${command} get [nama_plugin] - Mengambil kode plugin
${prefix}${command} add [nama_file] [kategori] - Menambahkan plugin baru (reply ke kode plugin)
${prefix}${command} edit [nama_plugin] - Mengedit isi plugin
${prefix}${command} delete [nama_plugin] - Menghapus plugin
${prefix}${command} reload [nama_plugin] - Mereload plugin
    `);
  }

  const action = args[0].toLowerCase();
  
  switch (action) {
    case 'list':
      return await listPlugins(m, bill);
    
    case 'get':
      if (args.length < 2) {
        return await m.reply(`Gunakan: ${prefix}${command} get [nama_plugin]`);
      }
      return await getPlugin(args[1], m, bill);
    
    case 'add':
      if (args.length < 3 || !m.quoted) {
        return await m.reply(`Gunakan: ${prefix}${command} add [nama_file] [kategori] (reply ke kode plugin)`);
      }
      return await addPlugin(args[1], args[2], m.quoted.text, m, bill);
    
    case 'edit':
      if (args.length < 2) {
        return await m.reply(`Gunakan: ${prefix}${command} edit [nama_plugin]`);
      }
      return await editPlugin(args[1], m, bill);
    
    case 'delete':
      if (args.length < 2) {
        return await m.reply(`Gunakan: ${prefix}${command} delete [nama_plugin]`);
      }
      return await deletePlugin(args[1], m, bill);
    
    case 'reload':
      if (args.length < 2) {
        return await m.reply(`Gunakan: ${prefix}${command} reload [nama_plugin]`);
      }
      return await reloadPlugin(args[1], m, bill);
    
    default:
      return await m.reply(`Aksi tidak dikenal: ${action}`);
  }
}

/**
 * List all available plugins
 */
async function listPlugins(m, bill) {
  const commands = pluginController.getCommands(bill);
  
  let message = `📋 *Daftar Plugin*\n\n`;
  
  for (const [category, plugins] of Object.entries(commands)) {
    message += `╭──────────── •`;
    message += `お *${category}*\n`;
    
    for (const plugin of plugins) {
      message += `┃▢ ${plugin.name}\n`;
    }
    message += `╰──────────── •\n\n`;
  }
  
  await m.reply(message);
}

/**
 * Get plugin source code
 */
async function getPlugin(pluginName, m, bill) {
  const plugin = findPlugin(pluginName);
  
  if (!plugin) {
    return await m.reply(`❌ Plugin '${pluginName}' tidak ditemukan`);
  }
  
  try {
    const pluginPath = plugin.__filename;
    const pluginCode = fs.readFileSync(pluginPath, 'utf8');
    
    await m.reply(`📄 *Source Code Plugin: ${pluginName}*\n\n\`\`\`\n${pluginCode}\n\`\`\``);
  } catch (error) {
    await m.reply(`❌ Error saat mengambil source code plugin: ${error.message}`);
  }
}

/**
 * Add new plugin
 */
async function addPlugin(fileName, category, pluginCode, m, bill) {
  // Validate file name
  if (!fileName.endsWith('.js')) {
    fileName += '.js';
  }
  
  try {
    // Create base plugins directory if not exists
    const pluginsBaseDir = path.resolve(__dirname, '../../plugins');
    if (!fs.existsSync(pluginsBaseDir)) {
      fs.mkdirSync(pluginsBaseDir, { recursive: true });
    }
    
    // Create category directory if not exists
    const categoryDir = path.join(pluginsBaseDir, category.toLowerCase());
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    // Extract plugin name from code or use filename
    const pluginName = fileName.replace('.js', '');
    
    // Check if plugin already exists by filename
    const pluginPath = path.join(categoryDir, fileName);
    if (fs.existsSync(pluginPath)) {
      return await m.reply(`❌ Plugin dengan nama file '${fileName}' sudah ada di kategori '${category}'`);
    }
    
    // Check if code contains required properties (simpler check)
    if (!pluginCode.includes('.command')) {
      return await m.reply(`❌ Kode plugin tidak mengandung properti command yang diperlukan`);
    }
    
    // Write plugin file
    fs.writeFileSync(pluginPath, pluginCode);
    
    // Try to load the plugin to verify it's valid
    try {
      // Clear require cache
      const resolvedPath = require.resolve(pluginPath);
      if (require.cache[resolvedPath]) {
        delete require.cache[resolvedPath];
      }
      
      const loadedPlugin = require(pluginPath);
      
      if (!loadedPlugin || typeof loadedPlugin !== 'function' || !Array.isArray(loadedPlugin.command)) {
        // Remove invalid plugin
        fs.unlinkSync(pluginPath);
        return await m.reply(`❌ Plugin tidak valid. Pastikan format sesuai dan memiliki properti command.`);
      }
    } catch (loadError) {
      // Remove invalid plugin
      fs.unlinkSync(pluginPath);
      return await m.reply(`❌ Error saat memuat plugin: ${loadError.message}`);
    }
    
    // Reload all plugins
    await pluginController.loadPlugins();
    
    await m.reply(`✅ Plugin '${pluginName}' berhasil dibuat di \`plugins/${category.toLowerCase()}/${fileName}\``);
  } catch (error) {
    await m.reply(`❌ Error saat membuat plugin: ${error.message}`);
  }
}

/**
 * Edit plugin - Simplified
 */
async function editPlugin(pluginName, m, bill) {
  const plugin = findPlugin(pluginName);
  
  if (!plugin) {
    return await m.reply(`❌ Plugin '${pluginName}' tidak ditemukan`);
  }
  
  try {
    const pluginPath = plugin.__filename;
    const pluginCode = fs.readFileSync(pluginPath, 'utf8');
    
    await m.reply(`🔄 *Plugin '${pluginName}'*\n\nKode saat ini:\n\`\`\`javascript\n${pluginCode}\n\`\`\`\n\nUntuk mengedit plugin ini, gunakan:\n${bill.prefix}plugin add ${path.basename(pluginPath)} ${path.basename(path.dirname(pluginPath))}\n\nReply pesan dengan kode yang sudah diedit.`);
    
  } catch (error) {
    await m.reply(`❌ Error saat mengambil plugin: ${error.message}`);
  }
}

/**
 * Delete plugin - Simplified
 */
async function deletePlugin(pluginName, m, bill) {
  const plugin = findPlugin(pluginName);
  
  if (!plugin) {
    return await m.reply(`❌ Plugin '${pluginName}' tidak ditemukan`);
  }
  
  try {
    const pluginPath = plugin.__filename;
    const relativePath = path.relative(path.resolve(__dirname, '../../..'), pluginPath);
    
    // Delete the file directly
    fs.unlinkSync(pluginPath);
    
    // Reload plugins
    await pluginController.loadPlugins();
    
    await m.reply(`✅ Plugin '${pluginName}' berhasil dihapus dari ${relativePath}`);
  } catch (error) {
    await m.reply(`❌ Error saat menghapus plugin: ${error.message}`);
  }
}

/**
 * Reload plugin
 */
async function reloadPlugin(pluginName, m, bill) {
  try {
    const result = await pluginController.reloadPlugins(pluginName);
    
    if (result) {
      await m.reply(`✅ Plugin '${pluginName}' berhasil di-reload`);
    } else {
      await m.reply(`❌ Plugin '${pluginName}' tidak ditemukan atau gagal di-reload`);
    }
  } catch (error) {
    await m.reply(`❌ Error saat me-reload plugin: ${error.message}`);
  }
}

/**
 * Find plugin by name
 */
function findPlugin(pluginName) {
  return pluginController.plugins.find(plugin => 
    plugin.command && plugin.command.includes(pluginName.toLowerCase())
  );
}

// Plugin configuration
pluginManager.command = ["plugin", "plugins"];
pluginManager.category = "owner";
pluginManager.description = "Plugin untuk mengelola plugin lainnya (add, delete, get, edit)";
pluginManager.restrict = {
  ownerOnly: true
};

module.exports = pluginManager;
