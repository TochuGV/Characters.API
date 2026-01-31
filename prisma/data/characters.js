const characters = [
  {
    name: "Woody",
    image: "https://ejemplo.com/woody.jpg",
    age: 50,
    weight: 0.5,
    story: "Sheriff Woody Pride es un vaquero de juguete vintage y el juguete favorito de Andy. Es el líder natural del cuarto de juguetes, siempre leal y protector con sus amigos. Aunque inicialmente celoso de Buzz, desarrolla una profunda amistad con él.",
    moviesTitle: ["Toy Story", "Toy Story 2", "Toy Story 3", "Toy Story 4"]
  },
  {
    name: "Buzz Lightyear",
    image: "https://ejemplo.com/buzz.jpg",
    age: 30,
    weight: 0.8,
    story: "Buzz Lightyear es un guardián espacial de juguete de Star Command. Al principio creía ser un verdadero guardián espacial, pero eventualmente acepta ser un juguete. Es valiente, heroico y el mejor amigo de Woody. Su frase icónica es 'Al infinito y más allá'.",
    moviesTitle: ["Toy Story", "Toy Story 2", "Toy Story 3", "Toy Story 4"]
  },
  {
    name: "Jessie",
    image: "https://ejemplo.com/jessie.jpg",
    age: 45,
    weight: 0.4,
    story: "Jessie la Vaquerita es una vaquera de juguete de la colección 'Woody's Roundup'. Fue abandonada por su antigua dueña Emily, lo que la dejó con miedo a ser olvidada. Es energética, valiente y se convierte en parte de la familia de Andy.",
    moviesTitle: ["Toy Story 2", "Toy Story 3", "Toy Story 4"]
  },
  {
    name: "Mr. Potato Head",
    image: "https://ejemplo.com/mrpotato.jpg",
    age: 60,
    weight: 0.6,
    story: "Don Potato es un juguete clásico con partes intercambiables. Inicialmente escéptico y sarcástico, especialmente con Buzz, pero tiene un gran corazón. Está casado con Mrs. Potato Head y es muy protector con ella.",
    moviesTitle: ["Toy Story", "Toy Story 2", "Toy Story 3", "Toy Story 4"]
  },
  {
    name: "Rex",
    image: "https://ejemplo.com/rex.jpg",
    age: 35,
    weight: 1.2,
    story: "Rex es un tiranosaurio de juguete que, a pesar de su apariencia feroz, es extremadamente ansioso y miedoso. Le preocupa constantemente no ser lo suficientemente aterrador. Es fanático de los videojuegos y muy leal a sus amigos.",
    moviesTitle: ["Toy Story", "Toy Story 2", "Toy Story 3", "Toy Story 4"]
  },
  {
    name: "Elsa",
    image: "https://ejemplo.com/elsa.jpg",
    age: 24,
    weight: 55,
    story: "Elsa es la Reina de Arendelle con poderes mágicos para crear hielo y nieve. Pasó años ocultando sus poderes por miedo a lastimar a otros, especialmente a su hermana Anna. Eventualmente aprende a aceptarse y controlar sus poderes. Es elegante, poderosa y profundamente protectora.",
    moviesTitle: ["Frozen", "Frozen 2"]
  },
  {
    name: "Anna",
    image: "https://ejemplo.com/anna.jpg",
    age: 21,
    weight: 50,
    story: "Anna es la princesa de Arendelle y hermana menor de Elsa. Es optimista, valiente y determinada. A pesar de estar separada de su hermana durante años, nunca dejó de amarla. Su amor verdadero y sacrificio salvaron tanto a Elsa como a Arendelle.",
    moviesTitle: ["Frozen", "Frozen 2"]
  },
  {
    name: "Olaf",
    image: "https://ejemplo.com/olaf.jpg",
    age: 3,
    weight: 20,
    story: "Olaf es un muñeco de nieve mágico creado por Elsa. Ama el verano a pesar de que se derretiría con el calor. Es inocente, gracioso y filosóficamente profundo. Su amor por los abrazos cálidos representa su naturaleza afectuosa.",
    moviesTitle: ["Frozen", "Frozen 2"]
  },
  {
    name: "Kristoff",
    image: "https://ejemplo.com/kristoff.jpg",
    age: 24,
    weight: 75,
    story: "Kristoff es un comerciante de hielo que vive en las montañas con su reno Sven. Es rudo por fuera pero tiene un gran corazón. Ayuda a Anna en su búsqueda de Elsa y eventualmente se enamora de ella. Fue criado por los trolls.",
    moviesTitle: ["Frozen", "Frozen 2"]
  },
  {
    name: "WALL-E",
    image: "https://ejemplo.com/walle.jpg",
    age: 700,
    weight: 120,
    story: "WALL-E (Waste Allocation Load Lifter Earth-Class) es un robot compactador de basura que ha estado solo en la Tierra durante 700 años limpiando el planeta. Desarrolló personalidad y curiosidad, coleccionando objetos interesantes. Se enamora de EVE y la sigue al espacio.",
    moviesTitle: ["WALL-E"]
  },
  {
    name: "EVE",
    image: "https://ejemplo.com/eve.jpg",
    age: 2,
    weight: 80,
    story: "EVE (Extraterrestrial Vegetation Evaluator) es un robot de búsqueda avanzado enviado a la Tierra para encontrar vida vegetal. Es elegante, eficiente y altamente tecnológica. Se enamora de WALL-E y juntos ayudan a la humanidad a regresar a la Tierra.",
    moviesTitle: ["WALL-E"]
  },
  {
    name: "Mr. Incredible",
    image: "https://ejemplo.com/mrincredible.jpg",
    age: 40,
    weight: 135,
    story: "Bob Parr, conocido como Mr. Incredible, es un superhéroe con súper fuerza. Después de que los superhéroes fueran prohibidos, intentó vivir una vida normal pero extrañaba la acción. Es el padre de familia Parr y eventualmente toda la familia se une como equipo de superhéroes.",
    moviesTitle: ["The Incredibles", "Incredibles 2"]
  },
  {
    name: "Elastigirl",
    image: "https://ejemplo.com/elastigirl.jpg",
    age: 38,
    weight: 56,
    story: "Helen Parr, conocida como Elastigirl, puede estirar su cuerpo de formas increíbles. Es una madre dedicada y superhéroe brillante. En la segunda película, se convierte en el rostro público de los superhéroes mientras Bob cuida a los niños.",
    moviesTitle: ["The Incredibles", "Incredibles 2"]
  },
  {
    name: "Dash",
    image: "https://ejemplo.com/dash.jpg",
    age: 10,
    weight: 30,
    story: "Dashiell Robert Parr es el hijo mediano de la familia con súper velocidad. Es enérgico, travieso y le encanta correr. Frustrado por tener que ocultar sus poderes, finalmente puede usarlos cuando la familia se une para salvar el día.",
    moviesTitle: ["The Incredibles", "Incredibles 2"]
  },
  {
    name: "Violet",
    image: "https://ejemplo.com/violet.jpg",
    age: 14,
    weight: 45,
    story: "Violet Parr es la hija mayor con poderes de invisibilidad y crear campos de fuerza. Inicialmente tímida e insegura, gana confianza a medida que acepta sus poderes. Es protectora con su familia y desarrolla una personalidad más fuerte.",
    moviesTitle: ["The Incredibles", "Incredibles 2"]
  },
  {
    name: "Jack-Jack",
    image: "https://ejemplo.com/jackjack.jpg",
    age: 1,
    weight: 10,
    story: "Jack-Jack Parr es el bebé de la familia con múltiples súper poderes que se manifiestan cuando está estresado o emocionado. Puede cambiar de forma, disparar rayos láser de sus ojos, teletransportarse, atravesar dimensiones y mucho más.",
    moviesTitle: ["The Incredibles", "Incredibles 2"]
  },
  {
    name: "Nemo",
    image: "https://ejemplo.com/nemo.jpg",
    age: 4,
    weight: 0.02,
    story: "Nemo es un joven pez payaso con una aleta derecha más pequeña. A pesar de su discapacidad, es valiente y aventurero. Después de ser capturado por buzos, su padre Marlin viaja por todo el océano para encontrarlo.",
    moviesTitle: ["Finding Nemo", "Finding Dory"]
  },
  {
    name: "Marlin",
    image: "https://ejemplo.com/marlin.jpg",
    age: 35,
    weight: 0.15,
    story: "Marlin es el padre sobreprotector de Nemo. Después de perder a su esposa y otros hijos ante un ataque, se vuelve extremadamente cauteloso. Su viaje para encontrar a Nemo lo transforma, aprendiendo a confiar y dejar ir el miedo.",
    moviesTitle: ["Finding Nemo", "Finding Dory"]
  },
  {
    name: "Dory",
    image: "https://ejemplo.com/dory.jpg",
    age: 30,
    weight: 0.1,
    story: "Dory es un pez cirujano azul con pérdida de memoria a corto plazo. A pesar de su condición, es optimista, amigable y valiente. Ayuda a Marlin a encontrar a Nemo y luego emprende su propia búsqueda para encontrar a su familia.",
    moviesTitle: ["Finding Nemo", "Finding Dory"]
  },
  {
    name: "Mike Wazowski",
    image: "https://ejemplo.com/mike.jpg",
    age: 28,
    weight: 30,
    story: "Mike Wazowski es un monstruo verde de un solo ojo que trabaja como asistente de sustos en Monsters Inc. Es gracioso, leal y el mejor amigo de Sulley. Eventualmente se convierte en comediante cuando la compañía cambia de sustos a risas.",
    moviesTitle: ["Monsters Inc", "Monsters University"]
  },
  {
    name: "Sulley",
    image: "https://ejemplo.com/sulley.jpg",
    age: 30,
    weight: 180,
    story: "James P. Sullivan es el mejor asustador de Monsters Inc. Es grande, peludo y aterrador, pero tiene un corazón gentil. Su vida cambia cuando conoce a Boo, una niña humana, y descubre que la risa es más poderosa que los gritos.",
    moviesTitle: ["Monsters Inc", "Monsters University"]
  },
  {
    name: "Boo",
    image: "https://ejemplo.com/boo.jpg",
    age: 2,
    weight: 12,
    story: "Boo es una niña humana que accidentalmente entra al mundo de los monstruos. No tiene miedo de Sulley y Mike, a quienes llama 'Kitty' y 'Mike Wazowski'. Su presencia cambia todo el sistema de Monstruópolis.",
    moviesTitle: ["Monsters Inc"]
  },
  {
    name: "Lightning McQueen",
    image: "https://ejemplo.com/mcqueen.jpg",
    age: 8,
    weight: 1200,
    story: "Lightning McQueen es un auto de carreras arrogante y ambicioso que sueña con ganar la Copa Pistón. Después de quedar atrapado en Radiator Springs, aprende que hay más en la vida que ganar carreras. Se vuelve más humilde y valora la amistad.",
    moviesTitle: ["Cars", "Cars 2", "Cars 3"]
  },
  {
    name: "Mater",
    image: "https://ejemplo.com/mater.jpg",
    age: 50,
    weight: 1500,
    story: "Mater es una grúa oxidada de Radiator Springs. Es simple, honesto y el mejor amigo de Lightning McQueen. Aunque no es el más inteligente, su lealtad y corazón puro son invaluables. En Cars 2, se convierte en espía accidental.",
    moviesTitle: ["Cars", "Cars 2", "Cars 3"]
  },
  {
    name: "Joy",
    image: "https://ejemplo.com/joy.jpg",
    age: 11,
    weight: 0.3,
    story: "Joy es la emoción líder en la mente de Riley. Es optimista y siempre intenta mantener a Riley feliz. Aprende que la tristeza también es importante y que todas las emociones tienen su lugar en una vida equilibrada.",
    moviesTitle: ["Inside Out"]
  },
  {
    name: "Sadness",
    image: "https://ejemplo.com/sadness.jpg",
    age: 11,
    weight: 0.3,
    story: "Sadness es la emoción melancólica de Riley. Al principio parece solo causar problemas, pero Joy aprende que Sadness es esencial para procesar el dolor y conectar con otros. Su papel es permitir que Riley acepte y supere momentos difíciles.",
    moviesTitle: ["Inside Out"]
  },
  {
    name: "Miguel",
    image: "https://ejemplo.com/miguel.jpg",
    age: 12,
    weight: 40,
    story: "Miguel Rivera es un niño mexicano apasionado por la música a pesar de la prohibición de su familia. Accidentalmente entra a la Tierra de los Muertos durante el Día de Muertos, donde descubre la verdad sobre su familia y la importancia de recordar a los ancestros.",
    moviesTitle: ["Coco"]
  },
  {
    name: "Héctor",
    image: "https://ejemplo.com/hector.jpg",
    age: 99,
    weight: 45,
    story: "Héctor es un esqueleto carismático en la Tierra de los Muertos que ayuda a Miguel. Es músico, gracioso y está desesperado por ser recordado. Se revela que es el tatarabuelo de Miguel y el verdadero compositor de las canciones famosas.",
    moviesTitle: ["Coco"]
  },
  {
    name: "Remy",
    image: "https://ejemplo.com/remy.jpg",
    age: 2,
    weight: 0.3,
    story: "Remy es una rata con un paladar excepcional y el sueño de ser chef. A pesar de las barreras obvias, forma una alianza con Linguini para cocinar en el restaurante de Auguste Gusteau en París. Demuestra que cualquiera puede cocinar.",
    moviesTitle: ["Ratatouille"]
  },
  {
    name: "Linguini",
    image: "https://ejemplo.com/linguini.jpg",
    age: 24,
    weight: 70,
    story: "Alfredo Linguini es un joven torpe que trabaja como ayudante de limpieza en Gusteau's. Con la ayuda de Remy, se convierte en un chef famoso. Es hijo del difunto Auguste Gusteau y heredero del restaurante.",
    moviesTitle: ["Ratatouille"]
  },
  {
    name: "Carl Fredricksen",
    image: "https://ejemplo.com/carl.jpg",
    age: 78,
    weight: 68,
    story: "Carl es un viudo gruñón que cumple su promesa a su difunta esposa Ellie de viajar a Paradise Falls amarrando miles de globos a su casa. Durante su aventura con Russell, aprende a abrirse nuevamente a la vida y la amistad.",
    moviesTitle: ["Up"]
  },
  {
    name: "Russell",
    image: "https://ejemplo.com/russell.jpg",
    age: 8,
    weight: 35,
    story: "Russell es un explorador junior entusiasta que accidentalmente se une a la aventura de Carl. Necesita una insignia más para convertirse en Explorador Senior. Es optimista, hablador y busca una figura paterna, que eventualmente encuentra en Carl.",
    moviesTitle: ["Up"]
  },
  {
    name: "Dug",
    image: "https://ejemplo.com/dug.jpg",
    age: 5,
    weight: 25,
    story: "Dug es un Golden Retriever con un collar que traduce sus pensamientos a palabras. Es dulce, leal y fácilmente distraído (especialmente por ardillas). Se une a Carl y Russell, convirtiéndose en el perro de Carl.",
    moviesTitle: ["Up"]
  }
];

export default characters;