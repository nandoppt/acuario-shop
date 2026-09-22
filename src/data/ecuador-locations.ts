export type ParishType = "urbana" | "rural";

export type EcuadorParish = {
  code: string;
  name: string;
  type: ParishType;
};

export type EcuadorCanton = {
  code: string;
  name: string;
  parishes: EcuadorParish[];
};

export type EcuadorProvince = {
  code: string;
  name: string;
  cantons: EcuadorCanton[];
};

export const ECUADOR_LOCATIONS: EcuadorProvince[] = [
  {
    code: "1",
    name: "Azuay",
    cantons: [
      {
        code: "101",
        name: "Cuenca",
        parishes: [
          {
            code: "10150",
            name: "Cuenca",
            type: "urbana",
          },
          {
            code: "10151",
            name: "Baños",
            type: "rural",
          },
          {
            code: "10152",
            name: "Cumbe",
            type: "rural",
          },
          {
            code: "10153",
            name: "Chaucha",
            type: "rural",
          },
          {
            code: "10154",
            name: "Checa",
            type: "rural",
          },
          {
            code: "10155",
            name: "Chiquintad",
            type: "rural",
          },
          {
            code: "10156",
            name: "Llacao",
            type: "rural",
          },
          {
            code: "10157",
            name: "Molleturo",
            type: "rural",
          },
          {
            code: "10158",
            name: "Nulti",
            type: "rural",
          },
          {
            code: "10159",
            name: "Octavio Cordero Palacios",
            type: "rural",
          },
          {
            code: "10160",
            name: "Paccha",
            type: "rural",
          },
          {
            code: "10161",
            name: "Quingeo",
            type: "rural",
          },
          {
            code: "10162",
            name: "Ricaurte",
            type: "rural",
          },
          {
            code: "10163",
            name: "San Joaquín",
            type: "rural",
          },
          {
            code: "10164",
            name: "Santa Ana",
            type: "rural",
          },
          {
            code: "10165",
            name: "Sayausí",
            type: "rural",
          },
          {
            code: "10166",
            name: "Sidcay",
            type: "rural",
          },
          {
            code: "10167",
            name: "Sinincay",
            type: "rural",
          },
          {
            code: "10168",
            name: "Tarqui",
            type: "rural",
          },
          {
            code: "10169",
            name: "Turi",
            type: "rural",
          },
          {
            code: "10170",
            name: "Valle",
            type: "rural",
          },
          {
            code: "10171",
            name: "Victoria del Portete",
            type: "rural",
          },
        ],
      },
      {
        code: "102",
        name: "Girón",
        parishes: [
          {
            code: "10250",
            name: "Girón",
            type: "urbana",
          },
          {
            code: "10251",
            name: "La Asunción",
            type: "rural",
          },
          {
            code: "10252",
            name: "San Gerardo",
            type: "rural",
          },
        ],
      },
      {
        code: "103",
        name: "Gualaceo",
        parishes: [
          {
            code: "10350",
            name: "Gualaceo",
            type: "urbana",
          },
          {
            code: "10352",
            name: "Daniel Córdova Toral",
            type: "rural",
          },
          {
            code: "10353",
            name: "Jadán",
            type: "rural",
          },
          {
            code: "10354",
            name: "Mariano Moreno",
            type: "rural",
          },
          {
            code: "10356",
            name: "Remigio Crespo Toral",
            type: "rural",
          },
          {
            code: "10357",
            name: "San Juan",
            type: "rural",
          },
          {
            code: "10358",
            name: "Zhidmad",
            type: "rural",
          },
          {
            code: "10359",
            name: "Luis Cordero Vega",
            type: "rural",
          },
          {
            code: "10360",
            name: "Simón Bolívar",
            type: "rural",
          },
        ],
      },
      {
        code: "104",
        name: "Nabón",
        parishes: [
          {
            code: "10450",
            name: "Nabón",
            type: "urbana",
          },
          {
            code: "10451",
            name: "Cochapata",
            type: "rural",
          },
          {
            code: "10452",
            name: "El Progreso",
            type: "rural",
          },
          {
            code: "10453",
            name: "Las Nieves",
            type: "rural",
          },
        ],
      },
      {
        code: "105",
        name: "Paute",
        parishes: [
          {
            code: "10550",
            name: "Paute",
            type: "urbana",
          },
          {
            code: "10552",
            name: "Bulán",
            type: "rural",
          },
          {
            code: "10553",
            name: "Chicán",
            type: "rural",
          },
          {
            code: "10554",
            name: "El Cabo",
            type: "rural",
          },
          {
            code: "10556",
            name: "Guarainag",
            type: "rural",
          },
          {
            code: "10559",
            name: "San Cristóbal",
            type: "rural",
          },
          {
            code: "10561",
            name: "Tomebamba",
            type: "rural",
          },
          {
            code: "10562",
            name: "Dug Dug",
            type: "rural",
          },
        ],
      },
      {
        code: "106",
        name: "Pucará",
        parishes: [
          {
            code: "10650",
            name: "Pucará",
            type: "urbana",
          },
          {
            code: "10652",
            name: "San Rafael de Sharug",
            type: "rural",
          },
        ],
      },
      {
        code: "107",
        name: "San Fernando",
        parishes: [
          {
            code: "10750",
            name: "San Fernando",
            type: "urbana",
          },
          {
            code: "10751",
            name: "Chumblín",
            type: "rural",
          },
        ],
      },
      {
        code: "108",
        name: "Santa Isabel",
        parishes: [
          {
            code: "10850",
            name: "Santa Isabel",
            type: "urbana",
          },
          {
            code: "10851",
            name: "Abdón Calderón",
            type: "rural",
          },
          {
            code: "10852",
            name: "El Carmen de Pijilí",
            type: "rural",
          },
          {
            code: "10853",
            name: "Shaglli",
            type: "rural",
          },
          {
            code: "10854",
            name: "San Salvador de Cañaribamba",
            type: "rural",
          },
        ],
      },
      {
        code: "109",
        name: "Sígsig",
        parishes: [
          {
            code: "10950",
            name: "Sígsig",
            type: "urbana",
          },
          {
            code: "10951",
            name: "Cuchil",
            type: "rural",
          },
          {
            code: "10952",
            name: "Jima",
            type: "rural",
          },
          {
            code: "10953",
            name: "Güel",
            type: "rural",
          },
          {
            code: "10954",
            name: "Ludo",
            type: "rural",
          },
          {
            code: "10955",
            name: "San Bartolomé",
            type: "rural",
          },
          {
            code: "10956",
            name: "San José de Raranga",
            type: "rural",
          },
        ],
      },
      {
        code: "110",
        name: "Oña",
        parishes: [
          {
            code: "11050",
            name: "San Felipe de Oña",
            type: "urbana",
          },
          {
            code: "11051",
            name: "Susudel",
            type: "rural",
          },
        ],
      },
      {
        code: "111",
        name: "Chordeleg",
        parishes: [
          {
            code: "11150",
            name: "Chordeleg",
            type: "urbana",
          },
          {
            code: "11151",
            name: "Principal",
            type: "rural",
          },
          {
            code: "11152",
            name: "La Unión",
            type: "rural",
          },
          {
            code: "11153",
            name: "Luis Galarza Orellana",
            type: "rural",
          },
          {
            code: "11154",
            name: "San Martín de Puzhio",
            type: "rural",
          },
        ],
      },
      {
        code: "112",
        name: "El Pan",
        parishes: [
          {
            code: "11250",
            name: "El Pan",
            type: "urbana",
          },
          {
            code: "11253",
            name: "San Vicente",
            type: "rural",
          },
        ],
      },
      {
        code: "113",
        name: "Sevilla de Oro",
        parishes: [
          {
            code: "11350",
            name: "Sevilla de Oro",
            type: "urbana",
          },
          {
            code: "11351",
            name: "Amaluza",
            type: "rural",
          },
          {
            code: "11352",
            name: "Palmas",
            type: "rural",
          },
        ],
      },
      {
        code: "114",
        name: "Guachapala",
        parishes: [
          {
            code: "11450",
            name: "Guachapala",
            type: "urbana",
          },
        ],
      },
      {
        code: "115",
        name: "Camilo Ponce Enríquez",
        parishes: [
          {
            code: "11550",
            name: "Camilo Ponce Enríquez",
            type: "urbana",
          },
        ],
      },
    ],
  },
  {
    code: "2",
    name: "Bolívar",
    cantons: [
      {
        code: "201",
        name: "Guaranda",
        parishes: [
          {
            code: "20150",
            name: "Guaranda",
            type: "urbana",
          },
          {
            code: "20151",
            name: "Facundo Vela",
            type: "rural",
          },
          {
            code: "20153",
            name: "Julio E. Moreno",
            type: "rural",
          },
          {
            code: "20155",
            name: "Salinas",
            type: "rural",
          },
          {
            code: "20156",
            name: "San Lorenzo",
            type: "rural",
          },
          {
            code: "20157",
            name: "San Simón",
            type: "rural",
          },
          {
            code: "20158",
            name: "Santa Fe",
            type: "rural",
          },
          {
            code: "20159",
            name: "Simiátug",
            type: "rural",
          },
          {
            code: "20160",
            name: "San Luis de Pambil",
            type: "rural",
          },
        ],
      },
      {
        code: "202",
        name: "Chillanes",
        parishes: [
          {
            code: "20250",
            name: "Chillanes",
            type: "urbana",
          },
          {
            code: "20251",
            name: "San José del Tambo",
            type: "rural",
          },
        ],
      },
      {
        code: "203",
        name: "Chimbo",
        parishes: [
          {
            code: "20350",
            name: "San José de Chimbo",
            type: "urbana",
          },
          {
            code: "20351",
            name: "Asunción",
            type: "rural",
          },
          {
            code: "20353",
            name: "La Magdalena",
            type: "rural",
          },
          {
            code: "20354",
            name: "San Sebastián",
            type: "rural",
          },
          {
            code: "20355",
            name: "Telimbela",
            type: "rural",
          },
        ],
      },
      {
        code: "204",
        name: "Echeandía",
        parishes: [
          {
            code: "20450",
            name: "Echeandía",
            type: "urbana",
          },
        ],
      },
      {
        code: "205",
        name: "San Miguel",
        parishes: [
          {
            code: "20550",
            name: "San Miguel",
            type: "urbana",
          },
          {
            code: "20551",
            name: "Balsapamba",
            type: "rural",
          },
          {
            code: "20552",
            name: "Bilován",
            type: "rural",
          },
          {
            code: "20553",
            name: "Régulo de Mora",
            type: "rural",
          },
          {
            code: "20554",
            name: "San Pablo",
            type: "rural",
          },
          {
            code: "20555",
            name: "Santiago",
            type: "rural",
          },
          {
            code: "20556",
            name: "San Vicente",
            type: "rural",
          },
        ],
      },
      {
        code: "206",
        name: "Caluma",
        parishes: [
          {
            code: "20650",
            name: "Caluma",
            type: "urbana",
          },
        ],
      },
      {
        code: "207",
        name: "Las Naves",
        parishes: [
          {
            code: "20750",
            name: "Las Naves",
            type: "urbana",
          },
        ],
      },
    ],
  },
  {
    code: "3",
    name: "Cañar",
    cantons: [
      {
        code: "301",
        name: "Azogues",
        parishes: [
          {
            code: "30150",
            name: "Azogues",
            type: "urbana",
          },
          {
            code: "30151",
            name: "Cojitambo",
            type: "rural",
          },
          {
            code: "30153",
            name: "Guapán",
            type: "rural",
          },
          {
            code: "30154",
            name: "Javier Loyola",
            type: "rural",
          },
          {
            code: "30155",
            name: "Luis Cordero",
            type: "rural",
          },
          {
            code: "30156",
            name: "Pindilig",
            type: "rural",
          },
          {
            code: "30157",
            name: "Rivera",
            type: "rural",
          },
          {
            code: "30158",
            name: "San Miguel",
            type: "rural",
          },
          {
            code: "30160",
            name: "Taday",
            type: "rural",
          },
        ],
      },
      {
        code: "302",
        name: "Biblián",
        parishes: [
          {
            code: "30250",
            name: "Biblián",
            type: "urbana",
          },
          {
            code: "30251",
            name: "Nazón",
            type: "rural",
          },
          {
            code: "30252",
            name: "San Francisco de Sageo",
            type: "rural",
          },
          {
            code: "30253",
            name: "Turupamba",
            type: "rural",
          },
          {
            code: "30254",
            name: "Jerusalén",
            type: "rural",
          },
        ],
      },
      {
        code: "303",
        name: "Cañar",
        parishes: [
          {
            code: "30350",
            name: "Cañar",
            type: "urbana",
          },
          {
            code: "30351",
            name: "Chontamarca",
            type: "rural",
          },
          {
            code: "30352",
            name: "Chorocopte",
            type: "rural",
          },
          {
            code: "30353",
            name: "General Morales",
            type: "rural",
          },
          {
            code: "30354",
            name: "Gualleturo",
            type: "rural",
          },
          {
            code: "30355",
            name: "Honorato Vásquez",
            type: "rural",
          },
          {
            code: "30356",
            name: "Ingapirca",
            type: "rural",
          },
          {
            code: "30357",
            name: "Juncal",
            type: "rural",
          },
          {
            code: "30358",
            name: "San Antonio",
            type: "rural",
          },
          {
            code: "30361",
            name: "Zhud",
            type: "rural",
          },
          {
            code: "30362",
            name: "Ventura",
            type: "rural",
          },
          {
            code: "30363",
            name: "Ducur",
            type: "rural",
          },
        ],
      },
      {
        code: "304",
        name: "La Troncal",
        parishes: [
          {
            code: "30450",
            name: "La Troncal",
            type: "urbana",
          },
          {
            code: "30451",
            name: "Manuel J. Calle",
            type: "rural",
          },
          {
            code: "30452",
            name: "Pancho Negro",
            type: "rural",
          },
        ],
      },
      {
        code: "305",
        name: "El Tambo",
        parishes: [
          {
            code: "30550",
            name: "El Tambo",
            type: "urbana",
          },
        ],
      },
      {
        code: "306",
        name: "Déleg",
        parishes: [
          {
            code: "30650",
            name: "Déleg",
            type: "urbana",
          },
          {
            code: "30651",
            name: "Solano",
            type: "rural",
          },
        ],
      },
      {
        code: "307",
        name: "Suscal",
        parishes: [
          {
            code: "30750",
            name: "Suscal",
            type: "urbana",
          },
        ],
      },
    ],
  },
  {
    code: "4",
    name: "Carchi",
    cantons: [
      {
        code: "401",
        name: "Tulcán",
        parishes: [
          {
            code: "40150",
            name: "Tulcán",
            type: "urbana",
          },
          {
            code: "40151",
            name: "El Carmelo",
            type: "rural",
          },
          {
            code: "40153",
            name: "Julio Andrade",
            type: "rural",
          },
          {
            code: "40154",
            name: "Maldonado",
            type: "rural",
          },
          {
            code: "40155",
            name: "Pioter",
            type: "rural",
          },
          {
            code: "40156",
            name: "Tobar Donoso",
            type: "rural",
          },
          {
            code: "40157",
            name: "Tufiño",
            type: "rural",
          },
          {
            code: "40158",
            name: "Urbina",
            type: "rural",
          },
          {
            code: "40159",
            name: "El Chical",
            type: "rural",
          },
          {
            code: "40161",
            name: "Santa Martha de Cuba",
            type: "rural",
          },
        ],
      },
      {
        code: "402",
        name: "Bolívar",
        parishes: [
          {
            code: "40250",
            name: "Bolívar",
            type: "urbana",
          },
          {
            code: "40251",
            name: "García Moreno",
            type: "rural",
          },
          {
            code: "40252",
            name: "Los Andes",
            type: "rural",
          },
          {
            code: "40253",
            name: "Monte Olivo",
            type: "rural",
          },
          {
            code: "40254",
            name: "San Vicente de Pusir",
            type: "rural",
          },
          {
            code: "40255",
            name: "San Rafael",
            type: "rural",
          },
        ],
      },
      {
        code: "403",
        name: "Espejo",
        parishes: [
          {
            code: "40350",
            name: "El Ángel",
            type: "urbana",
          },
          {
            code: "40351",
            name: "El Goaltal",
            type: "rural",
          },
          {
            code: "40352",
            name: "La Libertad",
            type: "rural",
          },
          {
            code: "40353",
            name: "San Isidro",
            type: "rural",
          },
        ],
      },
      {
        code: "404",
        name: "Mira",
        parishes: [
          {
            code: "40450",
            name: "Mira",
            type: "urbana",
          },
          {
            code: "40451",
            name: "Concepción",
            type: "rural",
          },
          {
            code: "40452",
            name: "Jijón y Caamaño",
            type: "rural",
          },
          {
            code: "40453",
            name: "Juan Montalvo",
            type: "rural",
          },
        ],
      },
      {
        code: "405",
        name: "Montúfar",
        parishes: [
          {
            code: "40550",
            name: "San Gabriel",
            type: "urbana",
          },
          {
            code: "40551",
            name: "Cristóbal Colón",
            type: "rural",
          },
          {
            code: "40552",
            name: "Chitán de Navarrete",
            type: "rural",
          },
          {
            code: "40553",
            name: "Fernández Salvador",
            type: "rural",
          },
          {
            code: "40554",
            name: "La Paz",
            type: "rural",
          },
          {
            code: "40555",
            name: "Piartal",
            type: "rural",
          },
        ],
      },
      {
        code: "406",
        name: "San Pedro de Huaca",
        parishes: [
          {
            code: "40650",
            name: "Huaca",
            type: "urbana",
          },
          {
            code: "40651",
            name: "Mariscal Sucre",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "5",
    name: "Cotopaxi",
    cantons: [
      {
        code: "501",
        name: "Latacunga",
        parishes: [
          {
            code: "50150",
            name: "Latacunga",
            type: "urbana",
          },
          {
            code: "50151",
            name: "Aláquez",
            type: "rural",
          },
          {
            code: "50152",
            name: "Belisario Quevedo",
            type: "rural",
          },
          {
            code: "50153",
            name: "Guaytacama",
            type: "rural",
          },
          {
            code: "50154",
            name: "Joseguango Bajo",
            type: "rural",
          },
          {
            code: "50156",
            name: "Mulaló",
            type: "rural",
          },
          {
            code: "50157",
            name: "Once de Noviembre",
            type: "rural",
          },
          {
            code: "50158",
            name: "Poaló",
            type: "rural",
          },
          {
            code: "50159",
            name: "San Juan de Pastocalle",
            type: "rural",
          },
          {
            code: "50161",
            name: "Tanicuchi",
            type: "rural",
          },
          {
            code: "50162",
            name: "Toacaso",
            type: "rural",
          },
        ],
      },
      {
        code: "502",
        name: "La Maná",
        parishes: [
          {
            code: "50250",
            name: "La Maná",
            type: "urbana",
          },
          {
            code: "50251",
            name: "Guasaganda",
            type: "rural",
          },
          {
            code: "50252",
            name: "Pucayacu",
            type: "rural",
          },
        ],
      },
      {
        code: "503",
        name: "Pangua",
        parishes: [
          {
            code: "50350",
            name: "El Corazón",
            type: "urbana",
          },
          {
            code: "50351",
            name: "Moraspungo",
            type: "rural",
          },
          {
            code: "50352",
            name: "Pinllopata",
            type: "rural",
          },
          {
            code: "50353",
            name: "Ramón Campaña",
            type: "rural",
          },
        ],
      },
      {
        code: "504",
        name: "Pujilí",
        parishes: [
          {
            code: "50450",
            name: "Pujilí",
            type: "urbana",
          },
          {
            code: "50451",
            name: "Angamarca",
            type: "rural",
          },
          {
            code: "50453",
            name: "Guangaje",
            type: "rural",
          },
          {
            code: "50455",
            name: "La Victoria",
            type: "rural",
          },
          {
            code: "50456",
            name: "Pilaló",
            type: "rural",
          },
          {
            code: "50457",
            name: "Tingo",
            type: "rural",
          },
          {
            code: "50458",
            name: "Zumbahua",
            type: "rural",
          },
        ],
      },
      {
        code: "505",
        name: "Salcedo",
        parishes: [
          {
            code: "50550",
            name: "San Miguel",
            type: "urbana",
          },
          {
            code: "50551",
            name: "Antonio José Holguín",
            type: "rural",
          },
          {
            code: "50552",
            name: "Cusubamba",
            type: "rural",
          },
          {
            code: "50553",
            name: "Mulalillo",
            type: "rural",
          },
          {
            code: "50554",
            name: "Mulliquindil",
            type: "rural",
          },
          {
            code: "50555",
            name: "Pansaleo",
            type: "rural",
          },
        ],
      },
      {
        code: "506",
        name: "Saquisilí",
        parishes: [
          {
            code: "50650",
            name: "Saquisilí",
            type: "urbana",
          },
          {
            code: "50651",
            name: "Canchagua",
            type: "rural",
          },
          {
            code: "50652",
            name: "Chantilín",
            type: "rural",
          },
          {
            code: "50653",
            name: "Cochapamba",
            type: "rural",
          },
        ],
      },
      {
        code: "507",
        name: "Sigchos",
        parishes: [
          {
            code: "50750",
            name: "Sigchos",
            type: "urbana",
          },
          {
            code: "50751",
            name: "Chugchillán",
            type: "rural",
          },
          {
            code: "50752",
            name: "Isinlivi",
            type: "rural",
          },
          {
            code: "50753",
            name: "Las Pampas",
            type: "rural",
          },
          {
            code: "50754",
            name: "Palo Quemado",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "6",
    name: "Chimborazo",
    cantons: [
      {
        code: "601",
        name: "Riobamba",
        parishes: [
          {
            code: "60150",
            name: "Riobamba",
            type: "urbana",
          },
          {
            code: "60151",
            name: "Cacha",
            type: "rural",
          },
          {
            code: "60152",
            name: "Calpi",
            type: "rural",
          },
          {
            code: "60153",
            name: "Cubijíes",
            type: "rural",
          },
          {
            code: "60154",
            name: "Flores",
            type: "rural",
          },
          {
            code: "60155",
            name: "Licán",
            type: "rural",
          },
          {
            code: "60156",
            name: "Licto",
            type: "rural",
          },
          {
            code: "60157",
            name: "Pungalá",
            type: "rural",
          },
          {
            code: "60158",
            name: "Punín",
            type: "rural",
          },
          {
            code: "60159",
            name: "Quimiag",
            type: "rural",
          },
          {
            code: "60160",
            name: "San Juan",
            type: "rural",
          },
          {
            code: "60161",
            name: "San Luis",
            type: "rural",
          },
        ],
      },
      {
        code: "602",
        name: "Alausí",
        parishes: [
          {
            code: "60250",
            name: "Alausí",
            type: "urbana",
          },
          {
            code: "60251",
            name: "Achupallas",
            type: "rural",
          },
          {
            code: "60253",
            name: "Guasuntos",
            type: "rural",
          },
          {
            code: "60254",
            name: "Huigra",
            type: "rural",
          },
          {
            code: "60255",
            name: "Multitud",
            type: "rural",
          },
          {
            code: "60256",
            name: "Pistishi",
            type: "rural",
          },
          {
            code: "60257",
            name: "Pumallacta",
            type: "rural",
          },
          {
            code: "60258",
            name: "Sevilla",
            type: "rural",
          },
          {
            code: "60259",
            name: "Sibambe",
            type: "rural",
          },
          {
            code: "60260",
            name: "Tixán",
            type: "rural",
          },
        ],
      },
      {
        code: "603",
        name: "Colta",
        parishes: [
          {
            code: "60350",
            name: "Villa La Unión",
            type: "urbana",
          },
          {
            code: "60351",
            name: "Cañi",
            type: "rural",
          },
          {
            code: "60352",
            name: "Columbe",
            type: "rural",
          },
          {
            code: "60353",
            name: "Juan de Velasco",
            type: "rural",
          },
          {
            code: "60354",
            name: "Santiago de Quito",
            type: "rural",
          },
        ],
      },
      {
        code: "604",
        name: "Chambo",
        parishes: [
          {
            code: "60450",
            name: "Chambo",
            type: "urbana",
          },
        ],
      },
      {
        code: "605",
        name: "Chunchi",
        parishes: [
          {
            code: "60550",
            name: "Chunchi",
            type: "urbana",
          },
          {
            code: "60551",
            name: "Capzol",
            type: "rural",
          },
          {
            code: "60552",
            name: "Compud",
            type: "rural",
          },
          {
            code: "60553",
            name: "Gonzol",
            type: "rural",
          },
          {
            code: "60554",
            name: "Llagos",
            type: "rural",
          },
        ],
      },
      {
        code: "606",
        name: "Guamote",
        parishes: [
          {
            code: "60650",
            name: "Guamote",
            type: "urbana",
          },
          {
            code: "60651",
            name: "Cebadas",
            type: "rural",
          },
          {
            code: "60652",
            name: "Palmira",
            type: "rural",
          },
        ],
      },
      {
        code: "607",
        name: "Guano",
        parishes: [
          {
            code: "60750",
            name: "Guano",
            type: "urbana",
          },
          {
            code: "60751",
            name: "Guanando",
            type: "rural",
          },
          {
            code: "60752",
            name: "Ilapo",
            type: "rural",
          },
          {
            code: "60753",
            name: "La Providencia",
            type: "rural",
          },
          {
            code: "60754",
            name: "San Andrés",
            type: "rural",
          },
          {
            code: "60755",
            name: "San Gerardo",
            type: "rural",
          },
          {
            code: "60756",
            name: "San Isidro de Patulú",
            type: "rural",
          },
          {
            code: "60757",
            name: "San José del Chazo",
            type: "rural",
          },
          {
            code: "60758",
            name: "Santa Fé de Galán",
            type: "rural",
          },
          {
            code: "60759",
            name: "Valparaiso",
            type: "rural",
          },
        ],
      },
      {
        code: "608",
        name: "Pallatanga",
        parishes: [
          {
            code: "60850",
            name: "Pallatanga",
            type: "urbana",
          },
        ],
      },
      {
        code: "609",
        name: "Penipe",
        parishes: [
          {
            code: "60950",
            name: "Penipe",
            type: "urbana",
          },
          {
            code: "60951",
            name: "El Altar",
            type: "rural",
          },
          {
            code: "60952",
            name: "Matus",
            type: "rural",
          },
          {
            code: "60953",
            name: "Puela",
            type: "rural",
          },
          {
            code: "60954",
            name: "San Antonio de Bayushig",
            type: "rural",
          },
          {
            code: "60955",
            name: "La Candelaria",
            type: "rural",
          },
          {
            code: "60956",
            name: "Bilbao",
            type: "rural",
          },
        ],
      },
      {
        code: "610",
        name: "Cumandá",
        parishes: [
          {
            code: "61050",
            name: "Cumandá",
            type: "urbana",
          },
        ],
      },
    ],
  },
  {
    code: "7",
    name: "El Oro",
    cantons: [
      {
        code: "701",
        name: "Machala",
        parishes: [
          {
            code: "70150",
            name: "Machala",
            type: "urbana",
          },
          {
            code: "70152",
            name: "El Retiro",
            type: "rural",
          },
        ],
      },
      {
        code: "702",
        name: "Arenillas",
        parishes: [
          {
            code: "70250",
            name: "Arenillas",
            type: "urbana",
          },
          {
            code: "70251",
            name: "Chacras",
            type: "rural",
          },
          {
            code: "70254",
            name: "Palmales",
            type: "rural",
          },
          {
            code: "70255",
            name: "Carcabón",
            type: "rural",
          },
          {
            code: "70256",
            name: "La Cuca",
            type: "rural",
          },
        ],
      },
      {
        code: "703",
        name: "Atahualpa",
        parishes: [
          {
            code: "70350",
            name: "Paccha",
            type: "urbana",
          },
          {
            code: "70351",
            name: "Ayapamba",
            type: "rural",
          },
          {
            code: "70352",
            name: "Cordoncillo",
            type: "rural",
          },
          {
            code: "70353",
            name: "Milagro",
            type: "rural",
          },
          {
            code: "70354",
            name: "San José",
            type: "rural",
          },
          {
            code: "70355",
            name: "San Juan de Cerro Azul",
            type: "rural",
          },
        ],
      },
      {
        code: "704",
        name: "Balsas",
        parishes: [
          {
            code: "70450",
            name: "Balsas",
            type: "urbana",
          },
          {
            code: "70451",
            name: "Bellamaría",
            type: "rural",
          },
        ],
      },
      {
        code: "705",
        name: "Chilla",
        parishes: [
          {
            code: "70550",
            name: "Chilla",
            type: "urbana",
          },
        ],
      },
      {
        code: "706",
        name: "El Guabo",
        parishes: [
          {
            code: "70650",
            name: "El Guabo",
            type: "urbana",
          },
          {
            code: "70651",
            name: "Barbones",
            type: "rural",
          },
          {
            code: "70652",
            name: "La Iberia",
            type: "rural",
          },
          {
            code: "70653",
            name: "Tendales",
            type: "rural",
          },
          {
            code: "70654",
            name: "Río Bonito",
            type: "rural",
          },
        ],
      },
      {
        code: "707",
        name: "Huaquillas",
        parishes: [
          {
            code: "70750",
            name: "Huaquillas",
            type: "urbana",
          },
        ],
      },
      {
        code: "708",
        name: "Marcabelí",
        parishes: [
          {
            code: "70850",
            name: "Marcabelí",
            type: "urbana",
          },
          {
            code: "70851",
            name: "El Ingenio",
            type: "rural",
          },
        ],
      },
      {
        code: "709",
        name: "Pasaje",
        parishes: [
          {
            code: "70950",
            name: "Pasaje",
            type: "urbana",
          },
          {
            code: "70951",
            name: "Buenavista",
            type: "rural",
          },
          {
            code: "70952",
            name: "Casacay",
            type: "rural",
          },
          {
            code: "70953",
            name: "La Peaña",
            type: "rural",
          },
          {
            code: "70954",
            name: "Progreso",
            type: "rural",
          },
          {
            code: "70955",
            name: "Uzhcurrumi",
            type: "rural",
          },
          {
            code: "70956",
            name: "Cañaquemada",
            type: "rural",
          },
        ],
      },
      {
        code: "710",
        name: "Piñas",
        parishes: [
          {
            code: "71050",
            name: "Piñas",
            type: "urbana",
          },
          {
            code: "71051",
            name: "Capiro",
            type: "rural",
          },
          {
            code: "71052",
            name: "La Bocana",
            type: "rural",
          },
          {
            code: "71053",
            name: "Moromoro",
            type: "rural",
          },
          {
            code: "71054",
            name: "Piedras",
            type: "rural",
          },
          {
            code: "71055",
            name: "San Roque",
            type: "rural",
          },
          {
            code: "71056",
            name: "Saracay",
            type: "rural",
          },
        ],
      },
      {
        code: "711",
        name: "Portovelo",
        parishes: [
          {
            code: "71150",
            name: "Portovelo",
            type: "urbana",
          },
          {
            code: "71151",
            name: "Curtincapa",
            type: "rural",
          },
          {
            code: "71152",
            name: "Morales",
            type: "rural",
          },
          {
            code: "71153",
            name: "Salatí",
            type: "rural",
          },
        ],
      },
      {
        code: "712",
        name: "Santa Rosa",
        parishes: [
          {
            code: "71250",
            name: "Santa Rosa",
            type: "urbana",
          },
          {
            code: "71251",
            name: "Bellavista",
            type: "rural",
          },
          {
            code: "71252",
            name: "Jambelí",
            type: "rural",
          },
          {
            code: "71253",
            name: "La Avanzada",
            type: "rural",
          },
          {
            code: "71254",
            name: "San Antonio",
            type: "rural",
          },
          {
            code: "71255",
            name: "Torata",
            type: "rural",
          },
          {
            code: "71256",
            name: "Victoria",
            type: "rural",
          },
          {
            code: "71257",
            name: "Bellamaría",
            type: "rural",
          },
        ],
      },
      {
        code: "713",
        name: "Zaruma",
        parishes: [
          {
            code: "71350",
            name: "Zaruma",
            type: "urbana",
          },
          {
            code: "71351",
            name: "Abañín",
            type: "rural",
          },
          {
            code: "71352",
            name: "Arcapamba",
            type: "rural",
          },
          {
            code: "71353",
            name: "Guanazán",
            type: "rural",
          },
          {
            code: "71354",
            name: "Guizhaguiña",
            type: "rural",
          },
          {
            code: "71355",
            name: "Huertas",
            type: "rural",
          },
          {
            code: "71356",
            name: "Malvas",
            type: "rural",
          },
          {
            code: "71357",
            name: "Muluncay Grande",
            type: "rural",
          },
          {
            code: "71358",
            name: "Sinsao",
            type: "rural",
          },
          {
            code: "71359",
            name: "Salvias",
            type: "rural",
          },
        ],
      },
      {
        code: "714",
        name: "Las Lajas",
        parishes: [
          {
            code: "71450",
            name: "La Victoria",
            type: "urbana",
          },
          {
            code: "71451",
            name: "La Libertad",
            type: "rural",
          },
          {
            code: "71452",
            name: "El Paraíso",
            type: "rural",
          },
          {
            code: "71453",
            name: "San Isidro",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "8",
    name: "Esmeraldas",
    cantons: [
      {
        code: "801",
        name: "Esmeraldas",
        parishes: [
          {
            code: "80150",
            name: "Esmeraldas",
            type: "urbana",
          },
          {
            code: "80152",
            name: "Camarones",
            type: "rural",
          },
          {
            code: "80153",
            name: "Coronel Carlos Concha Torres",
            type: "rural",
          },
          {
            code: "80154",
            name: "Chinca",
            type: "rural",
          },
          {
            code: "80159",
            name: "Majua",
            type: "rural",
          },
          {
            code: "80163",
            name: "San Mateo",
            type: "rural",
          },
          {
            code: "80165",
            name: "Tabiazo",
            type: "rural",
          },
          {
            code: "80166",
            name: "Tachina",
            type: "rural",
          },
          {
            code: "80168",
            name: "Vuelta Larga",
            type: "rural",
          },
        ],
      },
      {
        code: "802",
        name: "Eloy Alfaro",
        parishes: [
          {
            code: "80250",
            name: "Valdez",
            type: "urbana",
          },
          {
            code: "80251",
            name: "Anchayacu",
            type: "rural",
          },
          {
            code: "80252",
            name: "Atahualpa",
            type: "rural",
          },
          {
            code: "80253",
            name: "Borbón",
            type: "rural",
          },
          {
            code: "80254",
            name: "La Tola",
            type: "rural",
          },
          {
            code: "80255",
            name: "Luis Vargas Torres",
            type: "rural",
          },
          {
            code: "80256",
            name: "Maldonado",
            type: "rural",
          },
          {
            code: "80257",
            name: "Pampanal de Bolívar",
            type: "rural",
          },
          {
            code: "80258",
            name: "San Francisco de Onzole",
            type: "rural",
          },
          {
            code: "80259",
            name: "Santo Domingo de Onzole",
            type: "rural",
          },
          {
            code: "80260",
            name: "Selva Alegre",
            type: "rural",
          },
          {
            code: "80261",
            name: "Telembí",
            type: "rural",
          },
          {
            code: "80262",
            name: "Colón Eloy del María",
            type: "rural",
          },
          {
            code: "80263",
            name: "San José de Cayapas",
            type: "rural",
          },
          {
            code: "80264",
            name: "Timbiré",
            type: "rural",
          },
          {
            code: "80265",
            name: "Santa Lucía de las Peñas",
            type: "rural",
          },
        ],
      },
      {
        code: "803",
        name: "Muisne",
        parishes: [
          {
            code: "80350",
            name: "Muisne",
            type: "urbana",
          },
          {
            code: "80351",
            name: "Bolívar",
            type: "rural",
          },
          {
            code: "80352",
            name: "Daule",
            type: "rural",
          },
          {
            code: "80353",
            name: "Galera",
            type: "rural",
          },
          {
            code: "80354",
            name: "Quingue",
            type: "rural",
          },
          {
            code: "80355",
            name: "Sálima",
            type: "rural",
          },
          {
            code: "80356",
            name: "San Francisco",
            type: "rural",
          },
          {
            code: "80357",
            name: "San Gregorio",
            type: "rural",
          },
          {
            code: "80358",
            name: "San José de Chamanga",
            type: "rural",
          },
        ],
      },
      {
        code: "804",
        name: "Quinindé",
        parishes: [
          {
            code: "80450",
            name: "Rosa Zárate",
            type: "urbana",
          },
          {
            code: "80451",
            name: "Cube",
            type: "rural",
          },
          {
            code: "80452",
            name: "Chura",
            type: "rural",
          },
          {
            code: "80453",
            name: "Malimpia",
            type: "rural",
          },
          {
            code: "80454",
            name: "Viche",
            type: "rural",
          },
          {
            code: "80455",
            name: "La Unión",
            type: "rural",
          },
        ],
      },
      {
        code: "805",
        name: "San Lorenzo",
        parishes: [
          {
            code: "80550",
            name: "San Lorenzo",
            type: "urbana",
          },
          {
            code: "80551",
            name: "Alto Tambo",
            type: "rural",
          },
          {
            code: "80552",
            name: "Ancón",
            type: "rural",
          },
          {
            code: "80553",
            name: "Calderón",
            type: "rural",
          },
          {
            code: "80554",
            name: "Carondelet",
            type: "rural",
          },
          {
            code: "80555",
            name: "5 de Junio",
            type: "rural",
          },
          {
            code: "80556",
            name: "Concepción",
            type: "rural",
          },
          {
            code: "80557",
            name: "Mataje",
            type: "rural",
          },
          {
            code: "80558",
            name: "San Javier de Cachaví",
            type: "rural",
          },
          {
            code: "80559",
            name: "Santa Rita",
            type: "rural",
          },
          {
            code: "80560",
            name: "Tambillo",
            type: "rural",
          },
          {
            code: "80561",
            name: "Tululbí",
            type: "rural",
          },
          {
            code: "80562",
            name: "Urbina",
            type: "rural",
          },
        ],
      },
      {
        code: "806",
        name: "Atacames",
        parishes: [
          {
            code: "80650",
            name: "Atacames",
            type: "urbana",
          },
          {
            code: "80651",
            name: "La Unión",
            type: "rural",
          },
          {
            code: "80652",
            name: "Súa",
            type: "rural",
          },
          {
            code: "80653",
            name: "Tonchigüe",
            type: "rural",
          },
          {
            code: "80654",
            name: "Tonsupa",
            type: "rural",
          },
        ],
      },
      {
        code: "807",
        name: "Rioverde",
        parishes: [
          {
            code: "80750",
            name: "Rioverde",
            type: "urbana",
          },
          {
            code: "80751",
            name: "Chontaduro",
            type: "rural",
          },
          {
            code: "80752",
            name: "Chumundé",
            type: "rural",
          },
          {
            code: "80753",
            name: "Lagarto",
            type: "rural",
          },
          {
            code: "80754",
            name: "Montalvo",
            type: "rural",
          },
          {
            code: "80755",
            name: "Rocafuerte",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "9",
    name: "Guayas",
    cantons: [
      {
        code: "901",
        name: "Guayaquil",
        parishes: [
          {
            code: "90150",
            name: "Guayaquil",
            type: "urbana",
          },
          {
            code: "90152",
            name: "Juan Gómez Rendón",
            type: "rural",
          },
          {
            code: "90153",
            name: "Morro",
            type: "rural",
          },
          {
            code: "90156",
            name: "Posorja",
            type: "rural",
          },
          {
            code: "90157",
            name: "Puná",
            type: "rural",
          },
          {
            code: "90158",
            name: "Tenguel",
            type: "rural",
          },
        ],
      },
      {
        code: "902",
        name: "Alfredo Baquerizo Moreno (Juján)",
        parishes: [
          {
            code: "90250",
            name: "Alfredo Baquerizo Moreno (Juján)",
            type: "urbana",
          },
        ],
      },
      {
        code: "903",
        name: "Balao",
        parishes: [
          {
            code: "90350",
            name: "Balao",
            type: "urbana",
          },
        ],
      },
      {
        code: "904",
        name: "Balzar",
        parishes: [
          {
            code: "90450",
            name: "Balzar",
            type: "urbana",
          },
        ],
      },
      {
        code: "905",
        name: "Colimes",
        parishes: [
          {
            code: "90550",
            name: "Colimes",
            type: "urbana",
          },
          {
            code: "90551",
            name: "San Jacinto",
            type: "rural",
          },
        ],
      },
      {
        code: "906",
        name: "Daule",
        parishes: [
          {
            code: "90650",
            name: "Daule",
            type: "urbana",
          },
          {
            code: "90652",
            name: "Juan Bautista Aguirre",
            type: "rural",
          },
          {
            code: "90653",
            name: "Laurel",
            type: "rural",
          },
          {
            code: "90654",
            name: "Limonal",
            type: "rural",
          },
          {
            code: "90656",
            name: "Los Lojas",
            type: "rural",
          },
        ],
      },
      {
        code: "907",
        name: "Durán",
        parishes: [
          {
            code: "90750",
            name: "Eloy Alfaro",
            type: "urbana",
          },
        ],
      },
      {
        code: "908",
        name: "El Empalme",
        parishes: [
          {
            code: "90850",
            name: "Velasco Ibarra",
            type: "urbana",
          },
          {
            code: "90851",
            name: "Guayas",
            type: "rural",
          },
          {
            code: "90852",
            name: "El Rosario",
            type: "rural",
          },
        ],
      },
      {
        code: "909",
        name: "El Triunfo",
        parishes: [
          {
            code: "90950",
            name: "El Triunfo",
            type: "urbana",
          },
        ],
      },
      {
        code: "910",
        name: "Milagro",
        parishes: [
          {
            code: "91050",
            name: "Milagro",
            type: "urbana",
          },
          {
            code: "91051",
            name: "Chobo",
            type: "rural",
          },
          {
            code: "91053",
            name: "Mariscal Sucre",
            type: "rural",
          },
          {
            code: "91054",
            name: "Roberto Astudillo",
            type: "rural",
          },
        ],
      },
      {
        code: "911",
        name: "Naranjal",
        parishes: [
          {
            code: "91150",
            name: "Naranjal",
            type: "urbana",
          },
          {
            code: "91151",
            name: "Jesús María",
            type: "rural",
          },
          {
            code: "91152",
            name: "San Carlos",
            type: "rural",
          },
          {
            code: "91153",
            name: "Santa Rosa de Flandes",
            type: "rural",
          },
          {
            code: "91154",
            name: "Taura",
            type: "rural",
          },
        ],
      },
      {
        code: "912",
        name: "Naranjito",
        parishes: [
          {
            code: "91250",
            name: "Naranjito",
            type: "urbana",
          },
        ],
      },
      {
        code: "913",
        name: "Palestina",
        parishes: [
          {
            code: "91350",
            name: "Palestina",
            type: "urbana",
          },
        ],
      },
      {
        code: "914",
        name: "Pedro Carbo",
        parishes: [
          {
            code: "91450",
            name: "Pedro Carbo",
            type: "urbana",
          },
          {
            code: "91451",
            name: "Valle de La Virgen",
            type: "rural",
          },
          {
            code: "91452",
            name: "Sabanilla",
            type: "rural",
          },
        ],
      },
      {
        code: "916",
        name: "Samborondón",
        parishes: [
          {
            code: "91650",
            name: "Samborondón",
            type: "urbana",
          },
          {
            code: "91651",
            name: "Tarifa",
            type: "rural",
          },
        ],
      },
      {
        code: "918",
        name: "Santa Lucía",
        parishes: [
          {
            code: "91850",
            name: "Santa Lucía",
            type: "urbana",
          },
        ],
      },
      {
        code: "919",
        name: "Salitre",
        parishes: [
          {
            code: "91950",
            name: "El Salitre",
            type: "urbana",
          },
          {
            code: "91951",
            name: "General Vernaza",
            type: "rural",
          },
          {
            code: "91952",
            name: "La Victoria",
            type: "rural",
          },
          {
            code: "91953",
            name: "Junquillal",
            type: "rural",
          },
        ],
      },
      {
        code: "920",
        name: "San Jacinto de Yaguachi",
        parishes: [
          {
            code: "92050",
            name: "San Jacinto de Yaguachi",
            type: "urbana",
          },
          {
            code: "92053",
            name: "General Pedro J. Montero",
            type: "rural",
          },
          {
            code: "92055",
            name: "Yaguachi Viejo",
            type: "rural",
          },
          {
            code: "92056",
            name: "Virgen de Fátima",
            type: "rural",
          },
        ],
      },
      {
        code: "921",
        name: "Playas",
        parishes: [
          {
            code: "92150",
            name: "General Villamil",
            type: "urbana",
          },
        ],
      },
      {
        code: "922",
        name: "Simón Bolívar",
        parishes: [
          {
            code: "92250",
            name: "Simón Bolívar",
            type: "urbana",
          },
          {
            code: "92251",
            name: "Coronel Lorenzo de Garaycoa",
            type: "rural",
          },
        ],
      },
      {
        code: "923",
        name: "Coronel Marcelino Maridueña",
        parishes: [
          {
            code: "92350",
            name: "Coronel Marcelino Maridueña",
            type: "urbana",
          },
        ],
      },
      {
        code: "924",
        name: "Lomas de Sargentillo",
        parishes: [
          {
            code: "92450",
            name: "Lomas de Sargentillo",
            type: "urbana",
          },
        ],
      },
      {
        code: "925",
        name: "Nobol",
        parishes: [
          {
            code: "92550",
            name: "Narcisa de Jesús",
            type: "urbana",
          },
        ],
      },
      {
        code: "927",
        name: "General  Antonio Elizalde",
        parishes: [
          {
            code: "92750",
            name: "General Antonio Elizalde",
            type: "urbana",
          },
        ],
      },
      {
        code: "928",
        name: "Isidro Ayora",
        parishes: [
          {
            code: "92850",
            name: "Isidro Ayora",
            type: "urbana",
          },
        ],
      },
    ],
  },
  {
    code: "10",
    name: "Imbabura",
    cantons: [
      {
        code: "1001",
        name: "Ibarra",
        parishes: [
          {
            code: "100150",
            name: "San Miguel de Ibarra",
            type: "urbana",
          },
          {
            code: "100151",
            name: "Ambuquí",
            type: "rural",
          },
          {
            code: "100152",
            name: "Angochagua",
            type: "rural",
          },
          {
            code: "100153",
            name: "La Carolina",
            type: "rural",
          },
          {
            code: "100154",
            name: "La Esperanza",
            type: "rural",
          },
          {
            code: "100155",
            name: "Lita",
            type: "rural",
          },
          {
            code: "100156",
            name: "Salinas",
            type: "rural",
          },
          {
            code: "100157",
            name: "San Antonio",
            type: "rural",
          },
        ],
      },
      {
        code: "1002",
        name: "Antonio Ante",
        parishes: [
          {
            code: "100250",
            name: "Atuntaqui",
            type: "urbana",
          },
          {
            code: "100251",
            name: "Imbaya",
            type: "rural",
          },
          {
            code: "100252",
            name: "San Francisco de Natabuela",
            type: "rural",
          },
          {
            code: "100253",
            name: "San José de Chaltura",
            type: "rural",
          },
          {
            code: "100254",
            name: "San Roque",
            type: "rural",
          },
        ],
      },
      {
        code: "1003",
        name: "Cotacachi",
        parishes: [
          {
            code: "100350",
            name: "Cotacachi",
            type: "urbana",
          },
          {
            code: "100351",
            name: "Apuela",
            type: "rural",
          },
          {
            code: "100352",
            name: "García Moreno",
            type: "rural",
          },
          {
            code: "100353",
            name: "Imantag",
            type: "rural",
          },
          {
            code: "100354",
            name: "Peñaherrera",
            type: "rural",
          },
          {
            code: "100355",
            name: "Plaza Gutiérrez",
            type: "rural",
          },
          {
            code: "100356",
            name: "Quiroga",
            type: "rural",
          },
          {
            code: "100357",
            name: "Seis de Julio de Cuellaje",
            type: "rural",
          },
          {
            code: "100358",
            name: "Vacas Galindo",
            type: "rural",
          },
        ],
      },
      {
        code: "1004",
        name: "Otavalo",
        parishes: [
          {
            code: "100450",
            name: "Otavalo",
            type: "urbana",
          },
          {
            code: "100451",
            name: "Dr. Miguel Egas Cabezas",
            type: "rural",
          },
          {
            code: "100452",
            name: "Eugenio Espejo",
            type: "rural",
          },
          {
            code: "100453",
            name: "González Suárez",
            type: "rural",
          },
          {
            code: "100454",
            name: "Pataquí",
            type: "rural",
          },
          {
            code: "100455",
            name: "San José de Quichinche",
            type: "rural",
          },
          {
            code: "100456",
            name: "San Juan de Ilumán",
            type: "rural",
          },
          {
            code: "100457",
            name: "San Pablo",
            type: "rural",
          },
          {
            code: "100458",
            name: "San Rafael",
            type: "rural",
          },
          {
            code: "100459",
            name: "Selva Alegre",
            type: "rural",
          },
        ],
      },
      {
        code: "1005",
        name: "Pimampiro",
        parishes: [
          {
            code: "100550",
            name: "Pimampiro",
            type: "urbana",
          },
          {
            code: "100551",
            name: "Chugá",
            type: "rural",
          },
          {
            code: "100552",
            name: "Mariano Acosta",
            type: "rural",
          },
          {
            code: "100553",
            name: "San Francisco de Sigsipamba",
            type: "rural",
          },
        ],
      },
      {
        code: "1006",
        name: "San Miguel de Urcuquí",
        parishes: [
          {
            code: "100650",
            name: "Urcuquí",
            type: "urbana",
          },
          {
            code: "100651",
            name: "Cahuasquí",
            type: "rural",
          },
          {
            code: "100652",
            name: "La Merced de Buenos Aires",
            type: "rural",
          },
          {
            code: "100653",
            name: "Pablo Arenas",
            type: "rural",
          },
          {
            code: "100654",
            name: "San Blas",
            type: "rural",
          },
          {
            code: "100655",
            name: "Tumbabiro",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "11",
    name: "Loja",
    cantons: [
      {
        code: "1101",
        name: "Loja",
        parishes: [
          {
            code: "110150",
            name: "Loja",
            type: "urbana",
          },
          {
            code: "110151",
            name: "Chantaco",
            type: "rural",
          },
          {
            code: "110152",
            name: "Chuquiribamba",
            type: "rural",
          },
          {
            code: "110153",
            name: "El Cisne",
            type: "rural",
          },
          {
            code: "110154",
            name: "Gualel",
            type: "rural",
          },
          {
            code: "110155",
            name: "Jimbilla",
            type: "rural",
          },
          {
            code: "110156",
            name: "Malacatos",
            type: "rural",
          },
          {
            code: "110157",
            name: "San Lucas",
            type: "rural",
          },
          {
            code: "110158",
            name: "San Pedro de Vilcabamba",
            type: "rural",
          },
          {
            code: "110159",
            name: "Santiago",
            type: "rural",
          },
          {
            code: "110160",
            name: "Taquil",
            type: "rural",
          },
          {
            code: "110161",
            name: "Vilcabamba",
            type: "rural",
          },
          {
            code: "110162",
            name: "Yangana",
            type: "rural",
          },
          {
            code: "110163",
            name: "Quinara",
            type: "rural",
          },
        ],
      },
      {
        code: "1102",
        name: "Calvas",
        parishes: [
          {
            code: "110250",
            name: "Cariamanga",
            type: "urbana",
          },
          {
            code: "110251",
            name: "Colaisaca",
            type: "rural",
          },
          {
            code: "110252",
            name: "El Lucero",
            type: "rural",
          },
          {
            code: "110253",
            name: "Utuana",
            type: "rural",
          },
          {
            code: "110254",
            name: "Sanguillín",
            type: "rural",
          },
        ],
      },
      {
        code: "1103",
        name: "Catamayo",
        parishes: [
          {
            code: "110350",
            name: "Catamayo",
            type: "urbana",
          },
          {
            code: "110351",
            name: "El Tambo",
            type: "rural",
          },
          {
            code: "110352",
            name: "Guayquichuma",
            type: "rural",
          },
          {
            code: "110353",
            name: "San Pedro de La Bendita",
            type: "rural",
          },
          {
            code: "110354",
            name: "Zambi",
            type: "rural",
          },
        ],
      },
      {
        code: "1104",
        name: "Celica",
        parishes: [
          {
            code: "110450",
            name: "Celica",
            type: "urbana",
          },
          {
            code: "110451",
            name: "Cruzpamba",
            type: "rural",
          },
          {
            code: "110455",
            name: "Pózul",
            type: "rural",
          },
          {
            code: "110456",
            name: "Sabanilla",
            type: "rural",
          },
          {
            code: "110457",
            name: "Teniente Maximiliano Rodríguez Loaiza",
            type: "rural",
          },
        ],
      },
      {
        code: "1105",
        name: "Chaguarpamba",
        parishes: [
          {
            code: "110550",
            name: "Chaguarpamba",
            type: "urbana",
          },
          {
            code: "110551",
            name: "Buenavista",
            type: "rural",
          },
          {
            code: "110552",
            name: "El Rosario",
            type: "rural",
          },
          {
            code: "110553",
            name: "Santa Rufina",
            type: "rural",
          },
          {
            code: "110554",
            name: "Amarillos",
            type: "rural",
          },
        ],
      },
      {
        code: "1106",
        name: "Espíndola",
        parishes: [
          {
            code: "110650",
            name: "Amaluza",
            type: "urbana",
          },
          {
            code: "110651",
            name: "Bellavista",
            type: "rural",
          },
          {
            code: "110652",
            name: "Jimbura",
            type: "rural",
          },
          {
            code: "110653",
            name: "Santa Teresita",
            type: "rural",
          },
          {
            code: "110654",
            name: "27 de Abril",
            type: "rural",
          },
          {
            code: "110655",
            name: "El Ingenio",
            type: "rural",
          },
          {
            code: "110656",
            name: "El Airo",
            type: "rural",
          },
        ],
      },
      {
        code: "1107",
        name: "Gonzanamá",
        parishes: [
          {
            code: "110750",
            name: "Gonzanamá",
            type: "urbana",
          },
          {
            code: "110751",
            name: "Changaimina",
            type: "rural",
          },
          {
            code: "110753",
            name: "Nambacola",
            type: "rural",
          },
          {
            code: "110754",
            name: "Purunuma",
            type: "rural",
          },
          {
            code: "110756",
            name: "Sacapalca",
            type: "rural",
          },
        ],
      },
      {
        code: "1108",
        name: "Macará",
        parishes: [
          {
            code: "110850",
            name: "Macará",
            type: "urbana",
          },
          {
            code: "110851",
            name: "Larama",
            type: "rural",
          },
          {
            code: "110852",
            name: "La Victoria",
            type: "rural",
          },
          {
            code: "110853",
            name: "Sabiango",
            type: "rural",
          },
        ],
      },
      {
        code: "1109",
        name: "Paltas",
        parishes: [
          {
            code: "110950",
            name: "Catacocha",
            type: "urbana",
          },
          {
            code: "110951",
            name: "Cangonamá",
            type: "rural",
          },
          {
            code: "110952",
            name: "Guachanamá",
            type: "rural",
          },
          {
            code: "110954",
            name: "Lauro Guerrero",
            type: "rural",
          },
          {
            code: "110956",
            name: "Orianga",
            type: "rural",
          },
          {
            code: "110957",
            name: "San Antonio",
            type: "rural",
          },
          {
            code: "110958",
            name: "Casanga",
            type: "rural",
          },
          {
            code: "110959",
            name: "Yamana",
            type: "rural",
          },
        ],
      },
      {
        code: "1110",
        name: "Puyango",
        parishes: [
          {
            code: "111050",
            name: "Alamor",
            type: "urbana",
          },
          {
            code: "111051",
            name: "Ciano",
            type: "rural",
          },
          {
            code: "111052",
            name: "El Arenal",
            type: "rural",
          },
          {
            code: "111053",
            name: "El Limo",
            type: "rural",
          },
          {
            code: "111054",
            name: "Mercadillo",
            type: "rural",
          },
          {
            code: "111055",
            name: "Vicentino",
            type: "rural",
          },
        ],
      },
      {
        code: "1111",
        name: "Saraguro",
        parishes: [
          {
            code: "111150",
            name: "Saraguro",
            type: "urbana",
          },
          {
            code: "111151",
            name: "El Paraíso de Celen",
            type: "rural",
          },
          {
            code: "111152",
            name: "El Tablón",
            type: "rural",
          },
          {
            code: "111153",
            name: "Lluzhapa",
            type: "rural",
          },
          {
            code: "111154",
            name: "Manú",
            type: "rural",
          },
          {
            code: "111155",
            name: "San Antonio de Qumbe",
            type: "rural",
          },
          {
            code: "111156",
            name: "San Pablo de Tenta",
            type: "rural",
          },
          {
            code: "111157",
            name: "San Sebastián de Yúluc",
            type: "rural",
          },
          {
            code: "111158",
            name: "Selva Alegre",
            type: "rural",
          },
          {
            code: "111159",
            name: "Urdaneta",
            type: "rural",
          },
          {
            code: "111160",
            name: "Sumaypamba",
            type: "rural",
          },
        ],
      },
      {
        code: "1112",
        name: "Sozoranga",
        parishes: [
          {
            code: "111250",
            name: "Sozoranga",
            type: "urbana",
          },
          {
            code: "111251",
            name: "Nueva Fátima",
            type: "rural",
          },
          {
            code: "111252",
            name: "Tacamoros",
            type: "rural",
          },
        ],
      },
      {
        code: "1113",
        name: "Zapotillo",
        parishes: [
          {
            code: "111350",
            name: "Zapotillo",
            type: "urbana",
          },
          {
            code: "111351",
            name: "Mangahurco",
            type: "rural",
          },
          {
            code: "111352",
            name: "Garzareal",
            type: "rural",
          },
          {
            code: "111353",
            name: "Limones",
            type: "rural",
          },
          {
            code: "111354",
            name: "Paletillas",
            type: "rural",
          },
          {
            code: "111355",
            name: "Bolaspamba",
            type: "rural",
          },
          {
            code: "111356",
            name: "Cazaderos",
            type: "rural",
          },
        ],
      },
      {
        code: "1114",
        name: "Pindal",
        parishes: [
          {
            code: "111450",
            name: "Pindal",
            type: "urbana",
          },
          {
            code: "111451",
            name: "Chaquinal",
            type: "rural",
          },
          {
            code: "111452",
            name: "12 de Diciembre",
            type: "rural",
          },
          {
            code: "111453",
            name: "Milagros",
            type: "rural",
          },
        ],
      },
      {
        code: "1115",
        name: "Quilanga",
        parishes: [
          {
            code: "111550",
            name: "Quilanga",
            type: "urbana",
          },
          {
            code: "111551",
            name: "Fundochamba",
            type: "rural",
          },
          {
            code: "111552",
            name: "San Antonio de las Aradas",
            type: "rural",
          },
        ],
      },
      {
        code: "1116",
        name: "Olmedo",
        parishes: [
          {
            code: "111650",
            name: "Olmedo",
            type: "urbana",
          },
          {
            code: "111651",
            name: "La Tingue",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "12",
    name: "Los Ríos",
    cantons: [
      {
        code: "1201",
        name: "Babahoyo",
        parishes: [
          {
            code: "120150",
            name: "Babahoyo",
            type: "urbana",
          },
          {
            code: "120152",
            name: "Caracol",
            type: "rural",
          },
          {
            code: "120153",
            name: "Febres Cordero",
            type: "rural",
          },
          {
            code: "120154",
            name: "Pimocha",
            type: "rural",
          },
          {
            code: "120155",
            name: "La Unión",
            type: "rural",
          },
        ],
      },
      {
        code: "1202",
        name: "Baba",
        parishes: [
          {
            code: "120250",
            name: "Baba",
            type: "urbana",
          },
          {
            code: "120251",
            name: "Guare",
            type: "rural",
          },
          {
            code: "120252",
            name: "Isla de Bejucal",
            type: "rural",
          },
        ],
      },
      {
        code: "1203",
        name: "Montalvo",
        parishes: [
          {
            code: "120350",
            name: "Montalvo",
            type: "urbana",
          },
          {
            code: "120351",
            name: "La Esmeralda",
            type: "rural",
          },
        ],
      },
      {
        code: "1204",
        name: "Puebloviejo",
        parishes: [
          {
            code: "120450",
            name: "Puebloviejo",
            type: "urbana",
          },
          {
            code: "120451",
            name: "Puerto Pechiche",
            type: "rural",
          },
          {
            code: "120452",
            name: "San Juan",
            type: "rural",
          },
        ],
      },
      {
        code: "1205",
        name: "Quevedo",
        parishes: [
          {
            code: "120550",
            name: "Quevedo",
            type: "urbana",
          },
          {
            code: "120553",
            name: "San Carlos",
            type: "rural",
          },
          {
            code: "120555",
            name: "La Esperanza",
            type: "rural",
          },
        ],
      },
      {
        code: "1206",
        name: "Urdaneta",
        parishes: [
          {
            code: "120650",
            name: "Catarama",
            type: "urbana",
          },
          {
            code: "120651",
            name: "Ricaurte",
            type: "rural",
          },
        ],
      },
      {
        code: "1207",
        name: "Ventanas",
        parishes: [
          {
            code: "120750",
            name: "Ventanas",
            type: "urbana",
          },
          {
            code: "120752",
            name: "Zapotal",
            type: "rural",
          },
          {
            code: "120753",
            name: "Chacarita",
            type: "rural",
          },
          {
            code: "120754",
            name: "Los Ángeles",
            type: "rural",
          },
        ],
      },
      {
        code: "1208",
        name: "Vinces",
        parishes: [
          {
            code: "120850",
            name: "Vinces",
            type: "urbana",
          },
          {
            code: "120851",
            name: "Antonio Sotomayor",
            type: "rural",
          },
        ],
      },
      {
        code: "1209",
        name: "Palenque",
        parishes: [
          {
            code: "120950",
            name: "Palenque",
            type: "urbana",
          },
        ],
      },
      {
        code: "1210",
        name: "Buena Fe",
        parishes: [
          {
            code: "121050",
            name: "San Jacinto de Buena Fe",
            type: "urbana",
          },
          {
            code: "121051",
            name: "Patricia Pilar",
            type: "rural",
          },
        ],
      },
      {
        code: "1211",
        name: "Valencia",
        parishes: [
          {
            code: "121150",
            name: "Valencia",
            type: "urbana",
          },
        ],
      },
      {
        code: "1212",
        name: "Mocache",
        parishes: [
          {
            code: "121250",
            name: "Mocache",
            type: "urbana",
          },
        ],
      },
      {
        code: "1213",
        name: "Quinsaloma",
        parishes: [
          {
            code: "121350",
            name: "Quinsaloma",
            type: "urbana",
          },
        ],
      },
    ],
  },
  {
    code: "13",
    name: "Manabí",
    cantons: [
      {
        code: "1301",
        name: "Portoviejo",
        parishes: [
          {
            code: "130150",
            name: "Portoviejo",
            type: "urbana",
          },
          {
            code: "130151",
            name: "Abdón Calderón",
            type: "rural",
          },
          {
            code: "130152",
            name: "Alhajuela",
            type: "rural",
          },
          {
            code: "130153",
            name: "Crucita",
            type: "rural",
          },
          {
            code: "130154",
            name: "Pueblo Nuevo",
            type: "rural",
          },
          {
            code: "130155",
            name: "Riochico",
            type: "rural",
          },
          {
            code: "130156",
            name: "San Plácido",
            type: "rural",
          },
          {
            code: "130157",
            name: "Chirijos",
            type: "rural",
          },
        ],
      },
      {
        code: "1302",
        name: "Bolívar",
        parishes: [
          {
            code: "130250",
            name: "Calceta",
            type: "urbana",
          },
          {
            code: "130251",
            name: "Membrillo",
            type: "rural",
          },
          {
            code: "130252",
            name: "Quiroga",
            type: "rural",
          },
        ],
      },
      {
        code: "1303",
        name: "Chone",
        parishes: [
          {
            code: "130350",
            name: "Chone",
            type: "urbana",
          },
          {
            code: "130351",
            name: "Boyacá",
            type: "rural",
          },
          {
            code: "130352",
            name: "Canuto",
            type: "rural",
          },
          {
            code: "130353",
            name: "Convento",
            type: "rural",
          },
          {
            code: "130354",
            name: "Chibunga",
            type: "rural",
          },
          {
            code: "130355",
            name: "Eloy Alfaro",
            type: "rural",
          },
          {
            code: "130356",
            name: "Ricaurte",
            type: "rural",
          },
          {
            code: "130357",
            name: "San Antonio",
            type: "rural",
          },
        ],
      },
      {
        code: "1304",
        name: "El Carmen",
        parishes: [
          {
            code: "130450",
            name: "El Carmen",
            type: "urbana",
          },
          {
            code: "130451",
            name: "Wilfrido Loor Moreira",
            type: "rural",
          },
          {
            code: "130452",
            name: "San Pedro de Suma",
            type: "rural",
          },
          {
            code: "130453",
            name: "Santa María",
            type: "rural",
          },
          {
            code: "130454",
            name: "El Paraíso La 14",
            type: "rural",
          },
        ],
      },
      {
        code: "1305",
        name: "Flavio Alfaro",
        parishes: [
          {
            code: "130550",
            name: "Flavio Alfaro",
            type: "urbana",
          },
          {
            code: "130551",
            name: "San Francisco de Novillo",
            type: "rural",
          },
          {
            code: "130552",
            name: "Zapallo",
            type: "rural",
          },
        ],
      },
      {
        code: "1306",
        name: "Jipijapa",
        parishes: [
          {
            code: "130650",
            name: "Jipijapa",
            type: "urbana",
          },
          {
            code: "130651",
            name: "América",
            type: "rural",
          },
          {
            code: "130652",
            name: "El Anegado",
            type: "rural",
          },
          {
            code: "130653",
            name: "Julcuy",
            type: "rural",
          },
          {
            code: "130654",
            name: "La Unión",
            type: "rural",
          },
          {
            code: "130656",
            name: "Membrillal",
            type: "rural",
          },
          {
            code: "130657",
            name: "Pedro Pablo Gómez",
            type: "rural",
          },
          {
            code: "130658",
            name: "Puerto Cayo",
            type: "rural",
          },
        ],
      },
      {
        code: "1307",
        name: "Junín",
        parishes: [
          {
            code: "130750",
            name: "Junín",
            type: "urbana",
          },
        ],
      },
      {
        code: "1308",
        name: "Manta",
        parishes: [
          {
            code: "130850",
            name: "Manta",
            type: "urbana",
          },
          {
            code: "130851",
            name: "San Lorenzo",
            type: "rural",
          },
          {
            code: "130852",
            name: "Santa Marianita",
            type: "rural",
          },
        ],
      },
      {
        code: "1309",
        name: "Montecristi",
        parishes: [
          {
            code: "130950",
            name: "Montecristi",
            type: "urbana",
          },
          {
            code: "130952",
            name: "La Pila",
            type: "rural",
          },
        ],
      },
      {
        code: "1310",
        name: "Paján",
        parishes: [
          {
            code: "131050",
            name: "Paján",
            type: "urbana",
          },
          {
            code: "131051",
            name: "Campozano",
            type: "rural",
          },
          {
            code: "131052",
            name: "Cascol",
            type: "rural",
          },
          {
            code: "131053",
            name: "Guale",
            type: "rural",
          },
          {
            code: "131054",
            name: "Lascano",
            type: "rural",
          },
        ],
      },
      {
        code: "1311",
        name: "Pichincha",
        parishes: [
          {
            code: "131150",
            name: "Pichincha",
            type: "urbana",
          },
          {
            code: "131151",
            name: "Barraganete",
            type: "rural",
          },
          {
            code: "131152",
            name: "San Sebastián",
            type: "rural",
          },
        ],
      },
      {
        code: "1312",
        name: "Rocafuerte",
        parishes: [
          {
            code: "131250",
            name: "Rocafuerte",
            type: "urbana",
          },
          {
            code: "131251",
            name: "Sosote",
            type: "rural",
          },
        ],
      },
      {
        code: "1313",
        name: "Santa Ana",
        parishes: [
          {
            code: "131350",
            name: "Santa Ana de Vuelta Larga",
            type: "urbana",
          },
          {
            code: "131351",
            name: "Ayacucho",
            type: "rural",
          },
          {
            code: "131352",
            name: "Honorato Vásquez",
            type: "rural",
          },
          {
            code: "131353",
            name: "La Unión",
            type: "rural",
          },
          {
            code: "131355",
            name: "San Pablo",
            type: "rural",
          },
        ],
      },
      {
        code: "1314",
        name: "Sucre",
        parishes: [
          {
            code: "131450",
            name: "Bahia de Caráquez",
            type: "urbana",
          },
          {
            code: "131453",
            name: "Charapotó",
            type: "rural",
          },
          {
            code: "131457",
            name: "San Isidro",
            type: "rural",
          },
        ],
      },
      {
        code: "1315",
        name: "Tosagua",
        parishes: [
          {
            code: "131550",
            name: "Tosagua",
            type: "urbana",
          },
          {
            code: "131551",
            name: "Bachillero",
            type: "rural",
          },
          {
            code: "131552",
            name: "Ángel Pedro Giler",
            type: "rural",
          },
        ],
      },
      {
        code: "1316",
        name: "24 de Mayo",
        parishes: [
          {
            code: "131650",
            name: "Sucre",
            type: "urbana",
          },
          {
            code: "131651",
            name: "Bellavista",
            type: "rural",
          },
          {
            code: "131652",
            name: "Noboa",
            type: "rural",
          },
          {
            code: "131653",
            name: "Arquitecto Sixto Durán Ballén",
            type: "rural",
          },
        ],
      },
      {
        code: "1317",
        name: "Pedernales",
        parishes: [
          {
            code: "131750",
            name: "Pedernales",
            type: "urbana",
          },
          {
            code: "131751",
            name: "Cojimíes",
            type: "rural",
          },
          {
            code: "131752",
            name: "Diez de Agosto",
            type: "rural",
          },
          {
            code: "131753",
            name: "Atahualpa",
            type: "rural",
          },
        ],
      },
      {
        code: "1318",
        name: "Olmedo",
        parishes: [
          {
            code: "131850",
            name: "Olmedo",
            type: "urbana",
          },
        ],
      },
      {
        code: "1319",
        name: "Puerto López",
        parishes: [
          {
            code: "131950",
            name: "Puerto López",
            type: "urbana",
          },
          {
            code: "131951",
            name: "Machalilla",
            type: "rural",
          },
          {
            code: "131952",
            name: "Salango",
            type: "rural",
          },
        ],
      },
      {
        code: "1320",
        name: "Jama",
        parishes: [
          {
            code: "132050",
            name: "Jama",
            type: "urbana",
          },
        ],
      },
      {
        code: "1321",
        name: "Jaramijó",
        parishes: [
          {
            code: "132150",
            name: "Jaramijó",
            type: "urbana",
          },
        ],
      },
      {
        code: "1322",
        name: "San Vicente",
        parishes: [
          {
            code: "132250",
            name: "San Vicente",
            type: "urbana",
          },
          {
            code: "132251",
            name: "Canoa",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "14",
    name: "Morona Santiago",
    cantons: [
      {
        code: "1401",
        name: "Morona",
        parishes: [
          {
            code: "140150",
            name: "Macas",
            type: "urbana",
          },
          {
            code: "140151",
            name: "Alshi",
            type: "rural",
          },
          {
            code: "140153",
            name: "General Proaño",
            type: "rural",
          },
          {
            code: "140156",
            name: "San Isidro",
            type: "rural",
          },
          {
            code: "140158",
            name: "Sinaí",
            type: "rural",
          },
          {
            code: "140160",
            name: "Zuña",
            type: "rural",
          },
          {
            code: "140162",
            name: "Cuchaentza",
            type: "rural",
          },
          {
            code: "140164",
            name: "Río Blanco",
            type: "rural",
          },
        ],
      },
      {
        code: "1402",
        name: "Gualaquiza",
        parishes: [
          {
            code: "140250",
            name: "Gualaquiza",
            type: "urbana",
          },
          {
            code: "140251",
            name: "Amazonas",
            type: "rural",
          },
          {
            code: "140252",
            name: "Bermejos",
            type: "rural",
          },
          {
            code: "140253",
            name: "Bomboíza",
            type: "rural",
          },
          {
            code: "140254",
            name: "Chigüinda",
            type: "rural",
          },
          {
            code: "140255",
            name: "El Rosario",
            type: "rural",
          },
          {
            code: "140256",
            name: "Nueva Tarqui",
            type: "rural",
          },
          {
            code: "140257",
            name: "San Miguel de Cuyes",
            type: "rural",
          },
          {
            code: "140258",
            name: "El Ideal",
            type: "rural",
          },
        ],
      },
      {
        code: "1403",
        name: "Limón Indanza",
        parishes: [
          {
            code: "140350",
            name: "Gral. Leonidas Plaza Gutiérrez",
            type: "urbana",
          },
          {
            code: "140351",
            name: "Indanza",
            type: "rural",
          },
          {
            code: "140353",
            name: "San Antonio",
            type: "rural",
          },
          {
            code: "140356",
            name: "San Miguel de Conchay",
            type: "rural",
          },
          {
            code: "140357",
            name: "Santa Susana de Chiviaza",
            type: "rural",
          },
          {
            code: "140358",
            name: "Yunganza",
            type: "rural",
          },
        ],
      },
      {
        code: "1404",
        name: "Palora",
        parishes: [
          {
            code: "140450",
            name: "Palora",
            type: "urbana",
          },
          {
            code: "140451",
            name: "Arapicos",
            type: "rural",
          },
          {
            code: "140452",
            name: "Cumandá",
            type: "rural",
          },
          {
            code: "140454",
            name: "Sangay",
            type: "rural",
          },
          {
            code: "140455",
            name: "16 de Agosto",
            type: "rural",
          },
        ],
      },
      {
        code: "1405",
        name: "Santiago",
        parishes: [
          {
            code: "140550",
            name: "Santiago de Méndez",
            type: "urbana",
          },
          {
            code: "140551",
            name: "Copal",
            type: "rural",
          },
          {
            code: "140552",
            name: "Chupianza",
            type: "rural",
          },
          {
            code: "140553",
            name: "Patuca",
            type: "rural",
          },
          {
            code: "140554",
            name: "San Luis de El Acho",
            type: "rural",
          },
          {
            code: "140556",
            name: "Tayuza",
            type: "rural",
          },
          {
            code: "140557",
            name: "San Francisco de Chinimbimi",
            type: "rural",
          },
        ],
      },
      {
        code: "1406",
        name: "Sucúa",
        parishes: [
          {
            code: "140650",
            name: "Sucúa",
            type: "urbana",
          },
          {
            code: "140651",
            name: "Asunción",
            type: "rural",
          },
          {
            code: "140652",
            name: "Huambi",
            type: "rural",
          },
          {
            code: "140655",
            name: "Santa Marianita de Jesús",
            type: "rural",
          },
        ],
      },
      {
        code: "1407",
        name: "Huamboya",
        parishes: [
          {
            code: "140750",
            name: "Huamboya",
            type: "urbana",
          },
          {
            code: "140751",
            name: "Chiguaza",
            type: "rural",
          },
        ],
      },
      {
        code: "1408",
        name: "San Juan Bosco",
        parishes: [
          {
            code: "140850",
            name: "San Juan Bosco",
            type: "urbana",
          },
          {
            code: "140851",
            name: "Pan de Azúcar",
            type: "rural",
          },
          {
            code: "140852",
            name: "San Carlos de Limón",
            type: "rural",
          },
          {
            code: "140853",
            name: "San Jacinto de Wakambeis",
            type: "rural",
          },
          {
            code: "140854",
            name: "Santiago de Pananza",
            type: "rural",
          },
        ],
      },
      {
        code: "1409",
        name: "Taisha",
        parishes: [
          {
            code: "140950",
            name: "Taisha",
            type: "urbana",
          },
          {
            code: "140951",
            name: "Huasaga",
            type: "rural",
          },
          {
            code: "140952",
            name: "Macuma",
            type: "rural",
          },
          {
            code: "140953",
            name: "Tuutinentsa",
            type: "rural",
          },
          {
            code: "140954",
            name: "Pumpuentsa",
            type: "rural",
          },
        ],
      },
      {
        code: "1410",
        name: "Logroño",
        parishes: [
          {
            code: "141050",
            name: "Logroño",
            type: "urbana",
          },
          {
            code: "141051",
            name: "Yaupi",
            type: "rural",
          },
          {
            code: "141052",
            name: "Shimpis",
            type: "rural",
          },
        ],
      },
      {
        code: "1411",
        name: "Pablo Sexto",
        parishes: [
          {
            code: "141150",
            name: "Pablo Sexto",
            type: "urbana",
          },
        ],
      },
      {
        code: "1412",
        name: "Tiwintza",
        parishes: [
          {
            code: "141250",
            name: "Santiago",
            type: "urbana",
          },
          {
            code: "141251",
            name: "San José de Morona",
            type: "rural",
          },
        ],
      },
      {
        code: "1413",
        name: "Sevilla Don Bosco",
        parishes: [
          {
            code: "141350",
            name: "Sevilla Don Bosco",
            type: "urbana",
          },
        ],
      },
    ],
  },
  {
    code: "15",
    name: "Napo",
    cantons: [
      {
        code: "1501",
        name: "Tena",
        parishes: [
          {
            code: "150150",
            name: "Tena",
            type: "urbana",
          },
          {
            code: "150151",
            name: "Ahuano",
            type: "rural",
          },
          {
            code: "150153",
            name: "Chontapunta",
            type: "rural",
          },
          {
            code: "150154",
            name: "Pano",
            type: "rural",
          },
          {
            code: "150155",
            name: "Puerto Misahuallí",
            type: "rural",
          },
          {
            code: "150156",
            name: "Puerto Napo",
            type: "rural",
          },
          {
            code: "150157",
            name: "Tálag",
            type: "rural",
          },
          {
            code: "150158",
            name: "San Juan de Muyuna",
            type: "rural",
          },
        ],
      },
      {
        code: "1503",
        name: "Archidona",
        parishes: [
          {
            code: "150350",
            name: "Archidona",
            type: "urbana",
          },
          {
            code: "150352",
            name: "Cotundo",
            type: "rural",
          },
          {
            code: "150354",
            name: "San Pablo de Ushpayacu",
            type: "rural",
          },
          {
            code: "150356",
            name: "Hatun Sumaku",
            type: "rural",
          },
        ],
      },
      {
        code: "1504",
        name: "El Chaco",
        parishes: [
          {
            code: "150450",
            name: "El Chaco",
            type: "urbana",
          },
          {
            code: "150451",
            name: "Gonzalo Díaz de Pineda",
            type: "rural",
          },
          {
            code: "150452",
            name: "Linares",
            type: "rural",
          },
          {
            code: "150453",
            name: "Oyacachi",
            type: "rural",
          },
          {
            code: "150454",
            name: "Santa Rosa",
            type: "rural",
          },
          {
            code: "150455",
            name: "Sardinas",
            type: "rural",
          },
        ],
      },
      {
        code: "1507",
        name: "Quijos",
        parishes: [
          {
            code: "150750",
            name: "Baeza",
            type: "urbana",
          },
          {
            code: "150751",
            name: "Cosanga",
            type: "rural",
          },
          {
            code: "150752",
            name: "Cuyuja",
            type: "rural",
          },
          {
            code: "150753",
            name: "Papallacta",
            type: "rural",
          },
          {
            code: "150754",
            name: "San Francisco de Borja",
            type: "rural",
          },
          {
            code: "150756",
            name: "Sumaco",
            type: "rural",
          },
        ],
      },
      {
        code: "1509",
        name: "Carlos Julio Arosemena Tola",
        parishes: [
          {
            code: "150950",
            name: "Carlos Julio Arosemena Tola",
            type: "urbana",
          },
        ],
      },
    ],
  },
  {
    code: "16",
    name: "Pastaza",
    cantons: [
      {
        code: "1601",
        name: "Pastaza",
        parishes: [
          {
            code: "160150",
            name: "Puyo",
            type: "urbana",
          },
          {
            code: "160152",
            name: "Canelos",
            type: "rural",
          },
          {
            code: "160154",
            name: "Diez de Agosto",
            type: "rural",
          },
          {
            code: "160155",
            name: "Fátima",
            type: "rural",
          },
          {
            code: "160156",
            name: "Montalvo",
            type: "rural",
          },
          {
            code: "160157",
            name: "Pomona",
            type: "rural",
          },
          {
            code: "160158",
            name: "Río Corrientes",
            type: "rural",
          },
          {
            code: "160159",
            name: "Río Tigre",
            type: "rural",
          },
          {
            code: "160161",
            name: "Sarayacu",
            type: "rural",
          },
          {
            code: "160162",
            name: "Simón Bolívar",
            type: "rural",
          },
          {
            code: "160163",
            name: "Tarqui",
            type: "rural",
          },
          {
            code: "160164",
            name: "Teniente Hugo Ortiz",
            type: "rural",
          },
          {
            code: "160165",
            name: "Veracruz",
            type: "rural",
          },
          {
            code: "160166",
            name: "El Triunfo",
            type: "rural",
          },
          {
            code: "160167",
            name: "Shuar Pastaza",
            type: "rural",
          },
        ],
      },
      {
        code: "1602",
        name: "Mera",
        parishes: [
          {
            code: "160250",
            name: "Mera",
            type: "urbana",
          },
          {
            code: "160251",
            name: "Madre Tierra",
            type: "rural",
          },
          {
            code: "160252",
            name: "Shell",
            type: "rural",
          },
        ],
      },
      {
        code: "1603",
        name: "Santa Clara",
        parishes: [
          {
            code: "160350",
            name: "Santa Clara",
            type: "urbana",
          },
          {
            code: "160351",
            name: "San José",
            type: "rural",
          },
        ],
      },
      {
        code: "1604",
        name: "Arajuno",
        parishes: [
          {
            code: "160450",
            name: "Arajuno",
            type: "urbana",
          },
          {
            code: "160451",
            name: "Curaray",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "17",
    name: "Pichincha",
    cantons: [
      {
        code: "1701",
        name: "Distrito Metropolitano de Quito",
        parishes: [
          {
            code: "170102",
            name: "Carcelén",
            type: "urbana",
          },
          {
            code: "170103",
            name: "Centro Histórico",
            type: "urbana",
          },
          {
            code: "170104",
            name: "Cochapamba",
            type: "urbana",
          },
          {
            code: "170105",
            name: "Comité del Pueblo",
            type: "urbana",
          },
          {
            code: "170106",
            name: "Cotocollao",
            type: "urbana",
          },
          {
            code: "170107",
            name: "Chilibulo",
            type: "urbana",
          },
          {
            code: "170108",
            name: "Chillogallo",
            type: "urbana",
          },
          {
            code: "170109",
            name: "Chimbacalle",
            type: "urbana",
          },
          {
            code: "170110",
            name: "El Condado",
            type: "urbana",
          },
          {
            code: "170111",
            name: "Guamaní",
            type: "urbana",
          },
          {
            code: "170112",
            name: "Iñaquito",
            type: "urbana",
          },
          {
            code: "170113",
            name: "Itchimbía",
            type: "urbana",
          },
          {
            code: "170114",
            name: "Jipijapa",
            type: "urbana",
          },
          {
            code: "170115",
            name: "Kennedy",
            type: "urbana",
          },
          {
            code: "170116",
            name: "La Argelia",
            type: "urbana",
          },
          {
            code: "170117",
            name: "La Concepción",
            type: "urbana",
          },
          {
            code: "170118",
            name: "La Ecuatoriana",
            type: "urbana",
          },
          {
            code: "170119",
            name: "La Ferroviaria",
            type: "urbana",
          },
          {
            code: "170120",
            name: "La Libertad",
            type: "urbana",
          },
          {
            code: "170121",
            name: "La Magdalena",
            type: "urbana",
          },
          {
            code: "170122",
            name: "La Mena",
            type: "urbana",
          },
          {
            code: "170123",
            name: "Mariscal Sucre",
            type: "urbana",
          },
          {
            code: "170124",
            name: "Ponceano",
            type: "urbana",
          },
          {
            code: "170125",
            name: "Puengasí",
            type: "urbana",
          },
          {
            code: "170126",
            name: "Quitumbe",
            type: "urbana",
          },
          {
            code: "170127",
            name: "Rumipamba",
            type: "urbana",
          },
          {
            code: "170128",
            name: "San Bartolo",
            type: "urbana",
          },
          {
            code: "170129",
            name: "San Isidro del Inca",
            type: "urbana",
          },
          {
            code: "170130",
            name: "San Juan",
            type: "urbana",
          },
          {
            code: "170131",
            name: "Solanda",
            type: "urbana",
          },
          {
            code: "170132",
            name: "Turubamba",
            type: "urbana",
          },
          {
            code: "170150",
            name: "Quito",
            type: "urbana",
          },
          {
            code: "170151",
            name: "Alangasí",
            type: "rural",
          },
          {
            code: "170152",
            name: "Amaguaña",
            type: "rural",
          },
          {
            code: "170153",
            name: "Atahualpa",
            type: "rural",
          },
          {
            code: "170154",
            name: "Calacalí",
            type: "rural",
          },
          {
            code: "170155",
            name: "Calderón",
            type: "rural",
          },
          {
            code: "170156",
            name: "Conocoto",
            type: "rural",
          },
          {
            code: "170157",
            name: "Cumbayá",
            type: "rural",
          },
          {
            code: "170158",
            name: "Chavezpamba",
            type: "rural",
          },
          {
            code: "170159",
            name: "Checa",
            type: "rural",
          },
          {
            code: "170160",
            name: "El Quinche",
            type: "rural",
          },
          {
            code: "170161",
            name: "Gualea",
            type: "rural",
          },
          {
            code: "170162",
            name: "Guangopolo",
            type: "rural",
          },
          {
            code: "170163",
            name: "Guayllabamba",
            type: "rural",
          },
          {
            code: "170164",
            name: "La Merced",
            type: "rural",
          },
          {
            code: "170165",
            name: "Llano Chico",
            type: "rural",
          },
          {
            code: "170166",
            name: "Lloa",
            type: "rural",
          },
          {
            code: "170168",
            name: "Nanegal",
            type: "rural",
          },
          {
            code: "170169",
            name: "Nanegalito",
            type: "rural",
          },
          {
            code: "170170",
            name: "Nayón",
            type: "rural",
          },
          {
            code: "170171",
            name: "Nono",
            type: "rural",
          },
          {
            code: "170172",
            name: "Pacto",
            type: "rural",
          },
          {
            code: "170174",
            name: "Perucho",
            type: "rural",
          },
          {
            code: "170175",
            name: "Pifo",
            type: "rural",
          },
          {
            code: "170176",
            name: "Píntag",
            type: "rural",
          },
          {
            code: "170177",
            name: "Pomasqui",
            type: "rural",
          },
          {
            code: "170178",
            name: "Puéllaro",
            type: "rural",
          },
          {
            code: "170179",
            name: "Puembo",
            type: "rural",
          },
          {
            code: "170180",
            name: "San Antonio de Pichincha",
            type: "rural",
          },
          {
            code: "170181",
            name: "San José de Minas",
            type: "rural",
          },
          {
            code: "170183",
            name: "Tababela",
            type: "rural",
          },
          {
            code: "170184",
            name: "Tumbaco",
            type: "rural",
          },
          {
            code: "170185",
            name: "Yaruquí",
            type: "rural",
          },
          {
            code: "170186",
            name: "Zámbiza",
            type: "rural",
          },
        ],
      },
      {
        code: "1702",
        name: "Cayambe",
        parishes: [
          {
            code: "170250",
            name: "Cayambe",
            type: "urbana",
          },
          {
            code: "170251",
            name: "Ascázubi",
            type: "rural",
          },
          {
            code: "170252",
            name: "Cangahua",
            type: "rural",
          },
          {
            code: "170253",
            name: "Olmedo",
            type: "rural",
          },
          {
            code: "170254",
            name: "Otón",
            type: "rural",
          },
          {
            code: "170255",
            name: "Santa Rosa de Cuzubamba",
            type: "rural",
          },
          {
            code: "170256",
            name: "San José de Ayora",
            type: "rural",
          },
          {
            code: "170257",
            name: "Juan Montalvo",
            type: "rural",
          },
        ],
      },
      {
        code: "1703",
        name: "Mejía",
        parishes: [
          {
            code: "170350",
            name: "Machachi",
            type: "urbana",
          },
          {
            code: "170351",
            name: "Aloag",
            type: "rural",
          },
          {
            code: "170352",
            name: "Aloasí",
            type: "rural",
          },
          {
            code: "170353",
            name: "Cutuglahua",
            type: "rural",
          },
          {
            code: "170354",
            name: "El Chaupi",
            type: "rural",
          },
          {
            code: "170355",
            name: "Manuel Cornejo Astorga",
            type: "rural",
          },
          {
            code: "170356",
            name: "Tambillo",
            type: "rural",
          },
          {
            code: "170357",
            name: "Uyumbicho",
            type: "rural",
          },
        ],
      },
      {
        code: "1704",
        name: "Pedro Moncayo",
        parishes: [
          {
            code: "170450",
            name: "Tabacundo",
            type: "urbana",
          },
          {
            code: "170451",
            name: "La Esperanza",
            type: "rural",
          },
          {
            code: "170452",
            name: "Malchinguí",
            type: "rural",
          },
          {
            code: "170453",
            name: "Tocachi",
            type: "rural",
          },
          {
            code: "170454",
            name: "Tupigachi",
            type: "rural",
          },
        ],
      },
      {
        code: "1705",
        name: "Rumiñahui",
        parishes: [
          {
            code: "170550",
            name: "Sangolquí",
            type: "urbana",
          },
          {
            code: "170551",
            name: "Cotogchoa",
            type: "rural",
          },
          {
            code: "170552",
            name: "Rumipamba",
            type: "rural",
          },
        ],
      },
      {
        code: "1707",
        name: "San Miguel de los Bancos",
        parishes: [
          {
            code: "170750",
            name: "San Miguel de los Bancos",
            type: "urbana",
          },
          {
            code: "170751",
            name: "Mindo",
            type: "rural",
          },
        ],
      },
      {
        code: "1708",
        name: "Pedro Vicente Maldonado",
        parishes: [
          {
            code: "170850",
            name: "Pedro Vicente Maldonado",
            type: "urbana",
          },
        ],
      },
      {
        code: "1709",
        name: "Puerto Quito",
        parishes: [
          {
            code: "170950",
            name: "Puerto Quito",
            type: "urbana",
          },
        ],
      },
    ],
  },
  {
    code: "18",
    name: "Tungurahua",
    cantons: [
      {
        code: "1801",
        name: "Ambato",
        parishes: [
          {
            code: "180150",
            name: "Ambato",
            type: "urbana",
          },
          {
            code: "180151",
            name: "Ambatillo",
            type: "rural",
          },
          {
            code: "180152",
            name: "Atahualpa",
            type: "rural",
          },
          {
            code: "180153",
            name: "Augusto N. Martínez",
            type: "rural",
          },
          {
            code: "180154",
            name: "Constantino Fernández",
            type: "rural",
          },
          {
            code: "180155",
            name: "Huachi Grande",
            type: "rural",
          },
          {
            code: "180156",
            name: "Izamba",
            type: "rural",
          },
          {
            code: "180157",
            name: "Juan Benigno Vela",
            type: "rural",
          },
          {
            code: "180158",
            name: "Montalvo",
            type: "rural",
          },
          {
            code: "180159",
            name: "Pasa",
            type: "rural",
          },
          {
            code: "180160",
            name: "Picaihua",
            type: "rural",
          },
          {
            code: "180161",
            name: "Pilagüín",
            type: "rural",
          },
          {
            code: "180162",
            name: "Quisapincha",
            type: "rural",
          },
          {
            code: "180163",
            name: "San Bartolomé de Pinllo",
            type: "rural",
          },
          {
            code: "180164",
            name: "San Fernando",
            type: "rural",
          },
          {
            code: "180165",
            name: "Santa Rosa",
            type: "rural",
          },
          {
            code: "180166",
            name: "Totoras",
            type: "rural",
          },
          {
            code: "180167",
            name: "Cunchibamba",
            type: "rural",
          },
          {
            code: "180168",
            name: "Unamuncho",
            type: "rural",
          },
        ],
      },
      {
        code: "1802",
        name: "Baños de Agua Santa",
        parishes: [
          {
            code: "180250",
            name: "Baños",
            type: "urbana",
          },
          {
            code: "180251",
            name: "Lligua",
            type: "rural",
          },
          {
            code: "180252",
            name: "Río Negro",
            type: "rural",
          },
          {
            code: "180253",
            name: "Río Verde",
            type: "rural",
          },
          {
            code: "180254",
            name: "Ulba",
            type: "rural",
          },
        ],
      },
      {
        code: "1803",
        name: "Cevallos",
        parishes: [
          {
            code: "180350",
            name: "Cevallos",
            type: "urbana",
          },
        ],
      },
      {
        code: "1804",
        name: "Mocha",
        parishes: [
          {
            code: "180450",
            name: "Mocha",
            type: "urbana",
          },
          {
            code: "180451",
            name: "Pinguilí",
            type: "rural",
          },
        ],
      },
      {
        code: "1805",
        name: "Patate",
        parishes: [
          {
            code: "180550",
            name: "Patate",
            type: "urbana",
          },
          {
            code: "180551",
            name: "El Triunfo",
            type: "rural",
          },
          {
            code: "180552",
            name: "Los Andes",
            type: "rural",
          },
          {
            code: "180553",
            name: "Sucre",
            type: "rural",
          },
        ],
      },
      {
        code: "1806",
        name: "Quero",
        parishes: [
          {
            code: "180650",
            name: "Quero",
            type: "urbana",
          },
          {
            code: "180651",
            name: "Rumipamba",
            type: "rural",
          },
          {
            code: "180652",
            name: "Yanayacu Mochapata",
            type: "rural",
          },
        ],
      },
      {
        code: "1807",
        name: "San Pedro de Pelileo",
        parishes: [
          {
            code: "180750",
            name: "Pelileo",
            type: "urbana",
          },
          {
            code: "180751",
            name: "Benítez",
            type: "rural",
          },
          {
            code: "180752",
            name: "Bolívar",
            type: "rural",
          },
          {
            code: "180753",
            name: "Cotaló",
            type: "rural",
          },
          {
            code: "180754",
            name: "Chiquicha",
            type: "rural",
          },
          {
            code: "180755",
            name: "El Rosario",
            type: "rural",
          },
          {
            code: "180756",
            name: "García Moreno",
            type: "rural",
          },
          {
            code: "180757",
            name: "Guambaló",
            type: "rural",
          },
          {
            code: "180758",
            name: "Salasaca",
            type: "rural",
          },
        ],
      },
      {
        code: "1808",
        name: "Santiago de Píllaro",
        parishes: [
          {
            code: "180850",
            name: "Píllaro",
            type: "urbana",
          },
          {
            code: "180851",
            name: "Baquerizo Moreno",
            type: "rural",
          },
          {
            code: "180852",
            name: "Emilio María Terán",
            type: "rural",
          },
          {
            code: "180853",
            name: "Marcos Espinel",
            type: "rural",
          },
          {
            code: "180854",
            name: "Presidente Urbina",
            type: "rural",
          },
          {
            code: "180855",
            name: "San Andrés",
            type: "rural",
          },
          {
            code: "180856",
            name: "San José de Poaló",
            type: "rural",
          },
          {
            code: "180857",
            name: "San Miguelito",
            type: "rural",
          },
        ],
      },
      {
        code: "1809",
        name: "Tisaleo",
        parishes: [
          {
            code: "180950",
            name: "Tisaleo",
            type: "urbana",
          },
          {
            code: "180951",
            name: "Quinchicoto",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "19",
    name: "Zamora Chinchipe",
    cantons: [
      {
        code: "1901",
        name: "Zamora",
        parishes: [
          {
            code: "190150",
            name: "Zamora",
            type: "urbana",
          },
          {
            code: "190151",
            name: "Cumbaratza",
            type: "rural",
          },
          {
            code: "190152",
            name: "Guadalupe",
            type: "rural",
          },
          {
            code: "190153",
            name: "Imbana",
            type: "rural",
          },
          {
            code: "190155",
            name: "Sabanilla",
            type: "rural",
          },
          {
            code: "190156",
            name: "Timbara",
            type: "rural",
          },
          {
            code: "190158",
            name: "San Carlos de las Minas",
            type: "rural",
          },
        ],
      },
      {
        code: "1902",
        name: "Chinchipe",
        parishes: [
          {
            code: "190250",
            name: "Zumba",
            type: "urbana",
          },
          {
            code: "190251",
            name: "Chito",
            type: "rural",
          },
          {
            code: "190252",
            name: "El Chorro",
            type: "rural",
          },
          {
            code: "190254",
            name: "La Chonta",
            type: "rural",
          },
          {
            code: "190256",
            name: "Pucapamba",
            type: "rural",
          },
          {
            code: "190259",
            name: "San Andrés",
            type: "rural",
          },
        ],
      },
      {
        code: "1903",
        name: "Nangaritza",
        parishes: [
          {
            code: "190350",
            name: "Guayzimi",
            type: "urbana",
          },
          {
            code: "190351",
            name: "Zurmi",
            type: "rural",
          },
          {
            code: "190352",
            name: "Nuevo Paraíso",
            type: "rural",
          },
          {
            code: "190353",
            name: "Nankais",
            type: "rural",
          },
        ],
      },
      {
        code: "1904",
        name: "Yacuambi",
        parishes: [
          {
            code: "190450",
            name: "28 de Mayo",
            type: "urbana",
          },
          {
            code: "190451",
            name: "La Paz",
            type: "rural",
          },
          {
            code: "190452",
            name: "Tutupali",
            type: "rural",
          },
        ],
      },
      {
        code: "1905",
        name: "Yantzaza",
        parishes: [
          {
            code: "190550",
            name: "Yantzaza",
            type: "urbana",
          },
          {
            code: "190551",
            name: "Chicaña",
            type: "rural",
          },
          {
            code: "190553",
            name: "Los Encuentros",
            type: "rural",
          },
        ],
      },
      {
        code: "1906",
        name: "El Pangui",
        parishes: [
          {
            code: "190650",
            name: "El Pangui",
            type: "urbana",
          },
          {
            code: "190651",
            name: "El Guisme",
            type: "rural",
          },
          {
            code: "190652",
            name: "Pachicutza",
            type: "rural",
          },
          {
            code: "190653",
            name: "Tundayme",
            type: "rural",
          },
        ],
      },
      {
        code: "1907",
        name: "Centinela del Cóndor",
        parishes: [
          {
            code: "190750",
            name: "Zumbi",
            type: "urbana",
          },
          {
            code: "190752",
            name: "Triunfo Dorado",
            type: "rural",
          },
          {
            code: "190753",
            name: "Panguintza",
            type: "rural",
          },
        ],
      },
      {
        code: "1908",
        name: "Palanda",
        parishes: [
          {
            code: "190850",
            name: "Palanda",
            type: "urbana",
          },
          {
            code: "190851",
            name: "El Porvenir del Carmen",
            type: "rural",
          },
          {
            code: "190852",
            name: "San Francisco del Vergel",
            type: "rural",
          },
          {
            code: "190853",
            name: "Valladolid",
            type: "rural",
          },
          {
            code: "190854",
            name: "La Canela",
            type: "rural",
          },
        ],
      },
      {
        code: "1909",
        name: "Paquisha",
        parishes: [
          {
            code: "190950",
            name: "Paquisha",
            type: "urbana",
          },
          {
            code: "190951",
            name: "Bellavista",
            type: "rural",
          },
          {
            code: "190952",
            name: "Nuevo Quito",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "20",
    name: "Galápagos",
    cantons: [
      {
        code: "2001",
        name: "San Cristóbal",
        parishes: [
          {
            code: "200150",
            name: "Puerto Baquerizo Moreno",
            type: "urbana",
          },
          {
            code: "200151",
            name: "El Progreso",
            type: "rural",
          },
          {
            code: "200152",
            name: "Isla Santa María Floreana",
            type: "rural",
          },
        ],
      },
      {
        code: "2002",
        name: "Isabela",
        parishes: [
          {
            code: "200250",
            name: "Puerto Villamil",
            type: "urbana",
          },
          {
            code: "200251",
            name: "Tomás de Berlanga",
            type: "rural",
          },
        ],
      },
      {
        code: "2003",
        name: "Santa Cruz",
        parishes: [
          {
            code: "200350",
            name: "Puerto Ayora",
            type: "urbana",
          },
          {
            code: "200351",
            name: "Bella Vista",
            type: "rural",
          },
          {
            code: "200352",
            name: "Santa Rosa",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "21",
    name: "Sucumbíos",
    cantons: [
      {
        code: "2101",
        name: "Lago Agrio",
        parishes: [
          {
            code: "210150",
            name: "Nueva Loja",
            type: "urbana",
          },
          {
            code: "210152",
            name: "Dureno",
            type: "rural",
          },
          {
            code: "210153",
            name: "General Farfán",
            type: "rural",
          },
          {
            code: "210155",
            name: "El Eno",
            type: "rural",
          },
          {
            code: "210156",
            name: "Pacayacu",
            type: "rural",
          },
          {
            code: "210157",
            name: "Jambelí",
            type: "rural",
          },
          {
            code: "210158",
            name: "Santa Cecilia",
            type: "rural",
          },
          {
            code: "210160",
            name: "10 de Agosto",
            type: "rural",
          },
        ],
      },
      {
        code: "2102",
        name: "Gonzalo Pizarro",
        parishes: [
          {
            code: "210250",
            name: "Lumbaquí",
            type: "urbana",
          },
          {
            code: "210251",
            name: "El Reventador",
            type: "rural",
          },
          {
            code: "210252",
            name: "Gonzalo Pizarro",
            type: "rural",
          },
          {
            code: "210254",
            name: "Puerto Libre",
            type: "rural",
          },
        ],
      },
      {
        code: "2103",
        name: "Putumayo",
        parishes: [
          {
            code: "210350",
            name: "Puerto El Carmen de Putumayo",
            type: "urbana",
          },
          {
            code: "210351",
            name: "Palma Roja",
            type: "rural",
          },
          {
            code: "210352",
            name: "Puerto Bolívar",
            type: "rural",
          },
          {
            code: "210353",
            name: "Puerto Rodríguez",
            type: "rural",
          },
          {
            code: "210354",
            name: "Santa Elena",
            type: "rural",
          },
          {
            code: "210355",
            name: "Sansahuari",
            type: "rural",
          },
        ],
      },
      {
        code: "2104",
        name: "Shushufindi",
        parishes: [
          {
            code: "210450",
            name: "Shushufindi",
            type: "urbana",
          },
          {
            code: "210451",
            name: "Limoncocha",
            type: "rural",
          },
          {
            code: "210452",
            name: "Pañacocha",
            type: "rural",
          },
          {
            code: "210453",
            name: "San Roque",
            type: "rural",
          },
          {
            code: "210454",
            name: "San Pedro de los Cofánes",
            type: "rural",
          },
          {
            code: "210455",
            name: "Siete de Julio",
            type: "rural",
          },
          {
            code: "210456",
            name: "La Magdalena",
            type: "rural",
          },
          {
            code: "210457",
            name: "La Primavera",
            type: "rural",
          },
        ],
      },
      {
        code: "2105",
        name: "Sucumbíos",
        parishes: [
          {
            code: "210550",
            name: "La Bonita",
            type: "urbana",
          },
          {
            code: "210551",
            name: "El Playón de San Francisco",
            type: "rural",
          },
          {
            code: "210552",
            name: "La Sofía",
            type: "rural",
          },
          {
            code: "210553",
            name: "Rosa Florida",
            type: "rural",
          },
          {
            code: "210554",
            name: "Santa Bárbara",
            type: "rural",
          },
        ],
      },
      {
        code: "2106",
        name: "Cascales",
        parishes: [
          {
            code: "210650",
            name: "El Dorado de Cascales",
            type: "urbana",
          },
          {
            code: "210651",
            name: "Santa Rosa de Sucumbíos",
            type: "rural",
          },
          {
            code: "210652",
            name: "Sevilla",
            type: "rural",
          },
          {
            code: "210653",
            name: "Nueva Troncal",
            type: "rural",
          },
        ],
      },
      {
        code: "2107",
        name: "Cuyabeno",
        parishes: [
          {
            code: "210750",
            name: "Tarapoa",
            type: "urbana",
          },
          {
            code: "210751",
            name: "Cuyabeno",
            type: "rural",
          },
          {
            code: "210752",
            name: "Aguas Negras",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "22",
    name: "Orellana",
    cantons: [
      {
        code: "2201",
        name: "Francisco de Orellana",
        parishes: [
          {
            code: "220150",
            name: "El Coca",
            type: "urbana",
          },
          {
            code: "220151",
            name: "Dayuma",
            type: "rural",
          },
          {
            code: "220152",
            name: "Taracoa",
            type: "rural",
          },
          {
            code: "220153",
            name: "Alejandro Labaka",
            type: "rural",
          },
          {
            code: "220154",
            name: "El Dorado",
            type: "rural",
          },
          {
            code: "220155",
            name: "El Edén",
            type: "rural",
          },
          {
            code: "220156",
            name: "García Moreno",
            type: "rural",
          },
          {
            code: "220157",
            name: "Inés Arango",
            type: "rural",
          },
          {
            code: "220158",
            name: "La Belleza",
            type: "rural",
          },
          {
            code: "220159",
            name: "Nuevo Paraíso",
            type: "rural",
          },
          {
            code: "220160",
            name: "San José de Guayusa",
            type: "rural",
          },
          {
            code: "220161",
            name: "San Luis de Armenia",
            type: "rural",
          },
        ],
      },
      {
        code: "2202",
        name: "Aguarico",
        parishes: [
          {
            code: "220250",
            name: "Nuevo Rocafuerte",
            type: "urbana",
          },
          {
            code: "220251",
            name: "Capitán Augusto Rivadeneyra",
            type: "rural",
          },
          {
            code: "220252",
            name: "Cononaco",
            type: "rural",
          },
          {
            code: "220253",
            name: "Santa María de Huiririma",
            type: "rural",
          },
          {
            code: "220255",
            name: "Yasuní",
            type: "rural",
          },
        ],
      },
      {
        code: "2203",
        name: "La Joya de los Sachas",
        parishes: [
          {
            code: "220350",
            name: "La Joya de los Sachas",
            type: "urbana",
          },
          {
            code: "220351",
            name: "Enokanqui",
            type: "rural",
          },
          {
            code: "220352",
            name: "Pompeya",
            type: "rural",
          },
          {
            code: "220353",
            name: "San Carlos",
            type: "rural",
          },
          {
            code: "220354",
            name: "San Sebastián del Coca",
            type: "rural",
          },
          {
            code: "220355",
            name: "Lago San Pedro",
            type: "rural",
          },
          {
            code: "220356",
            name: "Rumipamba",
            type: "rural",
          },
          {
            code: "220357",
            name: "Tres de Noviembre",
            type: "rural",
          },
          {
            code: "220358",
            name: "Unión Milagreña",
            type: "rural",
          },
        ],
      },
      {
        code: "2204",
        name: "Loreto",
        parishes: [
          {
            code: "220450",
            name: "Loreto",
            type: "urbana",
          },
          {
            code: "220451",
            name: "Ávila",
            type: "rural",
          },
          {
            code: "220452",
            name: "Puerto Murialdo",
            type: "rural",
          },
          {
            code: "220453",
            name: "San José de Payamino",
            type: "rural",
          },
          {
            code: "220454",
            name: "San José de Dahuano",
            type: "rural",
          },
          {
            code: "220455",
            name: "San Vicente de Huaticocha",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "23",
    name: "Santo Domingo de los Tsáchilas",
    cantons: [
      {
        code: "2301",
        name: "Santo Domingo",
        parishes: [
          {
            code: "230150",
            name: "Santo Domingo de los Colorados",
            type: "urbana",
          },
          {
            code: "230151",
            name: "Alluriquín",
            type: "rural",
          },
          {
            code: "230152",
            name: "Puerto Limón",
            type: "rural",
          },
          {
            code: "230153",
            name: "Luz de América",
            type: "rural",
          },
          {
            code: "230154",
            name: "San Jacinto del Búa",
            type: "rural",
          },
          {
            code: "230155",
            name: "Valle Hermoso",
            type: "rural",
          },
          {
            code: "230156",
            name: "El Esfuerzo",
            type: "rural",
          },
          {
            code: "230157",
            name: "Santa María del Toachi",
            type: "rural",
          },
        ],
      },
      {
        code: "2302",
        name: "La Concordia",
        parishes: [
          {
            code: "230250",
            name: "La Concordia",
            type: "urbana",
          },
          {
            code: "230251",
            name: "Monterrey",
            type: "rural",
          },
          {
            code: "230252",
            name: "La Villegas",
            type: "rural",
          },
          {
            code: "230253",
            name: "Plan Piloto",
            type: "rural",
          },
        ],
      },
    ],
  },
  {
    code: "24",
    name: "Santa Elena",
    cantons: [
      {
        code: "2401",
        name: "Santa Elena",
        parishes: [
          {
            code: "240150",
            name: "Santa Elena",
            type: "urbana",
          },
          {
            code: "240151",
            name: "Atahualpa",
            type: "rural",
          },
          {
            code: "240152",
            name: "Colonche",
            type: "rural",
          },
          {
            code: "240153",
            name: "Chanduy",
            type: "rural",
          },
          {
            code: "240154",
            name: "Manglaralto",
            type: "rural",
          },
          {
            code: "240155",
            name: "Simón Bolívar",
            type: "rural",
          },
          {
            code: "240156",
            name: "San José de Ancón",
            type: "rural",
          },
        ],
      },
      {
        code: "2402",
        name: "La Libertad",
        parishes: [
          {
            code: "240250",
            name: "La Libertad",
            type: "urbana",
          },
        ],
      },
      {
        code: "2403",
        name: "Salinas",
        parishes: [
          {
            code: "240350",
            name: "Salinas",
            type: "urbana",
          },
          {
            code: "240351",
            name: "Anconcito",
            type: "rural",
          },
          {
            code: "240352",
            name: "José Luis Tamayo",
            type: "rural",
          },
        ],
      },
    ],
  },
];

export const ECUADOR_PROVINCES = ECUADOR_LOCATIONS;

export function getCantonsByProvince(provinceCode: string) {
  return ECUADOR_LOCATIONS.find((province) => province.code === provinceCode)?.cantons ?? [];
}

export function getParishesByCanton(cantonCode: string) {
  for (const province of ECUADOR_LOCATIONS) {
    const canton = province.cantons.find((item) => item.code === cantonCode);
    if (canton) return canton.parishes;
  }
  return [];
}