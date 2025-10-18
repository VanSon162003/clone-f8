import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutButton() {
    const handleCheckout = async () => {
        const response = await fetch(
            "http://localhost:3001/api/v1/payments/5",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: [
                        { name: "Khóa học ReactJS", price: 10, quantity: 1 },
                    ],
                }),
            }
        );

        const data = await response.json();
        window.location.href = data.url; // chuyển hướng đến trang thanh toán Stripe
    };

    return <button onClick={handleCheckout}>Thanh toán ngay</button>;
}

export default CheckoutButton;
