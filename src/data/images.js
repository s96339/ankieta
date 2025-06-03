export const imageSets = [
	{
		id: "set1",
		original: "13jpmsFyYcjKGMOxBx5ecjONnivPj5sK4", // Ścieżka względem folderu public
		degraded: [
			{
				id: "deg1_A",
				src: "13jpmsFyYcjKGMOxBx5ecjONnivPj5sK4",
				degradationType: "Bitrate 500kbps",
			},
			{
				id: "deg1_B",
				src: "/images/degraded/original1_degradationB.jpg",
				degradationType: "Bitrate 250kbps",
			},
			{
				id: "deg1_C",
				src: "/images/degraded/original1_degradationC.jpg",
				degradationType: "Compression 80%",
			},
		],
	},
	{
		id: "kodim22",
		original: "1cz9zXVGemtFx8uUUWPVWQrXVVrD8lw-D",
		degraded: [
			{
				id: "deg2_A",
				src: "1Vsieks57BMfMsS00R-NCYYjvEefe6Ug6",
			},
			{
				id: "deg2_B",
				src: "/images/degraded/original2_degradationB.png",
				degradationType: "Bitrate 300kbps",
			},
		],
	},
	// Dodaj więcej zestawów obrazów według potrzeb
];

export const ratingLabels = [
	{ value: 1, label: "W większości nieczytelny" },
	{ value: 2, label: "Częściowo nieczytelny" },
	{ value: 3, label: "Zauważalne zniekształcenia" },
	{ value: 4, label: "Mało widoczne zniekształcenia" },
	{ value: 5, label: "Brak widocznych zniekształceń" },
];
