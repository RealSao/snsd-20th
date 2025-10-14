// src/data/discography.ts
import { pad2, monthToNumber, ymdKey } from "@/lib/date";

/** New album types (as requested) */
export type AlbumType =
    | "Korean Single"
    | "Korean Album"
    | "Japanese Single"
    | "Japanese Album"
    | "Collaboration"   // (spelled per your request)
    | "Repackage"
    | "Soundtrack"
    | "Mini Album"
    | "Remix"
    | "Participation"
    | "TTS"
    | "Oh-GG"
    | "Live";

export type Track = {
    no: number;
    title: string;
    duration?: string;
    titleTrack?: boolean;
    note?: string;
};

export type RepackageMeta = {
    baseTitle: string;   // title of the original/base album
    addedTracks: Track[]; // only the newly-added songs
};

/** Optional search helpers */
type Keyword = string;

export type DiscographyItem = {
    id: string; slug: string;
    title: string;
    type: AlbumType;
    date: { year: number; month: number; day?: number };
    cover: string;
    eraAnchor?: string;
    catalog?: string;
    links?: { spotify?: string; apple?: string; youtube?: string };
    tracks: Track[];            // full tracks if available; can be empty for repackages
    repackage?: RepackageMeta;  // present if this is a repackage
    keywords?: Keyword[];       // aliases for smarter search (e.g., "IGAB", "소원을 말해봐")
};

const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const idFor = (d: DiscographyItem["date"], title: string) => {
    const y = d.year;
    const m = pad2(monthToNumber(d.month));
    const day = pad2(d.day ?? 1);
    return `${y}-${m}-${day}-${slugify(title)}`;
};

type DiscographySeed = Omit<DiscographyItem, "id" | "slug">;

