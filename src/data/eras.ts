export type Era = {
  id: string;      // "2015"
  year: number;
  title: string;
  cover: string;   // /images/eras/2015-lionheart.jpg
  highlights: string[];
};

export const ERAS: Era[] = [
  { id: "2007", year: 2007, title: "Into the New World", cover: "/images/eras/2007-itnw.jpg", highlights: ["Debut single", "First wins"] },
  { id: "2009", year: 2009, title: "Gee", cover: "/images/eras/2009-gee.jpg", highlights: ["Nationwide craze", "Show streak"] },
  { id: "2011", year: 2011, title: "The Boys", cover: "/images/eras/2011-theboys.jpg", highlights: ["Global release", "Sharper concept"] },
  { id: "2013", year: 2013, title: "I Got a Boy", cover: "/images/eras/2013-igab.jpg", highlights: ["Genre mash landmark", "YouTube awards"] },
  { id: "2015", year: 2015, title: "Lion Heart", cover: "/images/eras/2015-lionheart.jpg", highlights: ["Retro elegance", "Dual titles"] },
  { id: "2017", year: 2017, title: "Holiday Night", cover: "/images/eras/2017-holidaynight.jpg", highlights: ["10th anniv.", "Nostalgia visuals"] },
  { id: "2022", year: 2022, title: "Forever 1", cover: "/images/eras/2022-forever1.jpg", highlights: ["15th anniv. reunion", "Promotions"] },
];
