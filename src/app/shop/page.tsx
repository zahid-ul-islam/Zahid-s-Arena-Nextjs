import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

async function getProducts(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  await dbConnect();

  const category = searchParams.category;
  const team = searchParams.team;
  const search = searchParams.search;
  const sort = searchParams.sort;
  const productType = searchParams.productType;

  const query: Record<string, unknown> = {};
  if (category) query.category = category;
  if (team) query.team = team;
  if (productType) query.productType = productType;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { team: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }
  if (sort === "newest") {
    query.isNewArrival = true;
  }

  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  return products.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">
          {params.sort === "newest"
            ? "New Arrivals"
            : params.productType === "football"
            ? "Footballs"
            : params.productType === "shoes"
            ? "Shoes"
            : params.productType === "equipment"
            ? "Equipment"
            : "Shop"}
        </h1>

        {/* Search Form */}
        <SearchBar placeholder="Search products..." />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Product Type</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/shop" className="hover:text-primary">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?productType=kit"
                  className="hover:text-primary"
                >
                  Football Kits
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?productType=football"
                  className="hover:text-primary"
                >
                  Footballs
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?productType=shoes"
                  className="hover:text-primary"
                >
                  Shoes
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?productType=equipment"
                  className="hover:text-primary"
                >
                  Equipment
                </Link>
              </li>
            </ul>
          </div>

          {params.productType === "kit" && (
            <div>
              <h3 className="font-semibold mb-3">Leagues</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/shop?productType=kit"
                    className="hover:text-primary"
                  >
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?productType=kit&category=Premier League"
                    className="hover:text-primary"
                  >
                    Premier League
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?productType=kit&category=La Liga"
                    className="hover:text-primary"
                  >
                    La Liga
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?productType=kit&category=Bundesliga"
                    className="hover:text-primary"
                  >
                    Bundesliga
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?productType=kit&category=Serie A"
                    className="hover:text-primary"
                  >
                    Serie A
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1 grow">
          {products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="group"
                >
                  <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border h-full flex flex-col">
                    <div className="relative aspect-4/5 overflow-hidden bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 grow flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {product.team}
                        </p>
                        <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-semibold text-primary">
                          ${product.price}
                        </p>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
