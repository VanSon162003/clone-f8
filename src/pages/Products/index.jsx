import productServices from "@/services/productServices";
import httpRequest from "@/utils/httpRequest";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await productServices.getAll();
            if (res.data) {
                setProducts(res.data);
            }
        })();
    }, []);

    return (
        <div>
            <h1>Products Page</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <NavLink
                            to={`/products/${product.id}`}
                            key={product.id}
                        >
                            {product.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Products;
