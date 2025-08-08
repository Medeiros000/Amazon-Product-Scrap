document.getElementById("searchBtn").addEventListener("click", async () => {
	const keyword = document.getElementById("keyword").value.trim();
	const resultsDiv = document.getElementById("results");
	resultsDiv.innerHTML = "";
	if (!keyword) {
		resultsDiv.innerHTML = '<p style="color:red">Please enter a keyword.</p>';
		return;
	}
	resultsDiv.innerHTML = "<p>Loading...</p>";
	try {
		const response = await fetch(`/api/scrape?keyword=${encodeURIComponent(keyword)}`);
		if (!response.ok) throw new Error("Failed to fetch");
		const products = await response.json();
		if (!products.length) {
			resultsDiv.innerHTML = "<p>No products found.</p>";
			return;
		}
		resultsDiv.innerHTML = products
			.map(
				(product) => `
      <div class="product">
        <table class="product-table">
          <tbody>
            <tr>
              <td><span>Title</span></td><td><span class="product-scraped">${product.title}</span></td>
            </tr>
            <tr>
              <td><span>Image</span></td><td><span class="product-scraped">${product.image}</span></td>
            </tr>
            <tr>
              <td><span>Rating</span></td><td><span class="product-scraped">${product.rating}</span></td>
            </tr>
            <tr>
              <td><span>Reviews</span></td><td><span class="product-scraped">${product.reviews}</span></td>
            </tr>
          </tbody>
      </table>
    </div>
  `
			)
			.join("");
	} catch (err) {
		resultsDiv.innerHTML = '<p style="color:red">To discuss automated access to Amazon data please contact api-services-support@amazon.com.</p>';
	}
});
