const axios = require('axios');

const pinterest = {
    api: {
        base: "https://www.pinterest.com",
        endpoints: {
            search: "/resource/BaseSearchResource/get/",
            pin: "/resource/PinResource/get/",
            user: "/resource/UserResource/get/"
        }
    },

    headers: {
        'accept': 'application/json, text/javascript, */*, q=0.01',
        'referer': 'https://www.pinterest.com/',
        'user-agent': 'Postify/1.0.0',
        'x-app-version': 'a9522f',
        'x-pinterest-appstate': 'active',
        'x-pinterest-pws-handler': 'www/[username]/[slug].js',
        'x-pinterest-source-url': '/search/pins/?rs=typed&q=kucing%20anggora/',
        'x-requested-with': 'XMLHttpRequest'
    },

    isUrl: (str) => {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    },

    isPin: (url) => {
    if (!url) return false;
    const patterns = [
        /^https?:\/\/(?:www\.)?pinterest\.com\/pin\/[\w.-]+/,
        /^https?:\/\/(?:www\.)?pinterest\.[\w.]+\/pin\/[\w.-]+/,
        /^https?:\/\/(?:www\.)?pinterest\.(?:ca|co\.uk|com\.au|de|fr|id|es|mx|br|pt|jp|kr|nz|ru|at|be|ch|cl|dk|fi|gr|ie|nl|no|pl|pt|se|th|tr)\/pin\/[\w.-]+/,
        /^https?:\/\/pin\.it\/[\w.-]+/,
        /^https?:\/\/(?:www\.)?pinterest\.com\/amp\/pin\/[\w.-]+/,
        /^https?:\/\/(?:[a-z]{2}|www)\.pinterest\.com\/pin\/[\w.-]+/,
        /^https?:\/\/(?:www\.)?pinterest\.com\/pin\/[\d]+(?:\/)?$/,
        /^https?:\/\/(?:www\.)?pinterest\.[\w.]+\/pin\/[\d]+(?:\/)?$/,
        /^https?:\/\/(?:www\.)?pinterestcn\.com\/pin\/[\w.-]+/,
        /^https?:\/\/(?:www\.)?pinterest\.com\.[\w.]+\/pin\/[\w.-]+/
    ];
    
    const clean = url.trim().toLowerCase();   
    return patterns.some(pattern => pattern.test(clean));
},

    getCookies: async () => {
        try {
            const response = await axios.get(pinterest.api.base);
            const setHeaders = response.headers['set-cookie'];
            if (setHeaders) {
                const cookies = setHeaders.map(cookieString => {
                    const cp = cookieString.split(';');
                    const cv = cp[0].trim();
                    return cv;
                });
                return cookies.join('; ');
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    search: async (query, limit = 10) => {
        if (!query) {
            return {
                status: false,
                code: 400,
                result: {
                    message: "Bree, lu ngetik apa sih? Query nya literally kosong begini? Emangnya gua punya third eye buat nebak apa? Minimal effort lah ya 🙄✋"
                }
            };
        }

        try {
            const cookies = await pinterest.getCookies();
            if (!cookies) {
                return {
                    status: false,
                    code: 400,
                    result: { 
                        message: "Cookies nya failed retrieve nih. Nanti lagi ae yak.." 
                    }
                };
            }

            const params = {
                source_url: `/search/pins/?q=${query}`,
                data: JSON.stringify({
                    options: {
                        isPrefetch: false,
                        query: query,
                        scope: "pins",
                        bookmarks: [""],
                        no_fetch_context_on_resource: false,
                        page_size: limit
                    },
                    context: {}
                }),
                _: Date.now()
            };

            const { data } = await axios.get(`${pinterest.api.base}${pinterest.api.endpoints.search}`, {
                headers: { ...pinterest.headers, 'cookie': cookies },
                params: params
            });

            const container = [];
            const results = data.resource_response.data.results.filter((v) => v.images?.orig);
            
            results.forEach((result) => {
                container.push({
                    id: result.id,
                    title: result.title || "",
                    description: result.description,
                    pin_url: `https://pinterest.com/pin/${result.id}`,
                    media: {
                        images: {
                            orig: result.images.orig,
                            small: result.images['236x'],
                            medium: result.images['474x'],
                            large: result.images['736x']
                        },
                        video: result.videos ? {
                            video_list: result.videos.video_list,
                            duration: result.videos.duration,
                            video_url: result.videos.video_url
                        } : null
                    },
                    uploader: {
                        username: result.pinner.username,
                        full_name: result.pinner.full_name,
                        profile_url: `https://pinterest.com/${result.pinner.username}`
                    }
                });
            });

            if (container.length === 0) {
                return {
                    status: false,
                    code: 404,
                    result: {
                        message: `Anjir bree, literally gua kagak nemu apa2 buat input "${query}". Like seriously, searching skill lu perlu diimprove deh. No offense yak, but try harder gitu 🤪`
                    }
                };
            }

            return {
                status: true,
                code: 200,
                result: {
                    query: query,
                    total: container.length,
                    pins: container
                }
            };

        } catch (error) {
            return {
                status: false,
                code: error.response?.status || 500,
                result: { 
                    message: "Servernya lagi chaos bree! Lu ganggu mulu sih, Servernya butuh break. Try again later yak 😂" 
                }
            };
        }
    },

    download: async (pinUrl) => {
        if (!pinUrl) {
            return {
                status: false,
                code: 400,
                result: {
                    message: "Lu ngasih gw link kosong bree? Like seriously? Mau download angin lu? Minimal effort kek, cape gua tuh 😮‍💨✋"
                }
            };
        }

        if (!pinterest.isUrl(pinUrl)) {
            return {
                status: false,
                code: 400,
                result: {
                    message: "Link apaan nih? 😂\nHadeh basic url aja lu kagak tau breee, astaga 🙃"
                }
            };
        }

        if (!pinterest.isPin(pinUrl)) {
            return {
                status: false,
                code: 400,
                result: {
                    message: "Ampuuun aing mah 😔, ini mah bukan link pinterest atuh bree 😭"
                }
            };
        }

        try {
            const pinId = pinUrl.split('/pin/')[1].replace('/', '');
            const cookies = await pinterest.getCookies();
            
            if (!cookies) {
                return {
                    status: false,
                    code: 400,
                    result: {
                        message: "Cookies nya failed retrieve nih. Nanti lagi ae yak.. "
                    }
                };
            }

            const params = {
                source_url: `/pin/${pinId}/`,
                data: JSON.stringify({
                    options: {
                        field_set_key: "detailed",
                        id: pinId,
                    },
                    context: {}
                }),
                _: Date.now()
            };

            const { data } = await axios.get(`${pinterest.api.base}${pinterest.api.endpoints.pin}`, {
                headers: { ...pinterest.headers, 'cookie': cookies },
                params: params
            });

            if (!data.resource_response.data) {
                return {
                    status: false,
                    code: 404,
                    result: {
                        message: "Pinnya udah kagak ada bree, gone, expired, delete from earth keknya! Tapi harusnya lu nyari yang exist aja napa? Capek gua jelasin mulu 🗿"
                    }
                };
            }

            const pd = data.resource_response.data;
            const mediaUrls = [];

            if (pd.videos) {
                const videoFormats = Object.values(pd.videos.video_list)
                    .sort((a, b) => b.width - a.width);
                
                videoFormats.forEach(video => {
                    mediaUrls.push({
                        type: 'video',
                        quality: `${video.width}x${video.height}`,
                        width: video.width,
                        height: video.height,
                        duration: pd.videos.duration || null,
                        url: video.url,
                        file_size: video.file_size || null,
                        thumbnail: pd.images.orig.url
                    });
                });
            }

            if (pd.images) {
                const imge = {
                    'original': pd.images.orig,
                    'large': pd.images['736x'],
                    'medium': pd.images['474x'],
                    'small': pd.images['236x'],
                    'thumbnail': pd.images['170x']
                };

                Object.entries(imge).forEach(([quality, image]) => {
                    if (image) {
                        mediaUrls.push({
                            type: 'image',
                            quality: quality,
                            width: image.width,
                            height: image.height,
                            url: image.url,
                            size: `${image.width}x${image.height}`
                        });
                    }
                });
            }

            if (mediaUrls.length === 0) {
                return {
                    status: false,
                    code: 404,
                    result: {
                        message: "Anjir bree, pin nya literally kagak ada medianya! Lu expect gua download apaan? Vibes doang? Freak bgt sih 😭"
                    }
                };
            }

            return {
                status: true,
                code: 200,
                result: {
                    id: pd.id,
                    title: pd.title || pd.grid_title || "",
                    description: pd.description || "",
                    created_at: pd.created_at,
                    dominant_color: pd.dominant_color || null,
                    link: pd.link || null,
                    category: pd.category || null,
                    media_urls: mediaUrls,
                    statistics: {
                        saves: pd.repin_count || 0,
                        comments: pd.comment_count || 0,
                        reactions: pd.reaction_counts || {},
                        total_reactions: pd.total_reaction_count || 0,
                        views: pd.view_count || 0,
                        saves_by_category: pd.aggregated_pin_data?.aggregated_stats || {},
                    },
                    source: {
                        name: pd.domain || null,
                        url: pd.link || null,
                        favicon: pd.favicon_url || null,
                        provider: pd.provider_name || null,
                        rating: pd.embed?.src_rating || null
                    },
                    board: {
                        id: pd.board?.id || null,
                        name: pd.board?.name || null,
                        url: pd.board?.url ? `https://pinterest.com${pd.board.url}` : null,
                        owner: {
                            id: pd.board?.owner?.id || null,
                            username: pd.board?.owner?.username || null
                        }
                    },
                    uploader: {
                        id: pd.pinner?.id || null,
                        username: pd.pinner?.username || null,
                        full_name: pd.pinner?.full_name || null,
                        profile_url: pd.pinner?.username ? `https://pinterest.com/${pd.pinner.username}` : null,
                        image: {
                            small: pd.pinner?.image_small_url || null,
                            medium: pd.pinner?.image_medium_url || null,
                            large: pd.pinner?.image_large_url || null,
                            original: pd.pinner?.image_xlarge_url || null
                        },
                        type: pd.pinner?.type || "user",
                        is_verified: pd.pinner?.verified_identity || false
                    },
                    metadata: {
                        article: pd.article || null,
                        product: {
                            price: pd.price_value || null,
                            currency: pd.price_currency || null,
                            availability: pd.shopping_flags || null,
                            ratings: pd.rating || null,
                            reviews_count: pd.review_count || null
                        },
                        recipe: pd.recipe || null,
                        video: pd.videos ? {
                            duration: pd.videos.duration || null,
                            views: pd.videos.video_view_count || null,
                            cover: pd.videos.cover_image_url || null
                        } : null
                    },
                    is_promoted: pd.is_promoted || false,
                    is_downloadable: pd.is_downloadable || true,
                    is_playable: pd.is_playable || false,
                    is_repin: pd.is_repin || false,
                    is_video: pd.is_video || false,
                    has_required_attribution: pd.attribution || null,
                    privacy_level: pd.privacy || "public",
                    tags: pd.pin_join?.annotations || [],
                    hashtags: pd.hashtags || [],
                    did_it_data: pd.did_it_data || null,
                    native_creator: pd.native_creator || null,
                    sponsor: pd.sponsor || null,
                    visual_search_objects: pd.visual_search_objects || []
                }
            };

        } catch (error) {
            if (error.response?.status === 404) {
                return {
                    status: false,
                    code: 404,
                    result: {
                        message: "Pinnya udah kagak ada bree, gone, expired, delete from earth keknya! Tapi harusnya lu nyari yang exist aja napa? Capek gua jelasin mulu 🗿"
                    }
                };
            }

            return {
                status: false,
                code: error.response?.status || 500,
                result: {
                    message: "Servernya lagi chaos bree! Lu ganggu mulu sih, Servernya butuh me time. Try again later yak 😂"
                }
            };
        }
    },

    profile: async (username) => {
        if (!username) {
            return {
                status: false,
                code: 400,
                result: {
                    message: "Usernamenya mana bree? Lu expect gua jadi paranormal gitu? Minimal kasi username lah yak 🙄"
                }
            };
        }

        try {
            const cookies = await pinterest.getCookies();
            if (!cookies) {
                return {
                    status: false,
                    code: 400,
                    result: {
                        message: "Cookies nya failed retrieve nih. Nanti lagi ae yak.. "
                    }
                };
            }

            const params = {
                source_url: `/${username}/`,
                data: JSON.stringify({
                    options: {
                        username: username,
                        field_set_key: "profile",
                        isPrefetch: false,
                    },
                    context: {}
                }),
                _: Date.now()
            };

            const { data } = await axios.get(`${pinterest.api.base}${pinterest.api.endpoints.user}`, {
                headers: { ...pinterest.headers, 'cookie': cookies },
                params: params
            });

            if (!data.resource_response.data) {
                return {
                    status: false,
                    code: 404,
                    result: {
                        message: "Usernya kagak exist bree! Lu stalking siapa sih sebenernya? 🤨"
                    }
                };
            }

            const userx = data.resource_response.data;
            
            return {
                status: true,
                code: 200,
                result: {
                    id: userx.id,
                    username: userx.username,
                    full_name: userx.full_name || "",
                    bio: userx.about || "",
                    email: userx.email || null,
                    type: userx.type || "user",
                    profile_url: `https://pinterest.com/${userx.username}`,
                    image: {
                        small: userx.image_small_url || null,
                        medium: userx.image_medium_url || null,
                        large: userx.image_large_url || null,
                        original: userx.image_xlarge_url || null
                    },
                    stats: {
                        pins: userx.pin_count || 0,
                        followers: userx.follower_count || 0,
                        following: userx.following_count || 0,
                        boards: userx.board_count || 0,
                        likes: userx.like_count || 0,
                        saves: userx.save_count || 0
                    },
                    website: userx.website_url || null,
                    domain_url: userx.domain_url || null,
                    domain_verified: userx.domain_verified || false,
                    explicitly_followed_by_me: userx.explicitly_followed_by_me || false,
                    implicitly_followed_by_me: userx.implicitly_followed_by_me || false,
                    location: userx.location || null,
                    country: userx.country || null,
                    is_verified: userx.verified_identity || false,
                    is_partner: userx.is_partner || false,
                    is_indexed: userx.indexed || false,
                    is_tastemaker: userx.is_tastemaker || false,
                    is_employee: userx.is_employee || false,
                    is_blocked: userx.blocked_by_me || false,
                    meta: {
                        first_name: userx.first_name || null,
                        last_name: userx.last_name || null,
                        full_name: userx.full_name || "",
                        locale: userx.locale || null,
                        gender: userx.gender || null,
                        partner: {
                            is_partner: userx.is_partner || false,
                            partner_type: userx.partner_type || null
                        }
                    },
                    account_type: userx.account_type || null,
                    personalize_pins: userx.personalize || false,
                    connected_to_etsy: userx.connected_to_etsy || false,
                    has_password: userx.has_password || true,
                    has_mfa: userx.has_mfa || false,
                    created_at: userx.created_at || null,
                    last_login: userx.last_login || null,
                    social_links: {
                        twitter: userx.twitter_url || null,
                        facebook: userx.facebook_url || null,
                        instagram: userx.instagram_url || null,
                        youtube: userx.youtube_url || null,
                        etsy: userx.etsy_url || null
                    },
                    custom_gender: userx.custom_gender || null,
                    pronouns: userx.pronouns || null,
                    board_classifications: userx.board_classifications || {},
                    interests: userx.interests || []
                }
            };

        } catch (error) {
            if (error.response?.status === 404) {
                return {
                    status: false,
                    code: 404,
                    result: {
                        message: "Username nya kagak valid bree! Lu main asal search aja, googling dulu kek 🙄"
                    }
                };
            }

            return {
                status: false,
                code: error.response?.status || 500,
                result: {
                    message: "Servernya lagi chaos bree! Lu ganggu mulu sih, Servernya butuh break. Try again later yak 😂"
                }
            };
        }
    }
};

module.exports = { pinterest };