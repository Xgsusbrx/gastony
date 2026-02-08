import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

// Import route components
import RootLayout from "./routes/__root";
import HomePage from "./routes/app/home";
import LoginPage from "./routes/auth/login";
import RegisterPage from "./routes/auth/register";
import IndexPage from "./routes/index";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

// Create a new router instance
const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{ index: true, element: <IndexPage /> },
			{ path: "auth/login", element: <LoginPage /> },
			{ path: "auth/register", element: <RegisterPage /> },
			{ path: "app/home", element: <HomePage /> },
		],
	},
]);

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
