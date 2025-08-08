import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express();
const port = process.env.PORT || 3000;

app.get("/api/scrape", async (req, res) => {
	const { keyword } = req.query;

	if (!keyword) {
		return res.status(400).json({ error: "Missing keyword query parameter" });
	}

	try {
		const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword as string)}`;
		const { data } = await axios.get(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			},
		});

		const dom = new JSDOM(data);
		const { document } = dom.window;

		const productElements = document.querySelectorAll('div[data-component-type="s-search-result"]');
		const products = Array.from(productElements).map((element) => {
			const title = element.querySelector("a h2 span")?.textContent?.trim() || "N/A";
			const ratingText = element.querySelector(".a-icon-alt")?.textContent;
			const rating = ratingText ? parseFloat(ratingText.split(" ")[0]) : "N/A";
			const reviews = element.querySelector("span.a-size-base.s-underline-text")?.textContent?.replace(/,/g, "") || "0";
			const image = element.querySelector(".s-image")?.getAttribute("src") || "N/A";

			return {
				title,
				rating,
				reviews: parseInt(reviews, 10),
				image,
			};
		});

		res.json(products);
	} catch (error) {
		console.error("Scraping error:", error);
		res.status(500).json({ error: "Failed to scrape data" });
	}
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