const SEED = [
    {
        title: "Into the New World",
        type: "Korean Single",
        date: { year: 2007, month: 8, day: 2 },
        cover: "/images/eras/2007-itnw.jpg",
        eraAnchor: ymdKey(2007, 8, 5, "Into the New World"),
        keywords: ["itnw", "Into the New World"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/into-the-new-world-ep/854926859"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/6EmLwnyjJRVgNOmOUpVhzz?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Into the New World", duration: "4:25", titleTrack: true },
            { no: 2, title: "Beginning" },
            { no: 3, title: "Perfect for You (Honey)" },
            { no: 4, title: "Into the New World (Instrumental)" },
        ],
    },

    {
        title: "ITNW (Remix)",
        type: "Remix",
        date: { year: 2007, month: 9, day: 12 },
        cover: "/images/eras/2007-itnw.jpg",
        eraAnchor: ymdKey(2007, 9, 12, "Into the New World"),
        keywords: ["itnw", "Into the New World"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/into-the-new-world-remix-single/854885892"></iframe>',
        },
        tracks: [
            { no: 1, title: "Into the New World (Remix)", titleTrack: true },
        ],
    },

    {
        title: "Girls’ Generation",
        type: "Korean Album",
        date: { year: 2007, month: 11, day: 1 },
        cover: "/images/eras/2007-gg.jpg",
        eraAnchor: ymdKey(2007, 11, 1, "Girls' Generation"),
        keywords: ["girls generation", "gg"],
        links: {
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/2U1BPwhkzHt05OFugiSB3g?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/girls-generation/854885986"></iframe>',
        },
        tracks: [
            { no: 1, title: "Girls’ Generation", titleTrack: true },
            { no: 2, title: "Ooh La-La!" },
            { no: 3, title: "Baby Baby" },
            { no: 4, title: "Complete" },
            { no: 5, title: "Kissing You", titleTrack: true },
            { no: 6, title: "Merry-Go-Round" },
            { no: 7, title: "Tears" },
            { no: 8, title: "Tinkerbell" },
            { no: 9, title: "7989" },
            { no: 10, title: "Honey" },
            { no: 11, title: "Into the New World", titleTrack: true },
        ],
    },

    {
        title: "La La La",
        type: "Collaboration",
        date: { year: 2007, month: 12, day: 7 },
        cover: "/images/eras/2007-lalala.jpg",
        eraAnchor: ymdKey(2007, 12, 7, "La La La"),
        keywords: ["lalala"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="175" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/song/%EB%9E%84%EB%9E%84%EB%9D%BC/1448823387"></iframe>',
        },
        tracks: [
            { no: 1, title: "La La La (with Yoon Sang)", titleTrack: true },
        ],
    },

    {
        title: "Baby Baby",
        type: "Repackage", // ← fill manually later
        date: { year: 2008, month: 3, day: 13 },
        cover: "/images/eras/2008-bb.jpg",
        eraAnchor: ymdKey(2008, 3, 13, "Baby Baby"),
        keywords: ["bb", "Baby Baby"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/baby-baby-girls-generation-repackaged/854886469"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/4WzpK0mIeVP4igTpG5pdeg?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        repackage: {
            baseTitle: "Girls’ Generation",
            addedTracks: [
                { no: 1, title: "Kissing You (Skool Rock Version)" },
                { no: 2, title: "Let’s Go Girls’ Generation!! (Let’s Go 소녀시대!!) (Long Version)" },
                { no: 3, title: "Let’s Go Girls’ Generation!! (Let’s Go 소녀시대!!) (Short Version)" },
            ],
        },
        tracks: [
            { no: 1, title: "Girls’ Generation", titleTrack: true },
            { no: 2, title: "Ooh La-La!" },
            { no: 3, title: "Baby Baby", titleTrack: true },
            { no: 4, title: "Complete" },
            { no: 5, title: "Kissing You", titleTrack: true },
            { no: 6, title: "Merry-Go-Round" },
            { no: 7, title: "Tears" },
            { no: 8, title: "Tinkerbell" },
            { no: 9, title: "7989" },
            { no: 10, title: "Honey" },
            { no: 11, title: "Into the New World" },
        ],
    },

    {
        title: "Oppa Nappa (오빠나빠)",
        type: "Soundtrack",
        date: { year: 2008, month: 4, day: 7 },
        cover: "/images/eras/2008-oppanappa.jpg",
        eraAnchor: ymdKey(2008, 4, 7, "Oppa Nappa"),
        keywords: ["oppa nappa", "哥哥坏"],
        links: {},
        tracks: [
            { no: 1, title: "오빠나빠", titleTrack: true },
        ],
    },

    {
        title: "Haptic Motion",
        type: "Collaboration",
        date: { year: 2008, month: 5, day: 8 },
        cover: "/images/eras/2008-hm.jpg",
        eraAnchor: ymdKey(2008, 5, 8, "Haptic Motion"),
        keywords: ["Haptic Motion", "hm"],
        links: {},
        tracks: [
            { no: 1, title: "Haptic Motion (with TVXQ!)", titleTrack: true },
        ],
    },

    {
        title: "Gee",
        type: "Mini Album",
        date: { year: 2009, month: 1, day: 7 },
        cover: "/images/eras/2009-gee.jpg",
        eraAnchor: ymdKey(2009, 1, 5, "Gee"),
        keywords: ["gee", "g", "寄"],
        links: {
            apple:'<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/gee-ep/854911623"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/4YroJ4NELkaJ34JjEZ6RyJ?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Gee", titleTrack: true },
            { no: 2, title: "Way to Go (힘내!)", titleTrack: true },
            { no: 3, title: "Dear Mom" },
            { no: 4, title: "Destiny" },
            { no: 5, title: "Let’s Talk About Love" },
        ],
    },

    {
        title: "HaHaHa Song",
        type: "Soundtrack",
        date: { year: 2009, month: 6, day: 8 },
        cover: "/images/eras/2009-hhhs.jpg",
        eraAnchor: ymdKey(2009, 6, 8, "HaHaHa Song"),
        keywords: ["HaHaHa Song", "hhh", "hahaha"],
        links: {},
        tracks: [
            { no: 1, title: "HaHaHa Song", titleTrack: true },
        ],
    },

    {
        title: "Genie (소원을 말해봐)",
        type: "Mini Album",
        date: { year: 2009, month: 6, day: 29 },
        cover: "/images/eras/2009-genie.jpg",
        eraAnchor: ymdKey(2009, 6, 25, "Genie"),
        keywords: ["소원을 말해봐", "genie", "tell me your wish"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/genie-ep/854915051"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/7dXtKHYGXhQZCE2mEg0l93?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Genie (소원을 말해봐)", titleTrack: true },
            { no: 2, title: "Etude" },
            { no: 3, title: "Girlfriend" },
            { no: 4, title: "Boyfriend" },
            { no: 5, title: "My Child" },
            { no: 6, title: "One Year Later (1년 後) – feat. Onew" },
        ],
    },

    {
        title: "Chocolate Love",
        type: "Korean Single",
        date: { year: 2009, month: 10, day: 8 },
        cover: "/images/eras/2009-cl.jpg",
        eraAnchor: ymdKey(2009, 10, 8, "Chocolate Love"),
        keywords: ["Chocolate Love", "巧克力爱"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="175" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/song/chocolate-love-retro-pop-version/854910509"></iframe>',

        },
        tracks: [
            { no: 1, title: "Chocolate Love", titleTrack: true },
        ],
    },

    {
        title: "Seoul",
        type: "Korean Single",
        date: { year: 2009, month: 12, day: 15 },
        cover: "/images/eras/2009-seoul.jpg",
        eraAnchor: ymdKey(2009, 12, 15, "Seoul"),
        keywords: ["Seoul"],
        links: {},
        tracks: [
            { no: 1, title: "Seoul (with Super Junior)", titleTrack: true },
        ],
    },

    {
        title: "Oh!",
        type: "Korean Album",
        date: { year: 2010, month: 1, day: 28 },
        cover: "/images/eras/2010-oh.jpg",
        eraAnchor: ymdKey(2010, 1, 28, "Oh!"),
        keywords: [],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/oh/854890642"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/4e841RxorIoZIufX8v7p7E?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Oh!", duration: "3:08", titleTrack: true },
            { no: 2, title: "Show! Show! Show!" },
            { no: 3, title: "Sweet Talking Baby (뻔 & Fun)" },
            { no: 4, title: "Forever (영원히 너와 꿈꾸고 싶다)" },
            { no: 5, title: "Be Happy (웃자)" },
            { no: 6, title: "Boys & Girls (화성인 바이러스) feat. Key" },
            { no: 7, title: "Talk to Me (카라멜 커피) – Jessica/Tiffany" },
            { no: 8, title: "Star Star Star (별별별)" },
            { no: 9, title: "Stick wit U (무조건 해피엔딩)" },
            { no: 10, title: "Day by Day (좋은 일만 생각하기)" },
            { no: 11, title: "Gee", titleTrack: true },
            { no: 12, title: "Genie (소원을 말해봐)", titleTrack: true },
        ],
    },

    {
        title: "Run Devil Run",
        type: "Repackage",
        date: { year: 2010, month: 3, day: 17 },
        cover: "/images/eras/2010-rdr.jpg",
        eraAnchor: ymdKey(2010, 3, 22, "Run Devil Run"),
        keywords: ["rdr", "恶魔跑跑"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/run-devil-run/854890807"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/2b4JQKXl0gwf3bnAfhZwLA?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        repackage: {
            baseTitle: "Oh!",
            addedTracks: [
                { no: 1, title: "Run Devil Run", titleTrack: true },
                { no: 2, title: "Echo" },
            ],
        },
        tracks: [],
    },

    {
        title: "Cooky",
        type: "Soundtrack",
        date: { year: 2010, month: 4, day: 27 },
        cover: "/images/eras/2010-cooky.jpg",
        eraAnchor: ymdKey(2010, 4, 27, "Cooky"),
        keywords: ["Cooky"],
        links: {},
        tracks: [
            { no: 1, title: "Cooky", titleTrack: true },
        ],
    },

    {
        title: "Cabi Song",
        type: "Collaboration",
        date: { year: 2010, month: 5, day: 20 },
        cover: "/images/eras/2010-cabi.jpg",
        eraAnchor: ymdKey(2010, 5, 20, "Cabi Song"),
        keywords: ["Cabi Song"],
        links: {},
        tracks: [
            { no: 1, title: "Cabi Song (with 2PM)", titleTrack: true },
        ],
    },

    {
        title: "Genie",
        type: "Japanese Single",
        date: { year: 2010, month: 9, day: 5 },
        cover: "/images/eras/2010-genie.jpg",
        eraAnchor: ymdKey(2010, 9, 5, "Genie"),
        keywords: ["소원을 말해봐", "genie", "tell me your wish"],
        links: {},
        tracks: [
            { no: 1, title: "Genie", titleTrack: true },
            { no: 2, title: "Tell Me Your Wish (Genie) (Korean Version)" },
            { no: 3, title: "Genie (Without Main Vocal)" },
        ],
    },

    {
        title: "Gee",
        type: "Japanese Single",
        date: { year: 2010, month: 10, day: 17 },
        cover: "/images/eras/2010-gee.jpg",
        eraAnchor: ymdKey(2010, 10, 17, "Gee"),
        keywords: ["gee", "g", "寄"],
        links: {},
        tracks: [
            { no: 1, title: "Gee", titleTrack: true },
            { no: 2, title: "Gee (Korean Version)" },
            { no: 3, title: "Gee (Without Main Vocal)" },
        ],
    },

    {
        title: "Hoot",
        type: "Mini Album",
        date: { year: 2010, month: 10, day: 27 },
        cover: "/images/eras/2010-hoot.jpg",
        eraAnchor: ymdKey(2010, 10, 27, "Hoot"),
        keywords: ["hoot", "车祸曲"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/hoot-ep/871021351"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/2qEugS42uGnquWJnufwjyg?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Hoot", titleTrack: true },
            { no: 2, title: "Mistake" },
            { no: 3, title: "My Best Friend" },
            { no: 4, title: "Wake Up" },
            { no: 5, title: "Snowy Wish" },
        ],
    },

    {
        title: "The 1st Asia Tour Concert - Into the New World (Live)",
        type: "Live",
        date: { year: 2010, month: 12, day: 30 },
        cover: "/images/eras/2010-live.webp",
        eraAnchor: ymdKey(2010, 10, 27, "The 1st Asia Tour Concert - Into the New World (Live)"),
        keywords: [],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/the-1st-asia-tour-concert-into-the-new-world-live/854892506"></iframe>',
        },
        tracks: [
            { no: 1, title: "Nine Angels (Live)" },
            { no: 2, title: "Tell Me Your Wish (Genie) [Rock Tronic Remix Version] [Live]" },
            { no: 3, title: "Show! Show! Show! (Live)" },
            { no: 4, title: "Girls' Generation (Live)" },
            { no: 5, title: "It's Fantastic (Live)" },
            { no: 6, title: "Etude (Live)" },
            { no: 7, title: "Kissing You (Live)" },
            { no: 8, title: "One Year Later (Live)" },
            { no: 9, title: "Introduce Me a Good Man (feat. YOONA) [Live]" },
            { no: 10, title: "Hush Hush (feat. TAEYEON) [Live]" },
            { no: 11, title: "Dear Mom (Live)" },
            { no: 12, title: "Forever (Live)" },
            { no: 13, title: "Day By Day (Live)" },
            { no: 14, title: "My Child (Live)" },
            { no: 15, title: "Barbie Girl (feat. Jessica) [Live]" },
            { no: 16, title: "Santa Baby (feat. Sooyoung) [Live]" },
            { no: 17, title: "Alborada del gracioso (feat. Seohyun) [Live]" },
            { no: 18, title: "Sixteen Going On Seventeen (feat. Seohyun) [Live]" },
            { no: 19, title: "1, 2 Step (feat. Yuri) [Live]" },
            { no: 20, title: "Into the New World (Live)" },
            { no: 21, title: "Be Happy (Live)" },
            { no: 22, title: "Way to Go (Live)" },
            { no: 23, title: "Gee (Live)" },
            { no: 24, title: "Touch the Sky (Live)" },
            { no: 25, title: "Ice Boy (Live)" },
            { no: 26, title: "Hahaha Song (Live)" },
            { no: 27, title: "Baby Baby (Live)" },
            { no: 28, title: "Oh! (Studio Version)" },
            { no: 29, title: "Beautiful Girls (feat. YOO YOUNG JIN) [Studio Version]" },
        ],
    },

    {
        title: "Visual Dreams",
        type: "Korean Single",
        date: { year: 2011, month: 1, day: 17 },
        cover: "/images/eras/2011-vd.jpg",
        eraAnchor: ymdKey(2010, 5, 20, "Visual Dreams"),
        keywords: ["Visual Dreams", "intel"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/visual-dreams-intel-collaboration-song-single/854929486"></iframe>',

        },
        tracks: [
            { no: 1, title: "Visual Dreams (POP! POP!)", titleTrack: true },
        ],
    },

    {
        title: "Run Devil Run",
        type: "Japanese Single",
        date: { year: 2011, month: 1, day: 25 },
        cover: "/images/eras/2011-rdr.jpg",
        eraAnchor: ymdKey(2011, 1, 25, "Run Devil Run (Japanese)"),
        links: {},
        keywords: ["rdr", "恶魔跑跑"],
        tracks: [
            { no: 1, title: "Run Devil Run (Japanese Version)", titleTrack: true },
        ],
    },

    {
        title: "Mr. Taxi",
        type: "Japanese Single",
        date: { year: 2011, month: 4, day: 23 },
        cover: "/images/eras/2011-mrtaxi.jpg",
        eraAnchor: ymdKey(2011, 4, 23, "Mr. Taxi (Japanese)"),
        links: {},
        keywords: ["mrtaxi", "司机"],
        tracks: [
            { no: 1, title: "Mr. Taxi", titleTrack: true },
            { no: 2, title: "Run Devil Run (Japanese Version)" },
        ],
    },

    {
        title: "Girls' Generation",
        type: "Japanese Album",
        date: { year: 2011, month: 6, day: 1 },
        cover: "/images/eras/2011-gg.jpg",
        eraAnchor: ymdKey(2011, 6, 1, "Girls' Generation (Japanese)"),
        keywords: ["girls generation", "gg"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/girls-generation/1440769276"></iframe>',

        },
        tracks: [
            { no: 1, title: "Mr. Taxi", titleTrack: true },
            { no: 2, title: "Genie (Japanese Ver.)", titleTrack: true },
            { no: 3, title: "You-aholic" },
            { no: 4, title: "Run Devil Run (Japanese Ver.)", titleTrack: true },
            { no: 5, title: "Bad Girl", titleTrack: true },
            { no: 6, title: "Beautiful Stranger" },
            { no: 7, title: "I’m in Love with the Hero" },
            { no: 8, title: "Let It Rain" },
            { no: 9, title: "Gee (Japanese Ver.)" },
            { no: 10, title: "The Great Escape" },
            { no: 11, title: "Hoot (Japanese Ver.)" },
            { no: 12, title: "Born to Be a Lady" },
        ],
    },

    {
        title: "The Boys",
        type: "Korean Album",
        date: { year: 2011, month: 10, day: 19 },
        cover: "/images/eras/2011-theboys.jpg",
        eraAnchor: ymdKey(2011, 10, 19, "The Boys"),
        keywords: ["the boys", "登顶曲"],
        links: {
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/4vGkZl9P0sKxupLdJE7ndS?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/the-boys-the-3rd-album/1679266955"></iframe>',
        },
        tracks: [
            { no: 1, title: "The Boys", titleTrack: true },
            { no: 2, title: "Telepathy" },
            { no: 3, title: "Say Yes" },
            { no: 4, title: "Trick" },
            { no: 5, title: "How Great Is Your Love" },
            { no: 6, title: "My J" },
            { no: 7, title: "Oscar" },
            { no: 8, title: "Top Secret" },
            { no: 9, title: "Lazy Girl (Dolce Far Niente)" },
            { no: 10, title: "Sunflower" },
            { no: 11, title: "VITAMIN" },
            { no: 12, title: "Mr. Taxi" },
        ],
    },

    {
        title: "Mr. Taxi",
        type: "Repackage",
        date: { year: 2011, month: 12, day: 9 },
        cover: "/images/eras/2011-mrtaxir.jpg",
        eraAnchor: ymdKey(2011, 12, 9, "Mr. Taxi (Repackage)"),
        keywords: ["mrtaxi", "司机"],
        links: {},
        repackage: {
            baseTitle: "The Boys",
            addedTracks: [
                { no: 1, title: "The Boys (English Version)", titleTrack: true },
            ],
        },
        tracks: [],
    },

    {
        title: "GG ~The Boys~",
        type: "Repackage",
        date: { year: 2011, month: 12, day: 18 },
        cover: "/images/eras/2011-ggtb.jpg",
        eraAnchor: ymdKey(2011, 12, 18, "Girls’ Generation ~The Boys~ (Japanese)"),
        links: {},
        keywords: [],
        repackage: {
            baseTitle: "",
            addedTracks: [
                { no: 1, title: "The Boys (Japanese Version)", titleTrack: true },
                { no: 2, title: "The Great Escape (Brian Lee Remix)" },
                { no: 3, title: "Bad Girl (feat. Dev) (The Cataracs Remix)" },
                { no: 4, title: "Time Machine", titleTrack: true },
                { no: 5, title: "Mr. Taxi" },
                { no: 6, title: "Genie (Japanese Ver.)" },
                { no: 7, title: "You-aholic" },
                { no: 8, title: "Run Devil Run (Japanese Ver.)" },
                { no: 9, title: "Bad Girl" },
                { no: 10, title: "Beautiful Stranger" },
                { no: 11, title: "I’m in Love with the Hero" },
                { no: 12, title: "Let It Rain" },
                { no: 13, title: "Gee (Japanese Ver.)" },
                { no: 14, title: "The Great Escape" },
                { no: 15, title: "Hoot (Japanese Ver.)" },
                { no: 16, title: "Born to Be a Lady" },
                { no: 17, title: "Mr. Taxi (Steve Aoki Remix)" },
            ],
        },
        tracks: [],
    },

    {
        title: "Twinkle",
        type: "TTS",
        date: { year: 2012, month: 4, day: 29 },
        cover: "/images/eras/2012-twinkle.webp",
        eraAnchor: ymdKey(2012, 4, 29, "Twinkle"),
        keywords: [],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/twinkle-mini-album/905847798"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/0kRgg9fqMgIrzzzYNJrYuT?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Twinkle", titleTrack: true },
            { no: 2, title: "Baby Steps" },
            { no: 3, title: "OMG" },
            { no: 4, title: "Library" },
            { no: 5, title: "Goodbye, Hello" },
            { no: 6, title: "Love Sick" },
            { no: 7, title: "Checkmate" },
        ],
    },

    {
        title: "Paparazzi",
        type: "Japanese Single",
        date: { year: 2012, month: 6, day: 20 },
        cover: "/images/eras/2012-paparazzi.jpg",
        eraAnchor: ymdKey(2012, 6, 20, "Paparazzi (Japanese)"),
        keywords: ["paparazzi", "狗仔"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/paparazzi-single/1444897693"></iframe>',
        },
        tracks: [
            { no: 1, title: "Paparazzi", titleTrack: true },
            { no: 2, title: "Paparazzi (Inst.)" },
        ],
    },

    {
        title: "All My Love is for You",
        type: "Japanese Single",
        date: { year: 2012, month: 9, day: 3 },
        cover: "/images/eras/2012-amlify.jpg",
        eraAnchor: ymdKey(2012, 9, 3, "All My Love is for You (Japanese)"),
        keywords: ["amlify"],
        links: {},
        tracks: [
            { no: 1, title: "All My Love is for You", titleTrack: true },
        ],
    },

    {
        title: "Oh!",
        type: "Japanese Single",
        date: { year: 2012, month: 9, day: 14 },
        cover: "/images/eras/2012-oh.jpg",
        eraAnchor: ymdKey(2012, 9, 14, "Oh! (Japanese)"),
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/oh-single/1445033887"></iframe>',
        },
        tracks: [
            { no: 1, title: "Oh! (Japanese Version)", titleTrack: true },
            { no: 2, title: "All My Love is for You" },
        ],
    },

    {
        title: "Flower Power",
        type: "Japanese Single",
        date: { year: 2012, month: 11, day: 7 },
        cover: "/images/eras/2012-fp.jpg",
        eraAnchor: ymdKey(2012, 11, 7, "Flower Power (Japanese)"),
        links: {},
        keywords: ["fp"],
        tracks: [
            { no: 1, title: "Flower Power", titleTrack: true },
            { no: 2, title: "Beep Beep" },
            { no: 3, title: "Girls’ Generation II Smash-Up (feat. Sean Paul)" },
        ],
    },

    {
        title: "Girls & Peace",
        type: "Japanese Album",
        date: { year: 2012, month: 11, day: 28 },
        cover: "/images/eras/2012-gp.jpg",
        eraAnchor: ymdKey(2012, 11, 28, "Girls & Peace (Japanese)"),
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/girls-generation-2-girls-peace/1442965633"></iframe>',
        },
        keywords: ["gp"],
        tracks: [
            { no: 1, title: "Flower Power", titleTrack: true },
            { no: 2, title: "Animal" },
            { no: 3, title: "I’m a Diamond" },
            { no: 4, title: "Reflection" },
            { no: 5, title: "Stay Girls" },
            { no: 6, title: "T.O.P." },
            { no: 7, title: "Boomerang" },
            { no: 8, title: "Oh! (Japanese Ver.)", titleTrack: true },
            { no: 9, title: "All My Love is for You", titleTrack: true },
            { no: 10, title: "Paparazzi", titleTrack: true },
            { no: 11, title: "Girls & Peace" },
            { no: 12, title: "Not Alone" },
        ],
    },

    {
        title: "Dancing Queen",
        type: "Korean Single",
        date: { year: 2012, month: 12, day: 21 },
        cover: "/images/eras/2012-dq.jpg",
        eraAnchor: ymdKey(2012, 12, 21, "Dancing Queen"),
        keywords: ["dq"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/dancing-queen-single/854930339"></iframe>',

        },
        tracks: [
            { no: 1, title: "Dancing Queen", titleTrack: true },
        ],
    },

    {
        title: "I Got a Boy",
        type: "Korean Album",
        date: { year: 2013, month: 1, day: 1 },
        cover: "/images/eras/2013-igab.jpg",
        eraAnchor: ymdKey(2013, 1, 1, "I Got a Boy"),
        keywords: ["igab", "i got a boy"],
        links: {
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/3uhihQCm9aSvdJmDXcVrvi?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/the-4th-album-i-got-a-boy/905850557"></iframe>',
        },
        tracks: [
            { no: 1, title: "I Got a Boy", titleTrack: true },
            { no: 2, title: "Dancing Queen", titleTrack: true },
            { no: 3, title: "Baby Maybe" },
            { no: 4, title: "Talk Talk" },
            { no: 5, title: "Promise" },
            { no: 6, title: "Express 999" },
            { no: 7, title: "Lost in Love (유리아이) – Taeyeon/Tiffany" },
            { no: 8, title: "Look at Me" },
            { no: 9, title: "XYZ" },
            { no: 10, title: "Romantic St." },
        ],
    },

    {
        title: "Best Select NonStop Mix",
        type: "Remix",
        date: { year: 2013, month: 3, day: 20 },
        cover: "/images/eras/2013-remix.jpg",
        eraAnchor: ymdKey(2013, 3, 20, "Best Selection Non Stop Mix"),
        keywords: [],
        links: {},
        tracks: [
            { no: 1, title: "Opening" },
            { no: 2, title: "Flower Power" },
            { no: 3, title: "The Boys (Japanese version)" },
            { no: 4, title: "Reflection" },
            { no: 5, title: "Paparazzi" },
            { no: 6, title: "Bad Girl" },
            { no: 7, title: "Genie (Japanese version)" },
            { no: 8, title: "Boomerang" },
            { no: 9, title: "T.O.P." },
            { no: 10, title: "You-aholic" },
            { no: 11, title: "Mr. Taxi" },
            { no: 12, title: "Animal" },
            { no: 13, title: "Hoot (Japanese version)" },
            { no: 14, title: "Run Devil Run (Japanese version)" },
            { no: 15, title: "I’m a Diamond" },
            { no: 16, title: "Girls & Peace" },
            { no: 17, title: "Oh! (Japanese version)" },
            { no: 18, title: "The Great Escape" },
            { no: 19, title: "Gee (Japanese version)" },
            { no: 20, title: "Let It Rain" },
            { no: 21, title: "Stay Girls" },
        ],
    },

    {
        title: "2011 Girls Generation Tour (Live)",
        type: "Live",
        date: { year: 2013, month: 4, day: 11 },
        cover: "/images/eras/2013-live.webp",
        eraAnchor: ymdKey(2013, 4, 11, "2011 Girls Generation Tour (Live)"),
        keywords: [],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/2011-girls-generation-tour-live/854905911"></iframe>',
        },
        tracks: [
            { no: 1, title: "Girl's Carnival (Live)" },
            { no: 2, title: "Genie (Live)" },
            { no: 3, title: "You-aholic (Live)" },
            { no: 4, title: "Mr. Taxi (Korean Version) [Live]" },
            { no: 5, title: "I'm in Love With the Hero (Live)" },
            { no: 6, title: "Let It Rain (Korean Version) [Live]" },
            { no: 7, title: "Snowy Wish (Live)" },
            { no: 8, title: "Sweet Talking Baby (Live)" },
            { no: 9, title: "Kissing You (Live)" },
            { no: 10, title: "Oh! (Live)" },
            { no: 11, title: "Don't Stop the Music (feat. HYOYEON) [Live]" },
            { no: 12, title: "Almost (feat. Jessica) [Live]" },
            { no: 13, title: "3 (feat. SUNNY) [Live]" },
            { no: 14, title: "Lady Marmalade (feat. TAEYEON & Tiffany) [Live]" },
            { no: 15, title: "The Great Escape (Live)" },
            { no: 16, title: "Bad Girl (Live)" },
            { no: 17, title: "Devil's Cry (Live)" },
            { no: 18, title: "Run Devil Run (Live)" },
            { no: 19, title: "Beautiful Stranger (Live)" },
            { no: 20, title: "Hoot (Live)" },
            { no: 21, title: "If (feat. Yu-Ri) [Live]" },
            { no: 22, title: "Sway (feat. Soo Young) [Live]" },
            { no: 23, title: "Danny Boy (Live)" },
            { no: 24, title: "Complete (Live)" },
            { no: 25, title: "My Child (Live)" },
            { no: 26, title: "Ice Boy (Live)" },
            { no: 27, title: "Hahaha Song (Live)" },
            { no: 28, title: "Gee (Live)" },
            { no: 29, title: "Forever (Live)" },
            { no: 30, title: "Into the New World (Live)" },
            { no: 31, title: "Way to Go (Live)" },
            { no: 32, title: "It's Fantastic! (Live)" },
            { no: 33, title: "Let It Rain (Studio Version)" },
            { no: 34, title: "Danny Boy (Studio Version)" },
        ],
    },

    {
        title: "Love & Girls",
        type: "Japanese Single",
        date: { year: 2013, month: 6, day: 12 },
        cover: "/images/eras/2013-lg.jpg",
        eraAnchor: ymdKey(2013, 6, 12, "Love & Girls (Japanese)"),
        links: {},
        keywords: ["lg"],
        tracks: [
            { no: 1, title: "Love & Girls", titleTrack: true },
            { no: 2, title: "Lingua Franca (リンガ・フランカ)" },
        ],
    },

    {
        title: "Galaxy Supernova",
        type: "Japanese Single",
        date: { year: 2013, month: 9, day: 11 },
        cover: "/images/eras/2013-gs.jpg",
        eraAnchor: ymdKey(2013, 9, 11, "Galaxy Supernova (Japanese)"),
        links: {},
        keywords: ["gs", "银河超新星", "超新星"],
        tracks: [
            { no: 1, title: "Galaxy Supernova", titleTrack: true },
            { no: 2, title: "Do the Catwalk" },
        ],
    },

    {
        title: "My Oh My",
        type: "Japanese Single",
        date: { year: 2013, month: 11, day: 5 },
        cover: "/images/eras/2013-mom.jpg",
        eraAnchor: ymdKey(2013, 11, 5, "My Oh My (Japanese)"),
        keywords: ["mom"],
        links: {},
        tracks: [
            { no: 1, title: "My Oh My", titleTrack: true },
        ],
    },

    {
        title: "Love & Peace",
        type: "Japanese Album",
        date: { year: 2013, month: 12, day: 10 },
        cover: "/images/eras/2013-lp.jpg",
        eraAnchor: ymdKey(2013, 12, 10, "Love & Peace (Japanese)"),
        keywords: ["lp"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/love-peace/1442908755"></iframe>',
        },
        tracks: [
            { no: 1, title: "Gossip Girls" },
            { no: 2, title: "Motorcycle" },
            { no: 3, title: "Flyers" },
            { no: 4, title: "Galaxy Supernova", titleTrack: true },
            { no: 5, title: "Love & Girls", titleTrack: true },
            { no: 6, title: "Beep Beep", titleTrack: true },
            { no: 7, title: "My Oh My", titleTrack: true },
            { no: 8, title: "Lips" },
            { no: 9, title: "Do the Catwalk" },
            { no: 10, title: "Karma Butterfly" },
            { no: 11, title: "Lingua Franca" },
            { no: 12, title: "Everyday Love" },
            { no: 13, title: "Blue Jeans (Fanclub Edition Only)" },
        ],
    },

    {
        title: "Mr.Mr.",
        type: "Mini Album",
        date: { year: 2014, month: 2, day: 24 },
        cover: "/images/eras/2014-mrmr.jpg",
        eraAnchor: ymdKey(2014, 2, 24, "Mr.Mr."),
        keywords: ["mr mr"],
        links: {
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/1WyHAY8OWdfCFWTF0Ufwjj?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/girls-generation-4th-mini-album-mr-mr-ep/826334410"></iframe>',
        },
        tracks: [
            { no: 1, title: "Mr.Mr.", titleTrack: true },
            { no: 2, title: "Goodbye" },
            { no: 3, title: "Europa" },
            { no: 4, title: "Wait a Minute" },
            { no: 5, title: "Back Hug" },
            { no: 6, title: "Soul" },
        ],
    },

    {
        title: "The Best",
        type: "Japanese Album",
        date: { year: 2014, month: 7, day: 23 },
        cover: "/images/eras/2014-tb.jpg",
        eraAnchor: ymdKey(2014, 7, 23, "The Best (Japanese)"),
        links: {},
        keywords: ["tb"],
        tracks: [
            { no: 1, title: "Genie (Japanese Ver.)" },
            { no: 2, title: "Gee (Japanese Ver.)" },
            { no: 3, title: "Run Devil Run (Japanese Ver.)" },
            { no: 4, title: "Mr. Taxi" },
            { no: 5, title: "Bad Girl" },
            { no: 6, title: "Hoot (Japanese Ver.) (Complete Limited Edition Only)" },
            { no: 7, title: "The Boys (Japanese Ver.) (Complete Limited Edition Only)" },
            { no: 8, title: "Time Machine" },
            { no: 9, title: "Paparazzi" },
            { no: 10, title: "Oh! (Japanese Ver.)" },
            { no: 11, title: "All My Love Is For You" },
            { no: 12, title: "Flower Power" },
            { no: 13, title: "Beep Beep" },
            { no: 14, title: "Love & Girls" },
            { no: 15, title: "Galaxy Supernova" },
            { no: 16, title: "My Oh My" },
            { no: 17, title: "Mr.Mr. (Japanese Ver.)" },
            { no: 18, title: "Indestructible", titleTrack: true },
            { no: 19, title: "Divine (The New Edition)", titleTrack: true },
            { no: 20, title: "Show Girls (The New Edition)" },
        ],
    },

    {
        title: "Holler",
        type: "TTS",
        date: { year: 2014, month: 9, day: 18 },
        cover: "/images/eras/2014-holler.jpg",
        eraAnchor: ymdKey(2014, 9, 18, "Holler"),
        keywords: [],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/holler-the-2nd-mini-album-ep/919008422"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/5YeD6fd2H0K0KvFGxxwEjD?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Holler", titleTrack: true },
            { no: 2, title: "Adrenaline" },
            { no: 3, title: "Whisper" },
            { no: 4, title: "Stay" },
            { no: 5, title: "Only U" },
            { no: 6, title: "Eyes" },
        ],
    },

    {
        title: "Catch Me If You Can",
        type: "Japanese Single",
        date: { year: 2015, month: 4, day: 22 },
        cover: "/images/eras/2015-cmiyc.jpg",
        eraAnchor: ymdKey(2015, 4, 22, "Catch Me If You Can (Japanese)"),
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/catch-me-if-you-can-single/983600921"></iframe>',
        },
        keywords: ["cmiyc"],
        tracks: [
            { no: 1, title: "Catch Me If You Can (Japanese Version)", titleTrack: true },
            { no: 2, title: "Girls (Japanese Version)" },
            { no: 3, title: "Catch Me If You Can (Inst.) (Limited First Press Edition only)" },
            { no: 4, title: "Catch Me If You Can (Korean Version)", titleTrack: true },
            { no: 5, title: "Girls (Korean Version)" },
        ],
    },

    {
        title: "Party",
        type: "Korean Single",
        date: { year: 2015, month: 7, day: 7 },
        cover: "/images/eras/2015-party.jpg",
        eraAnchor: ymdKey(2015, 7, 7, "Party"),
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/party-single/1015771701"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/1sysmn95tSsSfmXxr9RwhD?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        keywords: [],
        tracks: [
            { no: 1, title: "Party", titleTrack: true },
            { no: 2, title: "Check" },
        ],
    },

    {
        title: "Lion Heart",
        type: "Korean Album",
        date: { year: 2015, month: 8, day: 19 },
        cover: "/images/eras/2015-lionheart.jpg",
        eraAnchor: ymdKey(2015, 8, 19, "Lion Heart"),
        keywords: [],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/lion-heart-the-5th-album/1031478656"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/4eKdn0skJCidO2wqIJyCgB?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Lion Heart", titleTrack: true },
            { no: 2, title: "You Think", titleTrack: true },
            { no: 3, title: "Party" },
            { no: 4, title: "One Afternoon" },
            { no: 5, title: "Show Girls (Korean ver.)" },
            { no: 6, title: "Fire Alarm" },
            { no: 7, title: "Talk Talk" },
            { no: 8, title: "Green Light" },
            { no: 9, title: "Paradise" },
            { no: 10, title: "Check" },
            { no: 11, title: "Sign" },
            { no: 12, title: "Bump It" },
        ],
    },

    {
        title: "Dear Santa",
        type: "TTS",
        date: { year: 2015, month: 12, day: 4 },
        cover: "/images/eras/2015-ds.jpg",
        eraAnchor: ymdKey(2015, 12, 4, "Dear Santa"),
        keywords: [],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/dear-santa-x-mas-special-ep/1064320554"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/0OES8nSgtEOXl1RgmXMkrj?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Dear Santa", titleTrack: true },
            { no: 2, title: "I like the way" },
            { no: 3, title: "Winter Story" },
            { no: 4, title: "Merry Christmas" },
            { no: 5, title: "First Snow" },
            { no: 6, title: "Dear Santa (Eng Ver)", titleTrack: true },
        ],
    },

    {
        title: "Sailing (0805)",
        type: "Korean Single",
        date: { year: 2016, month: 8, day: 5 },
        cover: "/images/eras/2016-0805.jpg",
        eraAnchor: ymdKey(2016, 8, 5, "Sailing (0805)"),
        keywords: ["0805", "그여름"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/sailing-0805-single/1140701551"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/6GvYONX7JKhU1OVX7BREO7?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Sailing (0805)", titleTrack: true },
            { no: 2, title: "Sailing (0805) (Inst.)" },
        ],
    },

    {
        title: "Holiday Night",
        type: "Korean Album",
        date: { year: 2017, month: 8, day: 4 },
        cover: "/images/eras/2017-holidaynight.jpg",
        eraAnchor: ymdKey(2017, 8, 4, "Holiday Night"),
        keywords: [],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/holiday-night-the-6th-album/1266602382"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/5MQM8Jw1FvT21Dny8cOXjF?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Girls Are Back" },
            { no: 2, title: "All Night", titleTrack: true },
            { no: 3, title: "Holiday", titleTrack: true },
            { no: 4, title: "Fan" },
            { no: 5, title: "Only One" },
            { no: 6, title: "One Last Time" },
            { no: 7, title: "Sweet Talk" },
            { no: 8, title: "Love Is Bitter" },
            { no: 9, title: "It’s You (오랜 소원)" },
            { no: 10, title: "Light Up the Sky" },
        ],
    },

    {
        title: "Lil' touch",
        type: "Oh-GG",
        date: { year: 2018, month: 9, day: 5 },
        cover: "/images/eras/2018-ohgg.jpg",
        eraAnchor: ymdKey(2018, 9, 5, "Lil' touch"),
        keywords: ["ohgg"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/lil-touch-the-1st-single/1435055371"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/6369mPjmE105oD1ECF7WiA?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "Lil' Touch", titleTrack: true },
            { no: 2, title: "Fermata" },
            { no: 3, title: "Lil' Touch (Instrumental)" },
            { no: 4, title: "Fermata (Instrumental)" },
        ],
    },

    {
        title: "FOREVER 1",
        type: "Korean Album",
        date: { year: 2022, month: 8, day: 5 },
        cover: "/images/eras/2022-forever1.jpg",
        eraAnchor: ymdKey(2022, 8, 5, "Forever 1"),
        keywords: ["forever one", "f1"],
        links: {
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/forever-1-the-7th-album/1637554836"></iframe>',
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/3CcgnUkTrUaPTt4Ms1MkoP?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
        },
        tracks: [
            { no: 1, title: "FOREVER 1", titleTrack: true },
            { no: 2, title: "Lucky Like That" },
            { no: 3, title: "Seventeen" },
            { no: 4, title: "Villain" },
            { no: 5, title: "You Better Run" },
            { no: 6, title: "Closer" },
            { no: 7, title: "Mood Lamp" },
            { no: 8, title: "Summer Night (완벽한 장면)" },
            { no: 9, title: "Freedom" },
            { no: 10, title: "Paper Plane (종이비행기)" },
        ],
    },

    {
        title: "iScreaM Vol.19 : Forever 1 Remixes",
        type: "Remix",
        date: { year: 2022, month: 11, day: 17 },
        cover: "/images/eras/2022-remix.jpg",
        eraAnchor: ymdKey(2022, 11, 17, "iScreaM Vol.19 : Forever 1 Remixes"),
        keywords: [],
        links: {
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/4DXE5rt8VQUZHmKIG57AYu?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/iscream-vol-19-forever-1-remixes-ep/1654471813"></iframe>',
        },
        tracks: [
            { no: 1, title: "Forever 1 (Matisse & Sadko Remix)", titleTrack: true },
            { no: 2, title: "Forever 1 (Aiobahn Remix)" },
            { no: 3, title: "Forever 1 (Mar Vista Remix)" },
            { no: 4, title: "Forever 1 (Matisse & Sadko Remix, Extended Version)" },
            { no: 5, title: "Forever 1 (Aiobahn Remix, Extended Version)" },
            { no: 6, title: "Forever 1 (Mar Vista Remix, Extended Version)" },
        ],
    },

    {
        title: "2025 SMTOWN : THE CULTURE, THE FUTURE - My Everything",
        type: "Participation",
        date: { year: 2025, month: 2, day: 14 },
        cover: "/images/eras/2025-myeverything.jpg",
        eraAnchor: ymdKey(2025, 2, 14, "2025 SMTOWN : THE CULTURE, THE FUTURE - My Everything"),
        links: {
            spotify: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/track/3cyAMHHbDmJFMUj1QxYCGv?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
            apple: '<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="175" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/song/my-everything/1792409057"></iframe>',
        },
        keywords: ["me"],
        tracks: [
            { no: 1, title: "My Everthing", titleTrack: true },
        ],
    },
] as const satisfies ReadonlyArray<DiscographySeed>;

export const DISCOGRAPHY: DiscographyItem[] = SEED.map(
    (raw): DiscographyItem => ({
        ...raw,
        id: idFor(raw.date, raw.title),
        slug: slugify(raw.title),
    })
);

export const ALL_TYPES: AlbumType[] = [
    "Korean Single",
    "Korean Album",
    "Japanese Single",
    "Japanese Album",
    "Collaboration",
    "Repackage",
    "Soundtrack",
    "Mini Album",
    "Remix",
    "Participation",
    "TTS",
    "Oh-GG",
    "Live",
];
