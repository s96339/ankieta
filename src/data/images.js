export const imageSets = [
	{
		id: "img1",
		original: "images/originals/img1.png",
		degraded: [
			{
				id: "img1_unet_denoised.jpg",
				src: "images/degraded/img1_unet_denoised.jpg",
			},
		],
	},

	{
		id: "kodim19",
		original: "images/originals/kodim19.jpg",
		degraded: [
			{
				id: "kodim19-1-12.jp2.png",
				src: "images/degraded/kodim19-1-12.jp2.png",
			},
			{
				id: "kodim19-1-15.webp.png",
				src: "images/degraded/kodim19-1-15.webp.png",
			},
			{
				id: "kodim19-1-19.jpg.png",
				src: "images/degraded/kodim19-1-19.jpg.png",
			},
			{
				id: "kodim19-1-24.webp.png",
				src: "images/degraded/kodim19-1-24.webp.png",
			},
			{
				id: "kodim19-1-27.jpg.png",
				src: "images/degraded/kodim19-1-27.jpg.png",
			},
			{
				id: "kodim19-1-27.webp.png",
				src: "images/degraded/kodim19-1-27.webp.png",
			},
			{
				id: "kodim19-1-47.jpg.png",
				src: "images/degraded/kodim19-1-47.jpg.png",
			},
			{
				id: "kodim19-1-54.jpg.png",
				src: "images/degraded/kodim19-1-54.jpg.png",
			},
			{
				id: "kodim19-1-63.jpg.png",
				src: "images/degraded/kodim19-1-63.jpg.png",
			},
			{
				id: "kodim19-1-65.avif.png",
				src: "images/degraded/kodim19-1-65.avif.png",
			},
			{
				id: "kodim19-1-69.jp2.png",
				src: "images/degraded/kodim19-1-69.jp2.png",
			},
			{
				id: "kodim19-1-76.avif.png",
				src: "images/degraded/kodim19-1-76.avif.png",
			},
			{
				id: "kodim19-1-77.avif.png",
				src: "images/degraded/kodim19-1-77.avif.png",
			},
			{
				id: "kodim19-1-87.jpg.png",
				src: "images/degraded/kodim19-1-87.jpg.png",
			},
			{
				id: "kodim19-1-92.jpg.png",
				src: "images/degraded/kodim19-1-92.jpg.png",
			},
		],
	},

	{
		id: "kodim22",
		original: "images/originals/kodim22.jpg",
		degraded: [
			{
				id: "kodim22-1-22.jpg.png",
				src: "images/degraded/kodim22-1-22.jpg.png",
			},
			{
				id: "kodim22-1-23.jp2.png",
				src: "images/degraded/kodim22-1-23.jp2.png",
			},
			{
				id: "kodim22-1-23.jpg.png",
				src: "images/degraded/kodim22-1-23.jpg.png",
			},
			{
				id: "kodim22-1-27.avif.png",
				src: "images/degraded/kodim22-1-27.avif.png",
			},
			{
				id: "kodim22-1-38.avif.png",
				src: "images/degraded/kodim22-1-38.avif.png",
			},
			{
				id: "kodim22-1-40.jpg.png",
				src: "images/degraded/kodim22-1-40.jpg.png",
			},
			{
				id: "kodim22-1-50.jp2.png",
				src: "images/degraded/kodim22-1-50.jp2.png",
			},
			{
				id: "kodim22-1-66.webp.png",
				src: "images/degraded/kodim22-1-66.webp.png",
			},
			{
				id: "kodim22-1-75.webp.png",
				src: "images/degraded/kodim22-1-75.webp.png",
			},
		],
	},

	{
		id: "kodim23",
		original: "images/originals/kodim23.png",
		degraded: [
			{
				id: "kodim23-1-25.jp2.png",
				src: "images/degraded/kodim23-1-25.jp2.png",
			},
			{
				id: "kodim23-1-37.jpg.png",
				src: "images/degraded/kodim23-1-37.jpg.png",
			},
			{
				id: "kodim23-1-52.jpg.png",
				src: "images/degraded/kodim23-1-52.jpg.png",
			},
			{
				id: "kodim23-1-53.avif.png",
				src: "images/degraded/kodim23-1-53.avif.png",
			},
			{
				id: "kodim23-1-59.jp2.png",
				src: "images/degraded/kodim23-1-59.jp2.png",
			},
			{
				id: "kodim23-1-63.avif.png",
				src: "images/degraded/kodim23-1-63.avif.png",
			},
			{
				id: "kodim23-1-94.webp.png",
				src: "images/degraded/kodim23-1-94.webp.png",
			},
		],
	},
];

export const ratingLabels = [
	{
		value: 6,
		label: "zajebiscie",
		description: "nie widać żadnych różnic między dwoma obrazami",
	},
	{
		value: 5,
		label: "Brak widocznych zniekształceń",
		description: "nie widać żadnych różnic między dwoma obrazami",
	},
	{
		value: 4,
		label: "Mało widoczne zniekształcenia",
		description:
			"między obrazami istnieją mało widoczne różnice występujące na małym obszarze",
	},
	{
		value: 3,
		label: "Zauważalne zniekształcenia",
		description:
			"zniekształcenia są łatwo zauważalne, lecz nie zakrywają treści obrazu",
	},
	{
		value: 2,
		label: "Częściowo nieczytelny",
		description:
			"zniekształcenia zakrywają treść obrazu na niewielkim obszarze",
	},
	{
		value: 1,
		label: "W większości nieczytelny",
		description:
			"zniekształcenia zakrywają treść obrazu na znacząco dużym obszarze",
	},
];
