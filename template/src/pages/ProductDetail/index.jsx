import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
    const [product, setProduct] = useState({});

    const param = useParams();
    console.log(product);

    useEffect(() => {
        fetch(`https://dummyjson.com/products/${param.id}`)
            .then((res) => res.json())
            .then((data) => setProduct(data));
    }, [param.id]);

    return <>{product.title}</>;
}

export default ProductDetail;
