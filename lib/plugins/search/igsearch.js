const axios = require('axios')

async function igsearch(query, num = 8) {
  try {
    const params = {
      rsz: 'filtered_cse',
      num,
      hl: 'id',
      source: 'gcsc',
      cselibv: '5c8d58cbdc1332a7',
      cx: 'e500c3a7a523b49df',
      q: query,
      safe: 'off',
      cse_tok: 'AB-tC_5IarUshLDzUwPBHkPli705:1740389570639',
      lr: '',
      cr: '',
      gl: 'ID',
      filter: 0,
      sort: '',
      as_oq: '',
      as_sitesearch: '',
      exp: 'cc,apo',
      fexp: 72801194,
      oq: '',
      gs_l: 'partner-web.1.2.0i512l10.16186.55823.0.59720.6.6.0.0.0.0.263.1046.1j3j2.6.0.csems,nrl=10...0....1j4.34.partner-web..1.5.800.zwFquQkxWWg',
      callback: 'x.y',
      rurl: Buffer.from('aHR0cHM6Ly9yZWVsc2ZpbmRlci5zYXRpc2h5YWRhdi5jb20v','base64').toString(),
    };

    let ab = await axios.get('https://cse.google.com/cse/element/v1', {
      params: params,
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        'x-client-data': 'CJDjygE='
      }
    }).then(rs => rs.data)

    // Better error handling for JSON parsing
    if (!ab || typeof ab !== 'string') {
      return { status: false, msg: 'Invalid response from server' };
    }

    // Extract JSON portion from the response
    const jsonStartIndex = ab.indexOf('{');
    const jsonEndIndex = ab.lastIndexOf('}') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === 0) {
      return { status: false, msg: 'Could not find valid JSON in response' };
    }
    
    const jsonString = ab.slice(jsonStartIndex, jsonEndIndex);
    
    // Parse with error handling
    let jsonData;
    try {
      jsonData = JSON.parse(jsonString);
    } catch (jsonError) {
      return { status: false, msg: `Failed to parse JSON: ${jsonError.message}` };
    }
    
    // Check if results exist
    if (!jsonData || !jsonData.results) {
      return { status: false, msg: 'No results found in response', data: [] };
    }

    let data = jsonData.results.map(item => {
      let url = '#';
      try {
        if (item.unescapedUrl) {
          let i1 = new URL(item.unescapedUrl);
          url = i1.origin + i1.pathname;
        }
      } catch (urlError) {
        console.error('URL parsing error:', urlError);
      }
      
      let fr = (a) => a ? a.replace(/\n/gi,' ').replace(/<(b|\/b)[^>]*>/gi, '*') : '';
      
      return {
        title: fr(item.title),
        desc: fr(item.contentNoFormatting),
        url: url,
      }
    });
    
    return { status: true, data }
  } catch(e) {
    console.error('igsearch full error:', e);
    return { status: false, msg: `Failed to load data, log: ${e.message}`, data: [] }
  }
}

async function igSearchPlugin(m, ctx) {
    const { args } = ctx;
    const query = args.join(' ');
    
    if (!query) return m.reply('Masukkan kata kunci pencarian Instagram!');
    
    try {
        m.reply(`🔍 Mencari di Instagram: "${query}"...`);
        
        const result = await igsearch(query);
        
        if (!result.status) {
            return m.reply(`Error: ${result.msg}`);
        }
        
        // Check if data exists and has items
        if (!result.data || result.data.length === 0) {
            return m.reply(`Tidak ditemukan hasil untuk "${query}"`);
        }
        
        // Format the response with the top results (limiting to first 5 to avoid too long messages)
        const limitedResults = result.data.slice(0, 5);
        
        let responseText = `*INSTAGRAM SEARCH RESULTS*\n\nKeyword: "${query}"\n\n`;
        
        limitedResults.forEach((item, index) => {
            responseText += `*${index + 1}. ${item.title || 'No Title'}*\n`;
            responseText += `${item.desc || 'No Description'}\n`;
            responseText += `🔗 ${item.url || '#'}\n\n`;
        });
        
        responseText += `Showing ${limitedResults.length} of ${result.data.length} results.`;
        
        m.reply(responseText);
    } catch (error) {
        console.error('Error in Instagram search:', error);
        
        // More detailed error message to help with debugging
        const errorMsg = `Terjadi kesalahan saat melakukan pencarian Instagram.\n\nError details: ${error.message}\n\nJika error terus berlanjut, periksa fungsi igsearch.`;
        m.reply(errorMsg);
    }
}

igSearchPlugin.command = ['igsearch', 'searchig', 'carig'];
igSearchPlugin.description = 'Mencari konten Instagram berdasarkan kata kunci';
igSearchPlugin.category = 'search';

module.exports = igSearchPlugin;
