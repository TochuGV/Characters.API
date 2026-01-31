const movies = [
  {
    title: "Toy Story",
    image: "https://ejemplo.com/toystory.jpg",
    creationDate: new Date("1995-11-22"),
    rating: 5
  },
  {
    title: "Toy Story 2",
    image: "https://ejemplo.com/toystory2.jpg",
    creationDate: new Date("1999-11-24"),
    rating: 5
  },
  {
    title: "Toy Story 3",
    image: "https://ejemplo.com/toystory3.jpg",
    creationDate: new Date("2010-06-18"),
    rating: 5
  },
  {
    title: "Toy Story 4",
    image: "https://ejemplo.com/toystory4.jpg",
    creationDate: new Date("2019-06-21"),
    rating: 5
  },
  {
    title: "Frozen",
    image: "https://ejemplo.com/frozen.jpg",
    creationDate: new Date("2013-11-27"),
    rating: 5
  },
  {
    title: "Frozen 2",
    image: "https://ejemplo.com/frozen2.jpg",
    creationDate: new Date("2019-11-22"),
    rating: 4
  },
  {
    title: "WALL-E",
    image: "https://ejemplo.com/walle.jpg",
    creationDate: new Date("2008-06-27"),
    rating: 5
  },
  {
    title: "The Incredibles",
    image: "https://ejemplo.com/incredibles.jpg",
    creationDate: new Date("2004-11-05"),
    rating: 5
  },
  {
    title: "Incredibles 2",
    image: "https://ejemplo.com/incredibles2.jpg",
    creationDate: new Date("2018-06-15"),
    rating: 4
  },
  {
    title: "Finding Nemo",
    image: "https://ejemplo.com/findingnemo.jpg",
    creationDate: new Date("2003-05-30"),
    rating: 5
  },
  {
    title: "Finding Dory",
    image: "https://ejemplo.com/findingdory.jpg",
    creationDate: new Date("2016-06-17"),
    rating: 4
  },
  {
    title: "Monsters Inc",
    image: "https://ejemplo.com/monstersinc.jpg",
    creationDate: new Date("2001-11-02"),
    rating: 5
  },
  {
    title: "Monsters University",
    image: "https://ejemplo.com/monstersuniversity.jpg",
    creationDate: new Date("2013-06-21"),
    rating: 4
  },
  {
    title: "Cars",
    image: "https://ejemplo.com/cars.jpg",
    creationDate: new Date("2006-06-09"),
    rating: 4
  },
  {
    title: "Cars 2",
    image: "https://ejemplo.com/cars2.jpg",
    creationDate: new Date("2011-06-24"),
    rating: 3
  },
  {
    title: "Cars 3",
    image: "https://ejemplo.com/cars3.jpg",
    creationDate: new Date("2017-06-16"),
    rating: 4
  },
  {
    title: "Inside Out",
    image: "https://ejemplo.com/insideout.jpg",
    creationDate: new Date("2015-06-19"),
    rating: 5
  },
  {
    title: "Coco",
    image: "https://ejemplo.com/coco.jpg",
    creationDate: new Date("2017-11-22"),
    rating: 5
  },
  {
    title: "Ratatouille",
    image: "https://ejemplo.com/ratatouille.jpg",
    creationDate: new Date("2007-06-29"),
    rating: 5
  },
  {
    title: "Up",
    image: "https://ejemplo.com/up.jpg",
    creationDate: new Date("2009-05-29"),
    rating: 5
  },
  {
    title: "A Bug's Life",
    image: "https://ejemplo.com/bugslife.jpg",
    creationDate: new Date("1998-11-25"),
    rating: 4
  },
  {
    title: "Brave",
    image: "https://ejemplo.com/brave.jpg",
    creationDate: new Date("2012-06-22"),
    rating: 4
  },
  {
    title: "The Good Dinosaur",
    image: "https://ejemplo.com/gooddinosaur.jpg",
    creationDate: new Date("2015-11-25"),
    rating: 3
  },
  {
    title: "Soul",
    image: "https://ejemplo.com/soul.jpg",
    creationDate: new Date("2020-12-25"),
    rating: 5
  },
  {
    title: "Luca",
    image: "https://ejemplo.com/luca.jpg",
    creationDate: new Date("2021-06-18"),
    rating: 4
  },
  {
    title: "Turning Red",
    image: "https://ejemplo.com/turningred.jpg",
    creationDate: new Date("2022-03-11"),
    rating: 4
  },
  {
    title: "The Lion King",
    image: "https://ejemplo.com/lionking.jpg",
    creationDate: new Date("1994-06-24"),
    rating: 5
  },
  {
    title: "Aladdin",
    image: "https://ejemplo.com/aladdin.jpg",
    creationDate: new Date("1992-11-25"),
    rating: 5
  },
  {
    title: "Beauty and the Beast",
    image: "https://ejemplo.com/beautyandthebeast.jpg",
    creationDate: new Date("1991-11-22"),
    rating: 5
  },
  {
    title: "The Little Mermaid",
    image: "https://ejemplo.com/littlemermaid.jpg",
    creationDate: new Date("1989-11-17"),
    rating: 5
  },
  {
    title: "Mulan",
    image: "https://ejemplo.com/mulan.jpg",
    creationDate: new Date("1998-06-19"),
    rating: 5
  },
  {
    title: "Pocahontas",
    image: "https://ejemplo.com/pocahontas.jpg",
    creationDate: new Date("1995-06-23"),
    rating: 4
  },
  {
    title: "Hercules",
    image: "https://ejemplo.com/hercules.jpg",
    creationDate: new Date("1997-06-27"),
    rating: 4
  },
  {
    title: "Tarzan",
    image: "https://ejemplo.com/tarzan.jpg",
    creationDate: new Date("1999-06-18"),
    rating: 5
  },
  {
    title: "Tangled",
    image: "https://ejemplo.com/tangled.jpg",
    creationDate: new Date("2010-11-24"),
    rating: 5
  },
  {
    title: "Wreck-It Ralph",
    image: "https://ejemplo.com/wreckitralph.jpg",
    creationDate: new Date("2012-11-02"),
    rating: 5
  },
  {
    title: "Big Hero 6",
    image: "https://ejemplo.com/bighero6.jpg",
    creationDate: new Date("2014-11-07"),
    rating: 5
  },
  {
    title: "Zootopia",
    image: "https://ejemplo.com/zootopia.jpg",
    creationDate: new Date("2016-03-04"),
    rating: 5
  },
  {
    title: "Moana",
    image: "https://ejemplo.com/moana.jpg",
    creationDate: new Date("2016-11-23"),
    rating: 5
  },
  {
    title: "Ralph Breaks the Internet",
    image: "https://ejemplo.com/ralphbreaksinternet.jpg",
    creationDate: new Date("2018-11-21"),
    rating: 4
  },
  {
    title: "Encanto",
    image: "https://ejemplo.com/encanto.jpg",
    creationDate: new Date("2021-11-24"),
    rating: 5
  },
  {
    title: "Raya and the Last Dragon",
    image: "https://ejemplo.com/raya.jpg",
    creationDate: new Date("2021-03-05"),
    rating: 4
  }
];

export default movies;